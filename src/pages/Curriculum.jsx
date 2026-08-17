import { Link } from 'react-router-dom'
import { useApp } from '../store/AppDataContext'
import BackButton from '../components/BackButton'

export default function Curriculum() {
  const { stats } = useApp()

  return (
    <div>
      <div className="page-header">
        <BackButton />
        <h1>학습</h1>
        <p>급수를 골라 하루 분량씩 암기 → 백지 복습(모드1·모드2) 순서로 진행하세요</p>
      </div>

      <div className="home-nav-grid">
        {stats.levelStats.map((ls) => {
          const percent = ls.total ? Math.round((ls.mastered / ls.total) * 100) : 0
          const content = (
            <>
              <span className="icon">{ls.unlocked ? '📗' : '🔒'}</span>
              <span className="title">{ls.level}</span>
              <span className="sub">
                {ls.unlocked
                  ? `완료 Day ${ls.completedDaysCount}/${ls.dayCount} · 완전암기 ${percent}%`
                  : '이전 급수를 90% 이상 마스터하면 열려요'}
              </span>
            </>
          )
          return ls.unlocked ? (
            <Link key={ls.level} to={`/learn/${ls.level}`} className="home-nav-card">
              {content}
            </Link>
          ) : (
            <div key={ls.level} className="home-nav-card disabled">
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}
