const LABELS = ['월', '화', '수', '목', '금', '토', '일']

// 이번 주(월~일) 학습 여부를 요일별 점으로 표시
export default function WeekStreakBar({ activity }) {
  return (
    <div className="week-streak-bar">
      {activity.map((day, i) => (
        <div
          key={day.date}
          className={[
            'week-streak-day',
            day.studied && 'is-studied',
            day.isToday && 'is-today',
            day.isFuture && 'is-future',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span className="week-streak-label">{LABELS[i]}</span>
          <span className="week-streak-dot">{day.studied ? '✓' : ''}</span>
        </div>
      ))}
    </div>
  )
}
