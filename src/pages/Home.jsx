import { Link } from 'react-router-dom'
import { useApp } from '../store/AppDataContext'
import { useAuth } from '../store/AuthContext'
import ProgressRing from '../components/ProgressRing'
import Mascot from '../components/Mascot'
import WeekStreakBar from '../components/WeekStreakBar'
import ChallengeCalendar from '../components/ChallengeCalendar'
import Leaderboard from '../components/Leaderboard'

const WEEKDAY_LABEL = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']

export default function Home() {
  const { stats, nextDayByLevel, today } = useApp()
  const { signOut } = useAuth()
  const currentLevelStats = stats.levelStats.find((ls) => ls.level === stats.currentLevel)
  const currentLevelPercent = currentLevelStats?.total
    ? (currentLevelStats.mastered / currentLevelStats.total) * 100
    : 0
  const nextDay = nextDayByLevel[stats.currentLevel]

  const todayDate = new Date(today + 'T00:00:00')
  const dateLabel = `${todayDate.getMonth() + 1}월 ${todayDate.getDate()}일`
  const weekdayLabel = WEEKDAY_LABEL[todayDate.getDay()]

  return (
    <div>
      <div className="hero-card">
        <div className="hero-decor hero-decor-1" />
        <div className="hero-decor hero-decor-2" />
        <button className="hero-logout" onClick={signOut}>
          로그아웃
        </button>
        <div className="hero-badge">
          🌱 {weekdayLabel} · 외운단어 <strong>{stats.totalMastered}</strong>개
        </div>
        <div className="hero-top">
          <div className="hero-text">
            <div className="hi">{dateLabel}</div>
          </div>
          <div className="hero-mascot-spot">
            <Mascot size={92} />
          </div>
        </div>
        <WeekStreakBar activity={stats.weekActivity} />
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="progress-ring-wrap">
          <ProgressRing percent={currentLevelPercent} color="var(--accent)" />
          <div>
            <h2 style={{ marginBottom: 2 }}>{stats.currentLevel} 진행률</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              완전암기 {currentLevelStats?.mastered ?? 0} / {currentLevelStats?.total ?? 0}개
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
            <span className="mini-stat-label">{stats.currentLevel} 완료 Day</span>
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

      <ChallengeCalendar monthActivity={stats.monthActivity} />

      <div style={{ marginTop: 16 }}>
        <Leaderboard />
      </div>

      <div className="section-title">카테고리</div>

      <div className="home-nav-grid">
        <Link to={`/day/${stats.currentLevel}/${nextDay}`} className="home-nav-card">
          <span className="icon">📗</span>
          <span className="title">
            {stats.currentLevel} Day {nextDay} 단어 공부
          </span>
          <span className="sub">플래시카드 → 백지복습</span>
        </Link>

        <Link to="/learn" className="home-nav-card">
          <span className="icon">📅</span>
          <span className="title">학습</span>
          <span className="sub">급수별 전체 커리큘럼</span>
        </Link>

        <Link to="/review" className="home-nav-card">
          <span className="icon">✏️</span>
          <span className="title">복습(오답노트)</span>
          <span className="sub">{stats.wrongPoolCount}개 대기중</span>
        </Link>

        <Link to="/words" className="home-nav-card">
          <span className="icon">📖</span>
          <span className="title">단어장</span>
          <span className="sub">전체 단어 찾아보기</span>
        </Link>

        <Link to="/games" className="home-nav-card">
          <span className="icon">🎮</span>
          <span className="title">게임</span>
          <span className="sub">문장게임 · JLPT 모의고사</span>
        </Link>

        <Link to="/stats" className="home-nav-card">
          <span className="icon">📊</span>
          <span className="title">통계</span>
          <span className="sub">진행률 · 랭킹</span>
        </Link>
      </div>
    </div>
  )
}
