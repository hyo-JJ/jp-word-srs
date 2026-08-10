// 원형 진행률 표시 (홈/통계 대시보드용)
export default function ProgressRing({ percent, size = 96, strokeWidth = 10, color = 'var(--accent)', label, sublabel }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, percent))
  const dash = (clamped / 100) * circumference

  return (
    <div className="progress-ring-center" style={{ width: size, height: size }}>
      <svg className="progress-ring" width={size} height={size}>
        <circle className="progress-ring-track" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} />
        <circle
          className="progress-ring-value"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          strokeDasharray={`${dash} ${circumference - dash}`}
        />
      </svg>
      <div className="progress-ring-label">
        <span className="num">{label ?? `${Math.round(clamped)}%`}</span>
        {sublabel && <span className="unit">{sublabel}</span>}
      </div>
    </div>
  )
}
