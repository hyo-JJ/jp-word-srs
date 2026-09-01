// 홈 화면 바로가기용 "고양이+사물" 아이콘 — 앱 파스텔 팔레트로 새로 그린 오리지널 일러스트
// (참고 와이어프레임의 아이콘 구도만 빌려오고, 그림체는 앱 마스코트 스타일로 새로 그림)

function CatPeek({ cx = 32, cy = 16, r = 9, tone = 'accent' }) {
  const bg = `var(--${tone}-bg)`
  const strong = `var(--${tone}-strong)`
  return (
    <g>
      <path
        d={`M${cx - r * 0.9} ${cy - r * 0.7} L${cx - r * 1.5} ${cy - r * 1.9} L${cx - r * 0.2} ${cy - r * 1.1} Z`}
        fill={bg}
        stroke={strong}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d={`M${cx + r * 0.9} ${cy - r * 0.7} L${cx + r * 1.5} ${cy - r * 1.9} L${cx + r * 0.2} ${cy - r * 1.1} Z`}
        fill={bg}
        stroke={strong}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx={cx} cy={cy} r={r} fill={bg} stroke={strong} strokeWidth="2.5" />
      <circle cx={cx - r * 0.4} cy={cy + r * 0.1} r="1.6" fill="var(--text)" />
      <circle cx={cx + r * 0.4} cy={cy + r * 0.1} r="1.6" fill="var(--text)" />
    </g>
  )
}

export function EnvelopeCatIcon({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="8" y="26" width="48" height="32" rx="6" fill="var(--coral-bg)" stroke="var(--coral-strong)" strokeWidth="2.5" />
      <path d="M8 30 L32 48 L56 30" fill="none" stroke="var(--coral-strong)" strokeWidth="2.5" strokeLinejoin="round" />
      <CatPeek cx={32} cy={22} r={9} tone="accent" />
    </svg>
  )
}

export function TrashCatIcon({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="20" y="14" width="24" height="6" rx="2" fill="var(--sky-strong)" />
      <path
        d="M16 22 L48 22 L44 56 Q44 58 42 58 L22 58 Q20 58 20 56 Z"
        fill="var(--sky-bg)"
        stroke="var(--sky-strong)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <line x1="27" y1="30" x2="28" y2="50" stroke="var(--sky-strong)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="37" y1="30" x2="36" y2="50" stroke="var(--sky-strong)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <CatPeek cx={32} cy={18} r={8} tone="accent" />
    </svg>
  )
}

export function FolderCatIcon({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path
        d="M8 22 L26 22 L30 27 L56 27 L56 50 Q56 53 53 53 L11 53 Q8 53 8 50 Z"
        fill="var(--butter-bg)"
        stroke="var(--butter-strong)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <ellipse cx="34" cy="40" rx="16" ry="9" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2.5" />
      <circle cx="24" cy="34" r="7" fill="var(--accent-bg)" stroke="var(--accent-strong)" strokeWidth="2.5" />
      <path d="M19 30 L16 25 L23 28 Z" fill="var(--accent-bg)" stroke="var(--accent-strong)" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="22" cy="35" r="1.3" fill="var(--text)" />
      <circle cx="26" cy="35" r="1.3" fill="var(--text)" />
    </svg>
  )
}

export function FloppyCatIcon({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path
        d="M12 8 L46 8 L56 18 L56 56 L12 56 Z"
        fill="var(--sky-bg)"
        stroke="var(--sky-strong)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <rect x="20" y="8" width="20" height="14" fill="var(--surface)" stroke="var(--sky-strong)" strokeWidth="2" />
      <rect x="18" y="32" width="28" height="18" rx="3" fill="var(--surface)" stroke="var(--sky-strong)" strokeWidth="2" />
      <circle cx="32" cy="41" r="6" fill="var(--accent-bg)" stroke="var(--accent-strong)" strokeWidth="2.2" />
      <circle cx="29.5" cy="41" r="1.1" fill="var(--text)" />
      <circle cx="34.5" cy="41" r="1.1" fill="var(--text)" />
    </svg>
  )
}

export function EarthCatIcon({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <circle cx="32" cy="34" r="22" fill="var(--sky-bg)" stroke="var(--sky-strong)" strokeWidth="2.5" />
      <path
        d="M16 24 Q26 20 30 28 Q34 34 26 38 Q20 40 22 48"
        fill="var(--accent-bg)"
        stroke="var(--accent-strong)"
        strokeWidth="2"
      />
      <ellipse cx="44" cy="42" rx="9" ry="7" fill="var(--accent-bg)" stroke="var(--accent-strong)" strokeWidth="2" />
      <circle cx="26" cy="30" r="1.4" fill="var(--text)" />
      <circle cx="30" cy="34" r="1.4" fill="var(--text)" />
      <path d="M10 14 Q14 10 19 13" fill="none" stroke="var(--surface)" strokeWidth="3" strokeLinecap="round" />
      <path d="M46 12 Q51 9 55 13" fill="none" stroke="var(--surface)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function NotepadCatIcon({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="12" y="12" width="34" height="42" rx="4" fill="var(--surface)" stroke="var(--coral-strong)" strokeWidth="2.5" />
      <circle cx="19" cy="12" r="2.4" fill="var(--coral-bg)" stroke="var(--coral-strong)" strokeWidth="1.6" />
      <circle cx="29" cy="12" r="2.4" fill="var(--coral-bg)" stroke="var(--coral-strong)" strokeWidth="1.6" />
      <circle cx="39" cy="12" r="2.4" fill="var(--coral-bg)" stroke="var(--coral-strong)" strokeWidth="1.6" />
      <line x1="18" y1="26" x2="40" y2="26" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="34" x2="40" y2="34" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="42" x2="32" y2="42" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M38 48 L52 34 L58 40 L44 54 L36 56 Z"
        fill="var(--butter-bg)"
        stroke="var(--butter-strong)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SunnyIcon({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="32"
          y1="32"
          x2={32 + 24 * Math.cos((deg * Math.PI) / 180)}
          y2={32 + 24 * Math.sin((deg * Math.PI) / 180)}
          stroke="var(--butter-strong)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
      <circle cx="32" cy="32" r="15" fill="var(--butter-bg)" stroke="var(--butter-strong)" strokeWidth="2.5" />
      <rect x="20" y="31" width="10" height="5" rx="2.5" fill="var(--text)" opacity="0.75" />
      <rect x="34" y="31" width="10" height="5" rx="2.5" fill="var(--text)" opacity="0.75" />
      <line x1="30" y1="33" x2="34" y2="33" stroke="var(--text)" strokeWidth="2" opacity="0.75" />
      <path d="M14 50 Q20 44 28 50 Q36 44 44 50 Q50 44 56 50 L56 54 L14 54 Z" fill="var(--surface)" opacity="0.9" />
    </svg>
  )
}
