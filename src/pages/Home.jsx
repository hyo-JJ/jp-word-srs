import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store/AppDataContext'
import { useAuth } from '../store/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { nextReminderDate, hasHomework } from '../utils/mentorSettings'
import ProgressRing from '../components/ProgressRing'
import StatTile from '../components/StatTile'

export default function Home() {
  const { stats, nextDay } = useApp()
  const { user } = useAuth()
  const n5Percent = stats.totalWords ? (stats.totalMastered / stats.totalWords) * 100 : 0
  const [mentorSettings, setMentorSettings] = useState(null)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    supabase
      .from('mentor_settings')
      .select('*')
      .eq('mentee_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setMentorSettings(data)
      })
    return () => {
      cancelled = true
    }
  }, [user])

  const reminderDate = nextReminderDate(mentorSettings)

  return (
    <div>
      <div className="greeting-header">
        <div className="greeting-text">
          <div className="hi">안녕하세요 👋</div>
          <h1>오늘도 단어 학습!</h1>
        </div>
        <div className="greeting-avatar">🇯🇵</div>
      </div>

      {(hasHomework(mentorSettings) || reminderDate) && (
        <div className="card" style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {hasHomework(mentorSettings) && (
            <p style={{ margin: 0, fontSize: 13 }}>
              📝 이번 숙제: Day {mentorSettings.homework_day_start}~{mentorSettings.homework_day_end}
              {mentorSettings.homework_due_date && ` (마감 ${mentorSettings.homework_due_date})`}
            </p>
          )}
          {reminderDate && (
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>📣 다음 학습 알림 예정일: {reminderDate}</p>
          )}
        </div>
      )}

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="progress-ring-wrap">
          <ProgressRing percent={n5Percent} color="var(--accent)" />
          <div>
            <h2 style={{ marginBottom: 2 }}>N5 진행률</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              완전암기 {stats.totalMastered} / {stats.totalWords}개
            </p>
          </div>
        </div>
      </div>

      <div className="stat-grid">
        <StatTile icon="🔥" label="연속 학습" value={stats.streak} unit="일" tone="coral" />
        <StatTile icon="📗" label="완료한 Day" value={stats.completedDays} unit={`/ ${stats.dayCount}`} tone="mint" />
        <StatTile icon="📝" label="오답노트" value={stats.wrongPoolCount} unit="개" tone="butter" />
        <StatTile
          icon="✅"
          label="오늘 정답"
          value={stats.todayRecallCorrect}
          unit={`/ ${stats.todayRecallDone}`}
          tone="sky"
        />
      </div>

      <div className="section-title">오늘 할 일</div>

      <Link
        to={`/day/${nextDay}`}
        className="card"
        style={{ display: 'block', marginBottom: 12, textDecoration: 'none' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ marginBottom: 2 }}>📗 Day {nextDay} 학습하기</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              플래시카드 → 백지 복습(모드1·모드2) 순서로 진행돼요
            </p>
          </div>
          <span style={{ fontSize: 22, color: 'var(--accent-strong)', fontWeight: 700 }}>→</span>
        </div>
      </Link>

      <Link to="/review" className="card" style={{ display: 'block', textDecoration: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ marginBottom: 2 }}>✏️ 오답노트</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              오답풀 + 재복습 대상 단어를 객관식으로 확인해요
            </p>
          </div>
          <span style={{ fontSize: 22, color: 'var(--accent-strong)', fontWeight: 700 }}>{stats.wrongPoolCount}</span>
        </div>
      </Link>
    </div>
  )
}
