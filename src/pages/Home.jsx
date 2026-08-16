import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store/AppDataContext'
import { useAuth } from '../store/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { nextReminderDate, hasHomework } from '../utils/mentorSettings'
import ProgressRing from '../components/ProgressRing'
import Mascot from '../components/Mascot'
import WeekStreakBar from '../components/WeekStreakBar'
import HomeworkChecklist from '../components/HomeworkChecklist'
import TodoList from '../components/TodoList'

const WEEKDAY_LABEL = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']

export default function Home() {
  const { stats, nextDay, today, data, addTodo, toggleTodo, deleteTodo } = useApp()
  const { user } = useAuth()
  const n5Percent = stats.totalWords ? (stats.totalMastered / stats.totalWords) * 100 : 0
  const [mentorSettings, setMentorSettings] = useState(null)

  const todayDate = new Date(today + 'T00:00:00')
  const dateLabel = `${todayDate.getMonth() + 1}월 ${todayDate.getDate()}일`
  const weekdayLabel = WEEKDAY_LABEL[todayDate.getDay()]

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
            <div className="hi">{dateLabel}</div>
            <h1>지금까지 외운 단어</h1>
          </div>
          <div className="hero-mascot-spot">
            <Mascot size={92} />
          </div>
        </div>
        <div className="hero-badge">
          🌱 {weekdayLabel} · <strong>{stats.totalMastered}</strong>개
        </div>
      </div>

      <WeekStreakBar activity={stats.weekActivity} />

      {reminderDate && (
        <div className="card" style={{ marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>📣 다음 학습 알림 예정일: {reminderDate}</p>
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

        <div className="mini-stat-row">
          <div className="mini-stat">
            <span className="mini-stat-value">🔥 {stats.streak}일</span>
            <span className="mini-stat-label">연속 학습</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat-value">
              📗 {stats.completedDays}/{stats.dayCount}
            </span>
            <span className="mini-stat-label">완료 Day</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat-value">📝 {stats.wrongPoolCount}개</span>
            <span className="mini-stat-label">오답노트</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat-value">
              ✅ {stats.todayRecallCorrect}/{stats.todayRecallDone}
            </span>
            <span className="mini-stat-label">오늘 정답</span>
          </div>
        </div>
      </div>

      <div className="section-title">카테고리</div>

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

        <Link to="/games" className="home-nav-card">
          <span className="icon">🎮</span>
          <span className="title">게임</span>
          <span className="sub">문장게임 · JLPT 모의고사</span>
        </Link>

        <Link to="/schedule" className="home-nav-card">
          <span className="icon">🗓️</span>
          <span className="title">스터디 스케줄</span>
          <span className="sub">멘토와 일정 맞추기</span>
        </Link>
      </div>

      {hasHomework(mentorSettings) && (
        <HomeworkChecklist
          startDay={mentorSettings.homework_day_start}
          endDay={mentorSettings.homework_day_end}
          completedDays={data.completedDays}
          dueDate={mentorSettings.homework_due_date}
        />
      )}

      <TodoList todos={data.todos} onAdd={addTodo} onToggle={toggleTodo} onDelete={deleteTodo} />
    </div>
  )
}
