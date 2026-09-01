import { useState } from 'react'

const CAT_ICONS = ['🐱', '🐈', '😺', '😸', '🐾']

function CardDots() {
  return (
    <span className="card-dots">
      <span className="dot dot-a" />
      <span className="dot dot-b" />
      <span className="dot dot-c" />
    </span>
  )
}

// 들어올 때마다(마운트 시 1회) 완료된 칸의 아이콘이 랜덤 고양이 모양으로 바뀐다.
export default function ChallengeCalendar({ monthActivity }) {
  const [icons] = useState(() =>
    monthActivity.map(() => CAT_ICONS[Math.floor(Math.random() * CAT_ICONS.length)])
  )

  const doneCount = monthActivity.filter((d) => d.studied).length

  return (
    <div className="card challenge-card">
      <div className="mini-card-header">
        <span className="card-tag">CHALLENGE</span>
        <h2 className="mini-card-title">챌린지 템플릿</h2>
        <CardDots />
      </div>
      <div className="challenge-count">{doneCount}/{monthActivity.length}일 완료</div>
      <div className="challenge-grid">
        {monthActivity.map((d, i) => (
          <div
            key={d.date}
            className={`challenge-cell${d.studied ? ' is-done' : ''}${d.isToday ? ' is-today' : ''}${
              d.isFuture ? ' is-future' : ''
            }`}
          >
            <span className="challenge-cell-icon">{d.studied ? icons[i] : '🤍'}</span>
            <span className="challenge-cell-num">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
