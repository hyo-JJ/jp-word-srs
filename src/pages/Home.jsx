import { Link } from 'react-router-dom'
import { useApp } from '../store/AppDataContext'

export default function Home() {
  const { dueReviewCards, stats, nextDay } = useApp()

  const reviewLeft = dueReviewCards.length

  return (
    <div>
      <div className="page-header">
        <h1>일본어 단어 학습</h1>
        <p>28일 커리큘럼으로 JLPT N5 단어를 정복해보세요</p>
      </div>

      <div className="stat-grid">
        <div className="stat-tile">
          <div className="label">🔥 연속 학습</div>
          <div className="value">
            {stats.streak}
            <span className="unit">일</span>
          </div>
        </div>
        <div className="stat-tile">
          <div className="label">완료한 Day</div>
          <div className="value">
            {stats.completedDays}
            <span className="unit">/ {stats.dayCount}</span>
          </div>
        </div>
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
              단어 암기 → 백지 복습 순서로 진행돼요
            </p>
          </div>
          <span style={{ fontSize: 22, color: 'var(--accent-strong)', fontWeight: 700 }}>→</span>
        </div>
      </Link>

      <Link to="/review" className="card" style={{ display: 'block', textDecoration: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ marginBottom: 2 }}>✏️ 백지 복습</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              오늘 복습 예정 {reviewLeft}개 (완료 {stats.todayReviewDone}개)
            </p>
          </div>
          <span style={{ fontSize: 22, color: 'var(--accent-strong)', fontWeight: 700 }}>
            {reviewLeft}
          </span>
        </div>
      </Link>

      <div className="section-title">진도율 (N5)</div>
      <div className="card">
        {stats.levelStats.map((ls) => (
          <div key={ls.level} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span>{ls.level}</span>
              <span style={{ color: 'var(--text-muted)' }}>
                마스터 {ls.mastered} / {ls.total}
              </span>
            </div>
            <div className="progress-bar">
              <div style={{ width: `${ls.total ? (ls.mastered / ls.total) * 100 : 0}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
