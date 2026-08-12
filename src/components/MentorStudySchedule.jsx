import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../store/AuthContext'
import { todayStr } from '../srs/srs'
import { monthGrid, todayMonthYear, addMonth } from '../utils/calendar'

const WEEKDAY_LABELS = ['월', '화', '수', '목', '금', '토', '일']
const CATEGORY_OPTIONS = [
  { value: 'study', label: '정기 스터디' },
  { value: 'extra', label: '보충' },
  { value: 'event', label: '모임' },
]
const CATEGORY_LABEL = Object.fromEntries(CATEGORY_OPTIONS.map((c) => [c.value, c.label]))

// 멘토용 스터디 스케줄 관리: 멘티들이 투표한 가능일을 보고 날짜를 제안 → 멘티 수락/거절 확인 → 확정
export default function MentorStudySchedule({ menteeCount }) {
  const { user } = useAuth()
  const [cursor, setCursor] = useState(todayMonthYear)
  const [events, setEvents] = useState([])
  const [responses, setResponses] = useState([])
  const [availability, setAvailability] = useState([])
  const [form, setForm] = useState({ date: '', category: 'study' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const today = todayStr()

  async function load() {
    const [{ data: evts, error: eErr }, { data: resp, error: rErr }, { data: avail, error: aErr }] =
      await Promise.all([
        supabase.from('study_events').select('*').neq('status', 'cancelled').order('date', { ascending: true }),
        supabase.from('study_event_responses').select('*'),
        supabase.from('study_availability').select('*'),
      ])
    const err = eErr || rErr || aErr
    if (err) {
      setError(err.message)
      return
    }
    setEvents(evts || [])
    setResponses(resp || [])
    setAvailability(avail || [])
  }

  useEffect(() => {
    load()
  }, [])

  const weeks = useMemo(() => monthGrid(cursor.year, cursor.month), [cursor])
  const availCountByDate = useMemo(() => {
    const map = {}
    for (const r of availability) map[r.date] = (map[r.date] || 0) + 1
    return map
  }, [availability])

  function tally(eventId) {
    const rs = responses.filter((r) => r.event_id === eventId)
    return {
      accepted: rs.filter((r) => r.response === 'accepted').length,
      rejected: rs.filter((r) => r.response === 'rejected').length,
    }
  }

  async function propose() {
    if (!form.date) return
    setSaving(true)
    const { error: insErr } = await supabase
      .from('study_events')
      .insert({ date: form.date, category: form.category, created_by: user.id })
    setSaving(false)
    if (insErr) {
      alert('제안 실패: ' + insErr.message)
      return
    }
    setForm({ date: '', category: 'study' })
    load()
  }

  async function setStatus(id, status) {
    const { error: updErr } = await supabase.from('study_events').update({ status }).eq('id', id)
    if (updErr) {
      alert('변경 실패: ' + updErr.message)
      return
    }
    load()
  }

  const proposed = events.filter((e) => e.status === 'proposed')
  const confirmed = events.filter((e) => e.status === 'confirmed')

  return (
    <div>
      <div className="section-title">스터디 스케줄</div>

      {error && (
        <div className="card">
          <p style={{ margin: 0, color: 'var(--danger)' }}>불러오기 실패: {error}</p>
        </div>
      )}

      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <button className="btn btn-ghost" style={{ width: 'auto', padding: '6px 10px' }} onClick={() => setCursor((c) => addMonth(c, -1))}>
            ←
          </button>
          <h2 style={{ margin: 0, fontSize: 15 }}>
            {cursor.year}년 {cursor.month}월 · 가능일 투표 현황
          </h2>
          <button className="btn btn-ghost" style={{ width: 'auto', padding: '6px 10px' }} onClick={() => setCursor((c) => addMonth(c, 1))}>
            →
          </button>
        </div>

        <div className="calendar-grid calendar-head">
          {WEEKDAY_LABELS.map((l) => (
            <div key={l} className="calendar-cell calendar-head-cell">
              {l}
            </div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div className="calendar-grid" key={wi}>
            {week.map((cell, ci) =>
              cell ? (
                <div
                  key={cell.date}
                  className={['calendar-cell', 'calendar-day', availCountByDate[cell.date] && 'is-available', cell.date === today && 'is-today']
                    .filter(Boolean)
                    .join(' ')}
                  style={{ flexDirection: 'column', gap: 0, cursor: 'default' }}
                >
                  <span>{cell.day}</span>
                  {availCountByDate[cell.date] > 0 && (
                    <span style={{ fontSize: 9, fontWeight: 700 }}>{availCountByDate[cell.date]}명</span>
                  )}
                </div>
              ) : (
                <div key={ci} className="calendar-cell" />
              )
            )}
          </div>
        ))}
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>
          숫자는 그 날짜에 "가능해요"라고 투표한 멘티 수예요 (전체 멘티 {menteeCount}명)
        </p>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: 15, marginBottom: 10 }}>새 스터디 제안</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="text-input"
            type="date"
            min={today}
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            style={{ flex: 1 }}
          />
          <select
            className="text-input"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            style={{ flex: 1 }}
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" style={{ marginTop: 10 }} disabled={!form.date || saving} onClick={propose}>
          {saving ? '제안 중...' : '제안하기'}
        </button>
      </div>

      {proposed.length > 0 && (
        <>
          <div className="section-title">제안됨 · 멘티 응답 대기</div>
          {proposed.map((e) => {
            const t = tally(e.id)
            return (
              <div className="card" key={e.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{e.date}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{CATEGORY_LABEL[e.category] || e.category}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>
                    수락 {t.accepted} · 거절 {t.rejected} · 대기 {Math.max(menteeCount - t.accepted - t.rejected, 0)}
                  </div>
                </div>
                <div className="btn-row" style={{ marginTop: 10 }}>
                  <button className="btn btn-primary" onClick={() => setStatus(e.id, 'confirmed')}>
                    확정
                  </button>
                  <button className="btn btn-danger" onClick={() => setStatus(e.id, 'cancelled')}>
                    취소
                  </button>
                </div>
              </div>
            )
          })}
        </>
      )}

      {confirmed.length > 0 && (
        <>
          <div className="section-title">확정된 스터디</div>
          {confirmed.map((e) => (
            <div className="card" key={e.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{e.date}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{CATEGORY_LABEL[e.category] || e.category}</div>
                </div>
                <button className="btn btn-ghost" style={{ width: 'auto', padding: '4px 10px', fontSize: 12 }} onClick={() => setStatus(e.id, 'cancelled')}>
                  취소
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
