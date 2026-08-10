import { useApp } from '../store/AppDataContext'

const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토']

export default function Stats() {
  const { stats, reset } = useApp()

  function handleReset() {
    if (window.confirm('모든 학습 기록을 초기화할까요? 이 작업은 되돌릴 수 없어요.')) {
      reset()
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>통계</h1>
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
          <div className="label">오늘 정답률</div>
          <div className="value">
            {stats.todayReviewDone ? Math.round((stats.todayReviewCorrect / stats.todayReviewDone) * 100) : 0}
            <span className="unit">%</span>
          </div>
        </div>
        <div className="stat-tile">
          <div className="label">오늘 신규</div>
          <div className="value">
            {stats.todayNewDone}
            <span className="unit">개</span>
          </div>
        </div>
        <div className="stat-tile">
          <div className="label">오늘 복습</div>
          <div className="value">
            {stats.todayReviewCorrect}
            <span className="unit">/ {stats.todayReviewDone}</span>
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

      <div className="section-title">최근 7일 정답률</div>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
          {stats.trend.map((t) => (
            <div key={t.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: '100%',
                  height: 70,
                  display: 'flex',
                  alignItems: 'flex-end',
                  background: 'var(--surface-2)',
                  borderRadius: 6,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: t.accuracy === null ? 0 : `${t.accuracy * 100}%`,
                    background: 'var(--accent)',
                  }}
                />
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {WEEKDAY[new Date(t.date + 'T00:00:00').getDay()]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="section-title">레벨별 마스터율</div>
      <div className="card">
        {stats.levelStats.map((ls) => (
          <div key={ls.level} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span>{ls.level}</span>
              <span style={{ color: 'var(--text-muted)' }}>
                마스터 {ls.mastered} · 학습중 {ls.learning} · 전체 {ls.total}
              </span>
            </div>
            <div className="progress-bar">
              <div style={{ width: `${ls.total ? (ls.mastered / ls.total) * 100 : 0}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="section-title">설정</div>
      <div className="card">
        <button className="btn btn-danger" onClick={handleReset}>
          학습 기록 초기화
        </button>
      </div>
    </div>
  )
}
