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
