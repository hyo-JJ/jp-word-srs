import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../store/AuthContext'
import { WORDS, DAY_COUNT } from '../data/words'
import { todayStr, addDaysStr } from '../srs/srs'
import { nextReminderDate } from '../utils/mentorSettings'
import MentorStudySchedule from '../components/MentorStudySchedule'

function computeSummary(rawData) {
  const data = rawData || {}
  const cards = data.cards || {}
  const events = data.events || []
  const completedDays = data.completedDays || []
  const wrongPool = data.wrongPool || []

  const today = todayStr()
  const dateSet = new Set(events.map((e) => e.date))
  let streak = 0
  let cursor = dateSet.has(today) ? today : addDaysStr(today, -1)
  while (dateSet.has(cursor)) {
    streak++
    cursor = addDaysStr(cursor, -1)
  }

  const totalMastered = Object.values(cards).filter((c) => c.status === 'mastered').length

  return {
    streak,
    completedDays: completedDays.length,
    dayCount: DAY_COUNT,
    wrongPoolCount: wrongPool.length,
    masteredRate: WORDS.length ? totalMastered / WORDS.length : 0,
  }
}

const EMPTY_FORM = { reminder_interval_days: '', homework_day_start: '', homework_day_end: '', homework_due_date: '' }

export default function MentorDashboard() {
  const { user, signOut } = useAuth()
  const [mentees, setMentees] = useState(null)
  const [dataById, setDataById] = useState({})
  const [settingsById, setSettingsById] = useState({})
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data: profiles, error: pErr } = await supabase
        .from('profiles')
        .select('id, email, created_at')
        .eq('role', 'mentee')
        .order('created_at', { ascending: true })
      if (pErr) {
        if (!cancelled) setError(pErr.message)
        return
      }
      const ids = profiles.map((p) => p.id)
      const [{ data: appRows }, { data: settingsRows }] = await Promise.all([
        ids.length ? supabase.from('user_app_data').select('user_id, data').in('user_id', ids) : Promise.resolve({ data: [] }),
        ids.length ? supabase.from('mentor_settings').select('*').in('mentee_id', ids) : Promise.resolve({ data: [] }),
      ])
      if (cancelled) return
      setMentees(profiles)
      setDataById(Object.fromEntries((appRows || []).map((r) => [r.user_id, r.data])))
      setSettingsById(Object.fromEntries((settingsRows || []).map((r) => [r.mentee_id, r])))
    }
    load().catch((err) => !cancelled && setError(err.message))
    return () => {
      cancelled = true
    }
  }, [])

  function openEdit(menteeId) {
    const s = settingsById[menteeId]
    setForm({
      reminder_interval_days: s?.reminder_interval_days ?? '',
      homework_day_start: s?.homework_day_start ?? '',
      homework_day_end: s?.homework_day_end ?? '',
      homework_due_date: s?.homework_due_date ?? '',
    })
    setEditingId(menteeId)
  }

  async function handleSave(menteeId) {
    setSaving(true)
    const payload = {
      mentee_id: menteeId,
      reminder_interval_days: form.reminder_interval_days === '' ? null : Number(form.reminder_interval_days),
      homework_day_start: form.homework_day_start === '' ? null : Number(form.homework_day_start),
      homework_day_end: form.homework_day_end === '' ? null : Number(form.homework_day_end),
      homework_due_date: form.homework_due_date || null,
      updated_at: new Date().toISOString(),
    }
    const { data: saved, error: sErr } = await supabase.from('mentor_settings').upsert(payload).select().single()
    setSaving(false)
    if (sErr) {
      alert('저장 실패: ' + sErr.message)
      return
    }
    setSettingsById((prev) => ({ ...prev, [menteeId]: saved }))
    setEditingId(null)
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <h1 style={{ whiteSpace: 'nowrap' }}>멘토 모드</h1>
        <button
          className="btn btn-ghost"
          style={{ padding: '6px 12px', fontSize: 13, flexShrink: 0 }}
          onClick={signOut}
        >
          로그아웃
        </button>
      </div>

      <div className="section-title">회원별 진행도 {mentees ? `(${mentees.length})` : ''}</div>

      {error && (
        <div className="card">
          <p style={{ margin: 0, color: 'var(--danger, #e5484d)' }}>불러오기 실패: {error}</p>
        </div>
      )}

      {!error && !mentees && (
        <div className="card">
          <p style={{ margin: 0 }}>불러오는 중...</p>
        </div>
      )}

      {mentees?.length === 0 && (
        <div className="card">
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>아직 멘티가 없어요.</p>
        </div>
      )}

      {mentees?.map((m) => {
        const summary = computeSummary(dataById[m.id])
        const settings = settingsById[m.id]
        const nextReminder = nextReminderDate(settings)
        const isEditing = editingId === m.id

        return (
          <div className="card" key={m.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ fontWeight: 600 }}>{m.email}</div>
              <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 13 }} onClick={() => (isEditing ? setEditingId(null) : openEdit(m.id))}>
                {isEditing ? '닫기' : '설정'}
              </button>
            </div>

            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
              완료 Day {summary.completedDays}/{summary.dayCount} · 오답노트 {summary.wrongPoolCount}개 · 완전암기{' '}
              {Math.round(summary.masteredRate * 100)}% · 연속학습 {summary.streak}일
            </div>

            <div style={{ fontSize: 13, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span>
                📣 알림 주기: {settings?.reminder_interval_days ? `${settings.reminder_interval_days}일마다` : '미설정'}
                {nextReminder && ` (다음 예정 ${nextReminder})`}
              </span>
              <span>
                📝 숙제:{' '}
                {settings?.homework_day_start && settings?.homework_day_end
                  ? `Day ${settings.homework_day_start}~${settings.homework_day_end}${settings.homework_due_date ? ` · 마감 ${settings.homework_due_date}` : ''}`
                  : '미설정'}
              </span>
            </div>

            {isEditing && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border, #e5e5e5)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <label style={{ fontSize: 13, display: 'block' }}>
                  <span style={{ display: 'block', marginBottom: 4 }}>학습 알림 주기 (일마다)</span>
                  <input
                    className="text-input"
                    type="number"
                    min="1"
                    placeholder="예: 3"
                    value={form.reminder_interval_days}
                    onChange={(e) => setForm((f) => ({ ...f, reminder_interval_days: e.target.value }))}
                  />
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <label style={{ fontSize: 13, flex: 1, display: 'block' }}>
                    <span style={{ display: 'block', marginBottom: 4 }}>숙제 시작 Day</span>
                    <input
                      className="text-input"
                      type="number"
                      min="1"
                      max={DAY_COUNT}
                      value={form.homework_day_start}
                      onChange={(e) => setForm((f) => ({ ...f, homework_day_start: e.target.value }))}
                    />
                  </label>
                  <label style={{ fontSize: 13, flex: 1, display: 'block' }}>
                    <span style={{ display: 'block', marginBottom: 4 }}>숙제 종료 Day</span>
                    <input
                      className="text-input"
                      type="number"
                      min="1"
                      max={DAY_COUNT}
                      value={form.homework_day_end}
                      onChange={(e) => setForm((f) => ({ ...f, homework_day_end: e.target.value }))}
                    />
                  </label>
                </div>
                <label style={{ fontSize: 13, display: 'block' }}>
                  <span style={{ display: 'block', marginBottom: 4 }}>숙제 마감일</span>
                  <input
                    className="text-input"
                    type="date"
                    value={form.homework_due_date}
                    onChange={(e) => setForm((f) => ({ ...f, homework_due_date: e.target.value }))}
                  />
                </label>
                <button className="btn btn-primary" disabled={saving} onClick={() => handleSave(m.id)}>
                  {saving ? '저장 중...' : '저장'}
                </button>
              </div>
            )}
          </div>
        )
      })}

      {mentees && mentees.length > 0 && <MentorStudySchedule menteeCount={mentees.length} />}

      <div className="section-title">설정</div>
      <div className="card">
        <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>{user?.email}로 로그인 중 (멘토)</p>
      </div>
    </div>
  )
}
