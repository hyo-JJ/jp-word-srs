// 홈 화면용 오리지널 마스코트 — 새싹 귀를 가진 민트색 캐릭터
export default function Mascot({ size = 64, mood = 'happy' }) {
  const isHappy = mood === 'happy'
  return (
    <svg
      className="mascot"
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="학습 마스코트"
    >
      <ellipse cx="60" cy="102" rx="30" ry="7" fill="var(--accent)" opacity="0.12" />

      {/* 새싹 귀 */}
      <path d="M46 34 C38 22 40 8 50 4 C48 16 50 26 54 34 Z" fill="var(--accent-strong)" />
      <path d="M74 34 C82 22 80 8 70 4 C72 16 70 26 66 34 Z" fill="var(--accent-strong)" />

      {/* 몸통 */}
      <circle cx="60" cy="64" r="40" fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth="3" />

      {/* 볼 */}
      <circle cx="38" cy="70" r="7" fill="var(--coral)" opacity="0.55" />
      <circle cx="82" cy="70" r="7" fill="var(--coral)" opacity="0.55" />

      {/* 눈 */}
      {isHappy ? (
        <>
          <path d="M42 58 Q48 50 54 58" stroke="var(--text)" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M66 58 Q72 50 78 58" stroke="var(--text)" strokeWidth="4" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <circle cx="48" cy="58" r="4.5" fill="var(--text)" />
          <circle cx="72" cy="58" r="4.5" fill="var(--text)" />
        </>
      )}

      {/* 입 */}
      <path d="M52 76 Q60 84 68 76" stroke="var(--text)" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  )
}
