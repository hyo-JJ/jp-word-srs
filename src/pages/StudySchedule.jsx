import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../store/AuthContext'
import { todayStr } from '../srs/srs'
import { monthGrid, todayMonthYear, addMonth } from '../utils/calendar'

const WEEKDAY_LABELS = ['월', '화', '수', '목', '금', '토', '일']
const CATEGORY_LABEL = { study: '정기 스터디', extra: '보충', event: '모임' }

export default function StudySchedule() {
  const { user } = useAuth()
  const [cursor, setCursor] = useState(todayMonthYear)
  const [availableDates, setAvailableDates] = useState(new Set())
  const [events, setEvents] = useState([])
  const [responses, setResponses] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const today = todayStr()

  async function load() {
    setLoading(true)
    const [{ data: avail, error: aErr }, { data: evts, error: eErr }, { data: resp, error: rErr }] =
      await Promise.all([
        supabase.from('study_availability').select('date').eq('mentee_id', user.id),
        supabase.from('study_events').select('*').neq('status', 'cancelled').order('date', { ascending: true }),
        supabase.from('study_event_responses').select('*').eq('mentee_id', user.id),
      ])
    const err = aErr || eErr || rErr
    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }
    setAvailableDates(new Set((avail || []).map((r) => r.date)))
    setEvents(evts || [])
    setResponses(Object.fromEntries((resp || []).map((r) => [r.event_id, r.response])))
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id])

  const weeks = useMemo(() => monthGrid(cursor.year, cursor.month), [cursor])
  const confirmedDates = useMemo(
    () => new Set(events.filter((e) => e.status === 'confirmed').map((e) => e.date)),
    [events]
  )

  async function toggleAvailable(date) {
    if (date < today) return
    if (availableDates.has(date)) {
      const next = new Set(availableDates)
      next.delete(date)
      setAvailableDates(next)
      await supabase.from('study_availability').delete().eq('mentee_id', user.id).eq('date', date)
    } else {
      const next = new Set(availableDates)
      next.add(date)
      setAvailableDates(next)
      await supabase.from('study_availability').insert({ mentee_id: user.id, date })
    }
  }

  async function respond(eventId, response) {
    setResponses((prev) => ({ ...prev, [eventId]: response }))
    await supabase.from('study_event_responses').upsert({ event_id: eventId, mentee_id: user.id, response })
  }

  const proposed = events.filter((e) => e.status === 'proposed')
  const confirmed = events.filter((e) => e.status === 'confirmed')

  return (
    <div>
      <div className="page-header">
        <h1>🗓️ 스터디 스케줄</h1>
        <p>가능한 날짜에 표시해두면 멘토가 스터디 일정을 제안해요</p>
      </div>

      {error && (
        <div className="card">
          <p style={{ margin: 0, color: 'var(--danger)' }}>불러오기 실패: {error}</p>
        </div>
      )}

      {!error && (
        <>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <button className="btn btn-ghost" style={{ width: 'auto', padding: '6px 10px' }} onClick={() => setCursor((c) => addMonth(c, -1))}>
                ←
              </button>
              <h2 style={{ margin: 0 }}>
                {cursor.year}년 {cursor.month}월
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
                    <button
                      key={cell.date}
                      className={[
                        'calendar-cell',
                        'calendar-day',
                        availableDates.has(cell.date) && 'is-available',
                        confirmedDates.has(cell.date) && 'is-confirmed',
                        cell.date === today && 'is-today',
                        cell.date < today && 'is-past',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      disabled={cell.date < today}
                      onClick={() => toggleAvailable(cell.date)}
                    >
                      {cell.day}
                    </button>
                  ) : (
                    <div key={ci} className="calendar-cell" />
                  )
                )}
              </div>
            ))}

            <div style={{ display: 'flex', gap: 14, marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
              <span>🟢 내가 가능한 날</span>
              <span>🔶 확정된 스터디</span>
            </div>
          </div>

          <div className="section-title">제안된 스터디 {proposed.length > 0 && `(${proposed.length})`}</div>
          {loading && <div className="card">불러오는 중...</div>}
          {!loading && proposed.length === 0 && (
            <div className="card">
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>아직 제안된 스터디가 없어요.</p>
            </div>
          )}
          {proposed.map((e) => {
            const myResponse = responses[e.id] || 'pending'
            return (
              <div className="card" key={e.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{e.date}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{CATEGORY_LABEL[e.category] || e.category || '스터디'}</div>
                  </div>
                  <span
                    className={`badge ${myResponse === 'accepted' ? 'badge-mastered' : myResponse === 'rejected' ? 'badge-wrong' : 'badge-new'}`}
                  >
                    {myResponse === 'accepted' ? '수락함' : myResponse === 'rejected' ? '거절함' : '응답 대기'}
                  </span>
                </div>
                <div className="btn-row" style={{ marginTop: 10 }}>
                  <button
                    className="btn btn-primary"
                    style={{ opacity: myResponse === 'accepted' ? 1 : 0.7 }}
                    onClick={() => respond(e.id, 'accepted')}
                  >
                    수락
                  </button>
                  <button
                    className="btn"
                    style={{ opacity: myResponse === 'rejected' ? 1 : 0.7 }}
                    onClick={() => respond(e.id, 'rejected')}
                  >
                    거절
                  </button>
                </div>
              </div>
            )
          })}

          <div className="section-title">확정된 스터디 {confirmed.length > 0 && `(${confirmed.length})`}</div>
          {!loading && confirmed.length === 0 && (
            <div className="card">
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>아직 확정된 스터디가 없어요.</p>
            </div>
          )}
          {confirmed.map((e) => (
            <div className="card" key={e.id}>
              <div style={{ fontWeight: 700 }}>{e.date}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{CATEGORY_LABEL[e.category] || e.category || '스터디'}</div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
