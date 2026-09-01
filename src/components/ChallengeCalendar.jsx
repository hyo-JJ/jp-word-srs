import { useState } from 'react'

const CAT_ICONS = ['🐱', '🐈', '😺', '😸', '🐾']

// 들어올 때마다(마운트 시 1회) 완료된 칸의 아이콘이 랜덤 고양이 모양으로 바뀐다.
export default function ChallengeCalendar({ monthActivity }) {
  const [icons] = useState(() =>
    monthActivity.map(() => CAT_ICONS[Math.floor(Math.random() * CAT_ICONS.length)])
  )

  const doneCount = monthActivity.filter((d) => d.studied).length

  return (
    <div className="card challenge-card">
      <div className="challenge-header">
        <h2 style={{ marginBottom: 0 }}>이달의 챌린지</h2>
        <span className="challenge-count">
          {doneCount}/{monthActivity.length}일
        </span>
      </div>
      <div className="challenge-grid">
        {monthActivity.map((d, i) => (
          <div
            key={d.date}
            className={`challenge-cell${d.studied ? ' is-done' : ''}${d.isToday ? ' is-today' : ''}${
              d.isFuture ? ' is-future' : ''
            }`}
          >
            {d.studied ? icons[i] : d.day}
          </div>
        ))}
      </div>
    </div>
  )
}
