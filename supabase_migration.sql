-- jp-word-srs: per-user app data storage
create table if not exists public.user_app_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_app_data enable row level security;

create policy "select own data" on public.user_app_data
  for select using (auth.uid() = user_id);

create policy "insert own data" on public.user_app_data
  for insert with check (auth.uid() = user_id);

create policy "update own data" on public.user_app_data
  for update using (auth.uid() = user_id);

-- ============================================================
-- 2026-08-12: 관리자 모드 / 멘토 모드 (역할 기반 접근)
-- ============================================================

-- 계정 역할: mentee(기본, 일반 학습자) / mentor / admin
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  role text not null default 'mentee' check (role in ('admin', 'mentor', 'mentee')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- RLS 정책에서 재귀 없이 "내 role"을 안전하게 조회하기 위한 헬퍼 (security definer)
create or replace function public.current_role()
returns text
language sql stable security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create policy "select own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "admin mentor select all profiles" on public.profiles
  for select using (public.current_role() in ('admin', 'mentor'));

-- 신규 가입(초대 링크) 시 자동으로 mentee 프로필 생성
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'mentee')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- admin/mentor는 전체 회원의 학습 데이터를 조회할 수 있어야 진행도를 볼 수 있음
create policy "admin mentor select all app data" on public.user_app_data
  for select using (public.current_role() in ('admin', 'mentor'));

-- 멘티별 알림 주기 / 숙제 Day 범위 설정 (멘토가 지정, 실제 알림 발송은 아직 없음 — 화면 표시만)
create table if not exists public.mentor_settings (
  mentee_id uuid primary key references public.profiles (id) on delete cascade,
  reminder_interval_days int,
  homework_day_start int,
  homework_day_end int,
  homework_due_date date,
  updated_at timestamptz not null default now()
);

alter table public.mentor_settings enable row level security;

create policy "mentor manage settings" on public.mentor_settings
  for all
  using (public.current_role() in ('admin', 'mentor'))
  with check (public.current_role() in ('admin', 'mentor'));

create policy "mentee select own settings" on public.mentor_settings
  for select using (auth.uid() = mentee_id);

-- 기존에 이미 가입된 계정들은 트리거가 없어서 profiles 행이 없을 수 있음 → 1회 백필
insert into public.profiles (id, email, role)
select u.id, u.email, 'mentee'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;

-- ============================================================
-- 2026-08-12(2차): 스터디 스케줄 (가능일 투표 → 멘토 제안 → 멘티 수락/거절 → 확정)
-- 현재 멘토-멘티 배정 구조가 없어(모든 멘티가 모든 멘토에게 보임) 스케줄도 그룹 전체 공유로 둠
-- ============================================================

-- 멘티가 표시한 "이 날 스터디 가능해요" (달력 투표)
create table if not exists public.study_availability (
  mentee_id uuid not null references public.profiles (id) on delete cascade,
  date date not null,
  created_at timestamptz not null default now(),
  primary key (mentee_id, date)
);

alter table public.study_availability enable row level security;

create policy "mentee manage own availability" on public.study_availability
  for all
  using (auth.uid() = mentee_id)
  with check (auth.uid() = mentee_id);

create policy "mentor admin select availability" on public.study_availability
  for select using (public.current_role() in ('admin', 'mentor'));

-- 멘토가 제안한 스터디 일정 (투표 결과를 보고 날짜/카테고리 지정)
create table if not exists public.study_events (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  category text,
  status text not null default 'proposed' check (status in ('proposed', 'confirmed', 'cancelled')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.study_events enable row level security;

create policy "authenticated select study events" on public.study_events
  for select using (auth.uid() is not null);

create policy "mentor admin manage study events" on public.study_events
  for all
  using (public.current_role() in ('admin', 'mentor'))
  with check (public.current_role() in ('admin', 'mentor'));

-- 멘티별 제안 일정 수락/거절 응답
create table if not exists public.study_event_responses (
  event_id uuid not null references public.study_events (id) on delete cascade,
  mentee_id uuid not null references public.profiles (id) on delete cascade,
  response text not null default 'pending' check (response in ('pending', 'accepted', 'rejected')),
  updated_at timestamptz not null default now(),
  primary key (event_id, mentee_id)
);

alter table public.study_event_responses enable row level security;

create policy "mentee manage own response" on public.study_event_responses
  for all
  using (auth.uid() = mentee_id)
  with check (auth.uid() = mentee_id);

create policy "mentor admin select responses" on public.study_event_responses
  for select using (public.current_role() in ('admin', 'mentor'));

-- ============================================================
-- 2026-08-12(3차): 아이디 기반 회원가입 + 관리자 승인 필요
-- 초대 링크를 없애고 누구나 회원가입할 수 있게 하되, 관리자가 승인해야 로그인(앱 사용)이 가능해짐
-- 로그인은 이메일이 아니라 "아이디"로 함 — 내부적으로는 Supabase Auth가 이메일을 요구하므로
-- 앱에서 아이디@jpword.local 형태의 가짜 이메일을 만들어 사용
-- ============================================================

alter table public.profiles add column if not exists username text unique;
alter table public.profiles add column if not exists nickname text;
alter table public.profiles add column if not exists approved boolean not null default false;

-- 기존 admin/mentor 계정은 이미 운영 중이므로 승인된 상태로 둔다
update public.profiles set approved = true where role in ('admin', 'mentor');

-- 신규 가입 시 아이디/닉네임을 auth 메타데이터에서 읽어와 profiles에 저장, 승인 대기 상태로 시작
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, username, nickname, approved)
  values (
    new.id,
    new.email,
    'mentee',
    new.raw_user_meta_data ->> 'username',
    new.raw_user_meta_data ->> 'nickname',
    false
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 관리자/멘토가 멘티의 승인 상태를 갱신할 수 있어야 함
drop policy if exists "mentor admin update profiles" on public.profiles;
create policy "mentor admin update profiles" on public.profiles
  for update
  using (public.current_role() in ('admin', 'mentor'))
  with check (public.current_role() in ('admin', 'mentor'));

-- ============================================================
-- 2026-08-12(4차): 통계 화면 랭킹 — 멘티끼리 서로의 닉네임 + 완전암기 수를 볼 수 있어야 순위 계산 가능
-- ============================================================

-- RLS 재귀 없이 "내가 승인된 계정인지" 안전하게 조회하는 헬퍼 (security definer)
create or replace function public.current_approved()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select coalesce(approved, false) from public.profiles where id = auth.uid()
$$;

drop policy if exists "approved mentee select mentee profiles" on public.profiles;
create policy "approved mentee select mentee profiles" on public.profiles
  for select using (role = 'mentee' and public.current_approved());

drop policy if exists "approved mentee select all app data" on public.user_app_data;
create policy "approved mentee select all app data" on public.user_app_data
  for select using (public.current_approved());
