import { Link } from 'react-router-dom'

// 멘토가 배정한 숙제(Day 구간)를 체크리스트로 보여준다. 체크 여부는 실제
// 커리큘럼 진행 상황(completedDays)을 그대로 반영하는 읽기 전용 표시라
// 사용자가 직접 체크/해제할 수는 없다 — 완료 안 된 Day를 누르면 그 Day로 이동한다.
export default function HomeworkChecklist({ startDay, endDay, completedDays, dueDate }) {
  const days = []
  for (let d = startDay; d <= endDay; d++) days.push(d)

  return (
    <div className="todo-section">
      {dueDate && (
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: -8, marginBottom: 10 }}>마감 {dueDate}</p>
      )}
      <div className="todo-list">
        {days.map((day) => {
          const done = completedDays.includes(day)
          const row = (
            <>
              <span className={`todo-checkbox ${done ? 'checked' : ''}`}>{done && '✓'}</span>
              <span className="todo-text">Day {day} 단어 공부</span>
            </>
          )
          return done ? (
            <div key={day} className="todo-row done">
              {row}
            </div>
          ) : (
            <Link key={day} to={`/day/${day}`} className="todo-row">
              {row}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
