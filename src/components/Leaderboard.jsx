import { Link } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import { useRanking, MIN_ATTEMPTS_FOR_RANK } from '../store/useRanking'

const MEDAL = ['🥇', '🥈', '🥉']
const PODIUM_ORDER = [1, 0, 2] // 왼쪽부터 2등 · 1등(가운데, 최고 높이) · 3등
const PODIUM_TONE = ['gold', 'silver', 'bronze']

function CardDots() {
  return (
    <span className="card-dots">
      <span className="dot dot-a" />
      <span className="dot dot-b" />
      <span className="dot dot-c" />
    </span>
  )
}

function Avatar({ name, tone }) {
  return <span className={`rank-avatar rank-avatar-${tone}`}>{name.slice(0, 1)}</span>
}

export default function Leaderboard({ limit = 5 }) {
  const { user } = useAuth()
  const { ranking, loading } = useRanking()

  if (loading) {
    return (
      <div className="card leaderboard-card">
        <div className="mini-card-header">
          <span className="card-tag">RANK.EXE</span>
          <h2 className="mini-card-title">순위</h2>
          <CardDots />
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>랭킹을 불러오는 중...</p>
      </div>
    )
  }

  if (!ranking || ranking.length === 0) return null

  const top3 = ranking.slice(0, 3)
  const rest = ranking.slice(3, limit)
  const myIndex = ranking.findIndex((r) => r.id === user?.id)
  const me = myIndex >= 0 ? ranking[myIndex] : null

  return (
    <div className="card leaderboard-card">
      <div className="mini-card-header">
        <span className="card-tag">RANK.EXE</span>
        <h2 className="mini-card-title">순위</h2>
        <CardDots />
      </div>

      <div className="podium">
        {PODIUM_ORDER.filter((i) => top3[i]).map((i) => (
          <div key={top3[i].id} className={`podium-slot podium-${PODIUM_TONE[i]}`}>
            <Avatar name={top3[i].name} tone={PODIUM_TONE[i]} />
            <span className="podium-medal">{MEDAL[i]}</span>
            <span className="podium-name">{top3[i].name}</span>
            <span className="podium-points">{top3[i].points}P</span>
          </div>
        ))}
      </div>

      {me && (
        <div className="my-rank-bar">
          <span className="my-rank-col">
            <span className="my-rank-label">Points</span>
            <span className="my-rank-value">{me.points}</span>
          </span>
          <span className="my-rank-col">
            <span className="my-rank-label">Level</span>
            <span className="my-rank-value">{me.level}</span>
          </span>
          <span className="my-rank-col">
            <span className="my-rank-label">Position</span>
            <span className="my-rank-value">{myIndex + 1}</span>
          </span>
        </div>
      )}

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
            <span className="rank-crown">👑</span>
          </span>
        </div>
      ))}

      <Link to="/stats" className="leaderboard-more">
        전체 순위 보기 →
      </Link>
    </div>
  )
}
