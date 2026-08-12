import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store/AppDataContext'
import { useAuth } from '../store/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { nextReminderDate, hasHomework } from '../utils/mentorSettings'
import ProgressRing from '../components/ProgressRing'
import StatTile from '../components/StatTile'
import Mascot from '../components/Mascot'
import WeekStreakBar from '../components/WeekStreakBar'

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
      <div className="hero-card">
        <div className="hero-decor hero-decor-1" />
        <div className="hero-decor hero-decor-2" />
        <div className="hero-top">
          <div className="hero-text">
            <div className="hi">안녕하세요 👋</div>
            <h1>오늘도 단어 학습!</h1>
          </div>
          <div className="hero-mascot-spot">
            <Mascot size={92} />
          </div>
        </div>
        <div className="hero-badge">
          🌱 지금까지 외운 단어 <strong>{stats.totalMastered}</strong>개
        </div>
      </div>

      <WeekStreakBar activity={stats.weekActivity} />

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

      <div className="home-nav-grid">
        <Link to={`/day/${nextDay}`} className="home-nav-card">
          <span className="icon">📗</span>
          <span className="title">Day {nextDay} 단어 공부</span>
          <span className="sub">플래시카드 → 백지복습</span>
        </Link>

        <Link to="/review" className="home-nav-card">
          <span className="icon">✏️</span>
          <span className="title">복습(오답노트)</span>
          <span className="sub">{stats.wrongPoolCount}개 대기중</span>
        </Link>

        <Link to="/sentence-game" className="home-nav-card">
          <span className="icon">🧩</span>
          <span className="title">문장게임</span>
          <span className="sub">예문 순서 맞추기</span>
        </Link>

        <Link to="/schedule" className="home-nav-card">
          <span className="icon">🗓️</span>
          <span className="title">스터디 스케줄</span>
          <span className="sub">멘토와 일정 맞추기</span>
        </Link>
      </div>
    </div>
  )
}
