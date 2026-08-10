// 컬러 블록 통계 타일 (홈/통계 대시보드용)
export default function StatTile({ icon, label, value, unit, tone = 'mint' }) {
  return (
    <div className={`stat-tile stat-tile-${tone}`}>
      <div className="label">
        {icon} {label}
      </div>
      <div className="value">
        {value}
        {unit && <span className="unit">{unit}</span>}
      </div>
    </div>
  )
}
