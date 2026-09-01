import { Link } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import { useRanking, MIN_ATTEMPTS_FOR_RANK } from '../store/useRanking'

const MEDAL = ['🥇', '🥈', '🥉']
const PODIUM_ORDER = [1, 0, 2] // 왼쪽부터 2등 · 1등(가운데, 최고 높이) · 3등
const PODIUM_TONE = ['gold', 'silver', 'bronze']

export default function Leaderboard({ limit = 5 }) {
  const { user } = useAuth()
  const { ranking, loading } = useRanking()

  if (loading) {
    return (
      <div className="card leaderboard-card">
        <div className="section-title" style={{ margin: '0 0 10px' }}>
          🏆 순위
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>랭킹을 불러오는 중...</p>
      </div>
    )
  }

  if (!ranking || ranking.length === 0) return null

  const top3 = ranking.slice(0, 3)
  const rest = ranking.slice(3, limit)

  return (
    <div className="card leaderboard-card">
      <div className="section-title" style={{ margin: '0 0 12px' }}>
        🏆 순위
      </div>

      <div className="podium">
        {PODIUM_ORDER.filter((i) => top3[i]).map((i) => (
          <div key={top3[i].id} className={`podium-slot podium-${PODIUM_TONE[i]}`}>
            <span className="podium-medal">{MEDAL[i]}</span>
            <span className="podium-name">{top3[i].name}</span>
            <span className="podium-points">{top3[i].points}P</span>
            <span className="podium-level">{top3[i].level}</span>
          </div>
        ))}
      </div>

      {rest.map((r, i) => (
        <div className={`rank-row${r.id === user?.id ? ' is-me' : ''}`} key={r.id}>
          <span className="rank-medal">{i + 4}</span>
          <span className="rank-name">
            <span className="rank-name-row">
              {r.name}
              {r.id === user?.id && <span className="rank-me-badge">나</span>}
            </span>
            <span className="rank-progress">
              {r.level} · {r.points}P
            </span>
          </span>
          <span className="rank-value">
            {r.total >= MIN_ATTEMPTS_FOR_RANK ? (
              <span>정답률 {Math.round(r.accuracy * 100)}%</span>
            ) : (
              <span>{r.total}/{MIN_ATTEMPTS_FOR_RANK}문제</span>
            )}
          </span>
        </div>
      ))}

      <Link to="/stats" className="leaderboard-more">
        전체 순위 보기 →
      </Link>
    </div>
  )
}
