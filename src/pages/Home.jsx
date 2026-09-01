import { Link } from 'react-router-dom'
import { useApp } from '../store/AppDataContext'
import ProgressRing from '../components/ProgressRing'
import ChallengeCalendar from '../components/ChallengeCalendar'
import Leaderboard from '../components/Leaderboard'
import wordStudyIcon from '../assets/icons/word-study.png'
import wrongPoolIcon from '../assets/icons/wrong-pool.png'
import wordListIcon from '../assets/icons/word-list.png'
import curriculumIcon from '../assets/icons/curriculum.png'
import gamesIcon from '../assets/icons/games.png'
import statsIcon from '../assets/icons/stats.png'
import mypageIcon from '../assets/icons/mypage.png'

function CardDots() {
  return (
    <span className="card-dots">
      <span className="dot dot-a" />
      <span className="dot dot-b" />
      <span className="dot dot-c" />
    </span>
  )
}

export default function Home() {
  const { stats, nextDayByLevel } = useApp()
  const currentLevelStats = stats.levelStats.find((ls) => ls.level === stats.currentLevel)
  const currentLevelPercent = currentLevelStats?.total
    ? (currentLevelStats.mastered / currentLevelStats.total) * 100
    : 0
  const nextDay = nextDayByLevel[stats.currentLevel]

  return (
    <div>
      <div className="home-bento">
        <div className="home-icon-col">
          <Link to={`/day/${stats.currentLevel}/${nextDay}`} className="home-icon-cell">
            <img className="home-icon-img" src={wordStudyIcon} alt="" />
            <span className="title">
              {stats.currentLevel} Day {nextDay} 단어 공부
            </span>
            <span className="sub">플래시카드 → 백지복습</span>
          </Link>
          <Link to="/review" className="home-icon-cell">
            <img className="home-icon-img" src={wrongPoolIcon} alt="" />
            <span className="title">복습(오답노트)</span>
            <span className="sub">{stats.wrongPoolCount}개 대기중</span>
          </Link>
          <Link to="/words" className="home-icon-cell">
            <img className="home-icon-img" src={wordListIcon} alt="" />
            <span className="title">단어장</span>
            <span className="sub">전체 단어 찾아보기</span>
          </Link>
          <Link to="/learn" className="home-icon-cell">
            <img className="home-icon-img" src={curriculumIcon} alt="" />
            <span className="title">학습</span>
            <span className="sub">급수별 전체 커리큘럼</span>
          </Link>
        </div>

        <div className="home-cards-col">
          <div className="card progress-card">
            <div className="mini-card-header">
              <span className="card-tag">STATUS.EXE</span>
              <h2 className="mini-card-title">진행률</h2>
              <CardDots />
            </div>

            <div className="mini-stat-row mini-stat-row-tight">
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

            <div className="progress-ring-wrap progress-ring-wrap-tight">
              <ProgressRing percent={currentLevelPercent} color="var(--accent)" size={56} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700 }}>{stats.currentLevel}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                  완전암기 {currentLevelStats?.mastered ?? 0} / {currentLevelStats?.total ?? 0}개
                </p>
              </div>
            </div>
          </div>

          <ChallengeCalendar monthActivity={stats.monthActivity} />

          <Leaderboard />
        </div>
      </div>

      <div className="home-bottom-row">
        <Link to="/games" className="home-icon-cell">
          <img className="home-icon-img" src={gamesIcon} alt="" />
          <span className="title">게임</span>
          <span className="sub">문장게임 · JLPT</span>
        </Link>
        <Link to="/stats" className="home-icon-cell">
          <img className="home-icon-img" src={statsIcon} alt="" />
          <span className="title">통계</span>
          <span className="sub">진행률 · 랭킹</span>
        </Link>
        <Link to="/stats" className="home-icon-cell">
          <img className="home-icon-img" src={mypageIcon} alt="" />
          <span className="title">마이페이지</span>
          <span className="sub">계정 · 로그아웃</span>
        </Link>
      </div>
    </div>
  )
}
