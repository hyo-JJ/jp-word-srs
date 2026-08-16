// 단어 연상 아이콘 — 개별 단어 하나하나를 손으로 그린 심플 SVG (64x64, 앱 파스텔 팔레트)
// 신체
export function HeadIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <circle cx="32" cy="34" r="18" fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth="2.5" />
      <path d="M15 30 Q32 8 49 30" stroke="var(--accent-strong)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="26" cy="34" r="2" fill="var(--text)" />
      <circle cx="38" cy="34" r="2" fill="var(--text)" />
      <path d="M27 42 Q32 46 37 42" stroke="var(--text)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function FootIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path
        d="M24 12 Q20 12 20 20 L20 38 Q20 44 14 48 Q10 51 12 55 Q14 58 22 58 L46 58 Q50 58 50 53 Q50 44 42 40 Q34 36 32 24 Q31 12 24 12 Z"
        fill="var(--coral-bg)"
        stroke="var(--coral-strong)"
        strokeWidth="2.5"
      />
      <line x1="16" y1="52" x2="46" y2="52" stroke="var(--coral-strong)" strokeWidth="1.6" opacity="0.6" />
    </svg>
  )
}

export function FaceIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <circle cx="32" cy="32" r="20" fill="var(--butter-bg)" stroke="var(--butter-strong)" strokeWidth="2.5" />
      <circle cx="23" cy="36" r="4" fill="var(--coral)" opacity="0.5" />
      <circle cx="41" cy="36" r="4" fill="var(--coral)" opacity="0.5" />
      <circle cx="25" cy="28" r="2" fill="var(--text)" />
      <circle cx="39" cy="28" r="2" fill="var(--text)" />
      <path d="M25 38 Q32 44 39 38" stroke="var(--text)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function HeadacheIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <circle cx="32" cy="36" r="16" fill="var(--coral-bg)" stroke="var(--coral-strong)" strokeWidth="2.5" />
      <circle cx="26" cy="38" r="1.8" fill="var(--text)" />
      <circle cx="38" cy="38" r="1.8" fill="var(--text)" />
      <path d="M26 46 Q32 43 38 46" stroke="var(--text)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M14 20 L20 10 L17 18 L24 8" stroke="var(--butter-strong)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M50 20 L44 10 L47 18 L40 8" stroke="var(--butter-strong)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function SickIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <circle cx="30" cy="34" r="17" fill="var(--sky-bg)" stroke="var(--sky-strong)" strokeWidth="2.5" />
      <path d="M22 30 L27 35 M27 30 L22 35" stroke="var(--text)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M33 30 L38 35 M38 30 L33 35" stroke="var(--text)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M23 42 Q30 38 37 42" stroke="var(--text)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M46 20 Q42 26 46 30 Q50 26 46 20 Z" fill="var(--sky-strong)" />
    </svg>
  )
}

// 동물
export function DogIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path d="M18 18 L24 30 L14 30 Z" fill="var(--butter-strong)" />
      <path d="M46 18 L52 30 L42 30 Z" fill="var(--butter-strong)" />
      <ellipse cx="32" cy="38" rx="18" ry="15" fill="var(--butter-bg)" stroke="var(--butter-strong)" strokeWidth="2.5" />
      <ellipse cx="32" cy="42" rx="6" ry="4.5" fill="var(--surface)" stroke="var(--butter-strong)" strokeWidth="1.6" />
      <circle cx="24" cy="34" r="2" fill="var(--text)" />
      <circle cx="40" cy="34" r="2" fill="var(--text)" />
      <circle cx="32" cy="42" r="1.8" fill="var(--text)" />
    </svg>
  )
}

export function FishIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <ellipse cx="28" cy="32" rx="18" ry="12" fill="var(--sky-bg)" stroke="var(--sky-strong)" strokeWidth="2.5" />
      <path d="M46 32 L58 22 L58 42 Z" fill="var(--sky-strong)" />
      <path d="M22 22 Q26 16 32 20" stroke="var(--sky-strong)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="20" cy="30" r="1.8" fill="var(--text)" />
    </svg>
  )
}

// 탈것
export function TaxiIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="8" y="30" width="48" height="16" rx="6" fill="var(--butter)" stroke="var(--butter-strong)" strokeWidth="2.5" />
      <path d="M16 30 L22 20 L42 20 L48 30 Z" fill="var(--butter)" stroke="var(--butter-strong)" strokeWidth="2.5" />
      <rect x="24" y="22" width="16" height="7" rx="1.5" fill="var(--sky-bg)" />
      <rect x="26" y="12" width="12" height="6" rx="1.5" fill="var(--surface)" stroke="var(--butter-strong)" strokeWidth="1.6" />
      <circle cx="19" cy="47" r="5" fill="var(--text)" />
      <circle cx="45" cy="47" r="5" fill="var(--text)" />
    </svg>
  )
}

export function BusIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="8" y="14" width="48" height="30" rx="5" fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth="2.5" />
      <rect x="13" y="19" width="10" height="9" fill="var(--sky-bg)" stroke="var(--accent)" strokeWidth="1.4" />
      <rect x="27" y="19" width="10" height="9" fill="var(--sky-bg)" stroke="var(--accent)" strokeWidth="1.4" />
      <rect x="41" y="19" width="10" height="9" fill="var(--sky-bg)" stroke="var(--accent)" strokeWidth="1.4" />
      <rect x="13" y="33" width="38" height="4" fill="var(--coral)" />
      <circle cx="18" cy="47" r="5" fill="var(--text)" />
      <circle cx="46" cy="47" r="5" fill="var(--text)" />
    </svg>
  )
}

export function TrainIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path d="M12 20 Q12 12 24 12 L44 12 Q52 12 52 20 L52 40 Q52 46 44 46 L20 46 Q12 46 12 40 Z" fill="var(--sky-bg)" stroke="var(--sky-strong)" strokeWidth="2.5" />
      <rect x="18" y="19" width="11" height="10" rx="2" fill="var(--surface)" stroke="var(--sky-strong)" strokeWidth="1.6" />
      <rect x="35" y="19" width="11" height="10" rx="2" fill="var(--surface)" stroke="var(--sky-strong)" strokeWidth="1.6" />
      <circle cx="32" cy="38" r="3" fill="var(--butter)" />
      <circle cx="20" cy="52" r="4" fill="var(--text)" />
      <circle cx="44" cy="52" r="4" fill="var(--text)" />
    </svg>
  )
}

// 자연/날씨
export function ParkIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <circle cx="26" cy="22" r="14" fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth="2.5" />
      <rect x="23" y="30" width="6" height="14" fill="var(--butter-strong)" />
      <rect x="38" y="42" width="18" height="3" fill="var(--text-muted)" />
      <line x1="41" y1="45" x2="41" y2="52" stroke="var(--text-muted)" strokeWidth="2.5" />
      <line x1="53" y1="45" x2="53" y2="52" stroke="var(--text-muted)" strokeWidth="2.5" />
    </svg>
  )
}

export function UmbrellaIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path d="M10 30 Q32 6 54 30 Z" fill="var(--coral-bg)" stroke="var(--coral-strong)" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="19" y1="30" x2="19" y2="26" stroke="var(--coral-strong)" strokeWidth="1.6" />
      <line x1="32" y1="30" x2="32" y2="22" stroke="var(--coral-strong)" strokeWidth="1.6" />
      <line x1="45" y1="30" x2="45" y2="26" stroke="var(--coral-strong)" strokeWidth="1.6" />
      <line x1="32" y1="30" x2="32" y2="52" stroke="var(--text)" strokeWidth="2.5" />
      <path d="M32 52 Q32 58 38 56" stroke="var(--text)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function RainIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <ellipse cx="32" cy="24" rx="18" ry="12" fill="var(--sky-bg)" stroke="var(--sky-strong)" strokeWidth="2.5" />
      <line x1="20" y1="42" x2="16" y2="52" stroke="var(--sky-strong)" strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="42" x2="28" y2="54" stroke="var(--sky-strong)" strokeWidth="3" strokeLinecap="round" />
      <line x1="44" y1="42" x2="40" y2="52" stroke="var(--sky-strong)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function SnowIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <circle cx="32" cy="32" r="24" fill="var(--sky-bg)" opacity="0.5" />
      <g stroke="var(--sky-strong)" strokeWidth="2.6" strokeLinecap="round">
        <line x1="32" y1="16" x2="32" y2="48" />
        <line x1="18" y1="24" x2="46" y2="40" />
        <line x1="18" y1="40" x2="46" y2="24" />
      </g>
    </svg>
  )
}

export function LeafIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path d="M32 10 Q54 20 46 44 Q38 56 20 50 Q14 30 32 10 Z" fill="var(--butter-bg)" stroke="var(--butter-strong)" strokeWidth="2.5" />
      <path d="M32 14 Q30 32 22 48" stroke="var(--butter-strong)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function WaveIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <circle cx="48" cy="16" r="6" fill="var(--butter)" />
      <path d="M8 30 Q16 24 24 30 T40 30 T56 30" stroke="var(--sky-strong)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M8 40 Q16 34 24 40 T40 40 T56 40" stroke="var(--sky)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M8 50 Q16 44 24 50 T40 50 T56 50" stroke="var(--sky-strong)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}

// 음식/음료
export function CoffeeIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path d="M16 20 Q10 22 10 26 Q10 30 16 32" stroke="var(--accent-strong)" strokeWidth="2.5" fill="none" />
      <rect x="16" y="18" width="28" height="24" rx="3" fill="var(--surface)" stroke="var(--accent-strong)" strokeWidth="2.5" />
      <path d="M18 24 Q30 30 42 24 L42 38 Q30 42 18 38 Z" fill="var(--accent-strong)" />
      <path d="M22 12 Q20 8 23 5" stroke="var(--text-muted)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M32 12 Q30 8 33 5" stroke="var(--text-muted)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function TeaIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path d="M42 26 Q50 26 50 32 Q50 38 42 38" stroke="var(--accent-strong)" strokeWidth="2.5" fill="none" />
      <path d="M14 28 L46 28 L42 44 Q42 48 32 48 Q22 48 18 44 Z" fill="var(--accent-bg)" stroke="var(--accent-strong)" strokeWidth="2.5" />
      <ellipse cx="30" cy="28" rx="16" ry="3.5" fill="var(--accent)" />
      <path d="M20 18 Q18 14 21 11" stroke="var(--text-muted)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function BreadIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path d="M12 40 Q10 20 32 18 Q54 20 52 40 Q52 48 32 48 Q12 48 12 40 Z" fill="var(--butter-bg)" stroke="var(--butter-strong)" strokeWidth="2.5" />
      <path d="M22 26 Q24 34 20 40" stroke="var(--butter-strong)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M32 24 Q34 34 30 42" stroke="var(--butter-strong)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M42 26 Q44 34 40 40" stroke="var(--butter-strong)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function WaterIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path d="M32 10 Q48 32 48 42 Q48 54 32 54 Q16 54 16 42 Q16 32 32 10 Z" fill="var(--sky-bg)" stroke="var(--sky-strong)" strokeWidth="2.5" />
      <ellipse cx="26" cy="40" rx="4" ry="6" fill="var(--surface)" opacity="0.6" />
    </svg>
  )
}

export function CandyIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <circle cx="32" cy="32" r="18" fill="var(--butter-bg)" stroke="var(--butter-strong)" strokeWidth="2.5" />
      <circle cx="25" cy="26" r="2.5" fill="var(--coral)" />
      <circle cx="38" cy="27" r="2.5" fill="var(--accent)" />
      <circle cx="30" cy="37" r="2.5" fill="var(--sky)" />
      <circle cx="41" cy="36" r="2.5" fill="var(--coral)" />
    </svg>
  )
}

export function SaltIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path d="M22 20 L42 20 L40 52 Q40 56 32 56 Q24 56 24 52 Z" fill="var(--surface)" stroke="var(--text-muted)" strokeWidth="2.5" />
      <rect x="20" y="14" width="24" height="7" rx="2" fill="var(--sky-bg)" stroke="var(--sky-strong)" strokeWidth="2" />
      <circle cx="28" cy="17.5" r="0.9" fill="var(--sky-strong)" />
      <circle cx="32" cy="17.5" r="0.9" fill="var(--sky-strong)" />
      <circle cx="36" cy="17.5" r="0.9" fill="var(--sky-strong)" />
    </svg>
  )
}

// 식기
export function CupIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path d="M20 16 L44 16 L40 50 Q40 54 32 54 Q24 54 24 50 Z" fill="var(--sky-bg)" stroke="var(--sky-strong)" strokeWidth="2.5" />
      <line x1="25" y1="30" x2="39" y2="30" stroke="var(--sky-strong)" strokeWidth="1.8" opacity="0.6" />
    </svg>
  )
}

export function PlateIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <ellipse cx="32" cy="34" rx="24" ry="12" fill="var(--surface)" stroke="var(--text-muted)" strokeWidth="2.5" />
      <ellipse cx="32" cy="34" rx="12" ry="6" fill="var(--accent-bg)" stroke="var(--text-muted)" strokeWidth="1.6" />
    </svg>
  )
}

export function SpoonIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <ellipse cx="26" cy="20" rx="10" ry="13" fill="var(--accent-bg)" stroke="var(--accent-strong)" strokeWidth="2.5" />
      <line x1="32" y1="30" x2="46" y2="54" stroke="var(--accent-strong)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

// 옷
export function HatIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <ellipse cx="32" cy="42" rx="26" ry="6" fill="var(--coral-bg)" stroke="var(--coral-strong)" strokeWidth="2.5" />
      <path d="M18 42 Q18 16 32 16 Q46 16 46 42" fill="var(--coral)" stroke="var(--coral-strong)" strokeWidth="2.5" />
    </svg>
  )
}

export function ShirtIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path d="M22 14 L14 22 L20 30 L24 26 L24 52 L40 52 L40 26 L44 30 L50 22 L42 14 Q37 20 32 20 Q27 20 22 14 Z" fill="var(--sky-bg)" stroke="var(--sky-strong)" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  )
}

export function CoatIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path d="M22 14 L13 24 L19 31 L24 27 L20 56 L44 56 L40 27 L45 31 L51 24 L42 14 Q37 20 32 20 Q27 20 22 14 Z" fill="var(--butter-bg)" stroke="var(--butter-strong)" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="32" y1="26" x2="32" y2="54" stroke="var(--butter-strong)" strokeWidth="1.6" />
      <circle cx="32" cy="32" r="1.6" fill="var(--butter-strong)" />
      <circle cx="32" cy="40" r="1.6" fill="var(--butter-strong)" />
      <circle cx="32" cy="48" r="1.6" fill="var(--butter-strong)" />
    </svg>
  )
}

export function PantsIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path d="M18 12 L46 12 L48 54 L38 54 L34 26 L30 54 L20 54 Z" fill="var(--accent-bg)" stroke="var(--accent-strong)" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  )
}

export function SkirtIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path d="M22 14 L42 14 L54 50 L10 50 Z" fill="var(--coral-bg)" stroke="var(--coral-strong)" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="22" y1="14" x2="42" y2="14" stroke="var(--coral-strong)" strokeWidth="3" />
    </svg>
  )
}

// 학용품
export function BookIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="14" y="12" width="36" height="40" rx="2" fill="var(--accent-bg)" stroke="var(--accent-strong)" strokeWidth="2.5" />
      <line x1="22" y1="12" x2="22" y2="52" stroke="var(--accent-strong)" strokeWidth="2" />
      <line x1="28" y1="24" x2="44" y2="24" stroke="var(--accent-strong)" strokeWidth="1.6" opacity="0.6" />
      <line x1="28" y1="32" x2="44" y2="32" stroke="var(--accent-strong)" strokeWidth="1.6" opacity="0.6" />
    </svg>
  )
}

export function NotebookIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="16" y="10" width="34" height="44" rx="2" fill="var(--sky-bg)" stroke="var(--sky-strong)" strokeWidth="2.5" />
      {[16, 22, 28, 34, 40, 46].map((y) => (
        <circle key={y} cx="12" cy={y} r="2.2" fill="var(--surface)" stroke="var(--sky-strong)" strokeWidth="1.4" />
      ))}
      <line x1="24" y1="24" x2="42" y2="24" stroke="var(--sky-strong)" strokeWidth="1.6" opacity="0.6" />
      <line x1="24" y1="32" x2="42" y2="32" stroke="var(--sky-strong)" strokeWidth="1.6" opacity="0.6" />
      <line x1="24" y1="40" x2="42" y2="40" stroke="var(--sky-strong)" strokeWidth="1.6" opacity="0.6" />
    </svg>
  )
}

export function PencilIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="-6" y="-6" width="14" height="46" rx="2" transform="translate(30 14) rotate(35)" fill="var(--butter-bg)" stroke="var(--butter-strong)" strokeWidth="2.2" />
      <path d="M46 46 L52 52 L44 56 Z" fill="var(--text)" transform="rotate(0)" />
    </svg>
  )
}

export function PenIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="-6" y="-6" width="12" height="48" rx="4" transform="translate(30 16) rotate(35)" fill="var(--sky-bg)" stroke="var(--sky-strong)" strokeWidth="2.2" />
      <circle cx="43" cy="49" r="3" fill="var(--sky-strong)" />
    </svg>
  )
}

// 기타
export function MoneyIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <circle cx="28" cy="38" r="16" fill="var(--surface)" stroke="var(--butter-strong)" strokeWidth="2.5" />
      <circle cx="36" cy="28" r="16" fill="var(--butter-bg)" stroke="var(--butter-strong)" strokeWidth="2.5" />
      <text x="36" y="34" fontSize="16" textAnchor="middle" fill="var(--butter-strong)" fontWeight="700">¥</text>
    </svg>
  )
}

export function CameraIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="10" y="20" width="44" height="30" rx="4" fill="var(--text-muted)" opacity="0.15" stroke="var(--text)" strokeWidth="2.5" />
      <rect x="24" y="14" width="14" height="8" rx="2" fill="var(--text)" opacity="0.5" />
      <circle cx="32" cy="35" r="10" fill="var(--sky-bg)" stroke="var(--sky-strong)" strokeWidth="2.5" />
      <circle cx="32" cy="35" r="4" fill="var(--sky-strong)" />
      <circle cx="46" cy="26" r="2" fill="var(--coral)" />
    </svg>
  )
}

export function TvIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="8" y="14" width="48" height="32" rx="3" fill="var(--sky-bg)" stroke="var(--sky-strong)" strokeWidth="2.5" />
      <path d="M22 46 L18 56 M42 46 L46 56" stroke="var(--sky-strong)" strokeWidth="3" strokeLinecap="round" />
      <path d="M18 26 L30 34 L18 42 Z" fill="var(--sky-strong)" />
    </svg>
  )
}

export function ChairIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="18" y="10" width="24" height="6" rx="2" fill="var(--coral-bg)" stroke="var(--coral-strong)" strokeWidth="2.2" />
      <rect x="18" y="16" width="6" height="26" fill="var(--coral-bg)" stroke="var(--coral-strong)" strokeWidth="1.8" />
      <rect x="16" y="34" width="32" height="8" rx="2" fill="var(--coral-bg)" stroke="var(--coral-strong)" strokeWidth="2.2" />
      <line x1="20" y1="42" x2="18" y2="56" stroke="var(--coral-strong)" strokeWidth="3" strokeLinecap="round" />
      <line x1="44" y1="42" x2="46" y2="56" stroke="var(--coral-strong)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function TableIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="8" y="20" width="48" height="8" rx="2" fill="var(--butter-bg)" stroke="var(--butter-strong)" strokeWidth="2.5" />
      <line x1="14" y1="28" x2="12" y2="54" stroke="var(--butter-strong)" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="50" y1="28" x2="52" y2="54" stroke="var(--butter-strong)" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

export function LongThinBundleIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <line x1="18" y1="52" x2="26" y2="12" stroke="var(--accent-strong)" strokeWidth="4" strokeLinecap="round" />
      <line x1="30" y1="54" x2="34" y2="10" stroke="var(--sky-strong)" strokeWidth="4" strokeLinecap="round" />
      <line x1="42" y1="52" x2="46" y2="14" stroke="var(--coral-strong)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

// 장소/시설
export function ToiletIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="20" y="10" width="24" height="12" rx="3" fill="var(--sky-bg)" stroke="var(--sky-strong)" strokeWidth="2.5" />
      <path
        d="M18 26 Q18 22 22 22 L42 22 Q46 22 46 26 L46 34 Q46 46 32 48 Q18 46 18 34 Z"
        fill="var(--surface)"
        stroke="var(--sky-strong)"
        strokeWidth="2.5"
      />
      <ellipse cx="32" cy="52" rx="16" ry="4" fill="var(--sky-bg)" stroke="var(--sky-strong)" strokeWidth="2" />
    </svg>
  )
}

export function RoadIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path d="M22 10 L10 54 L26 54 L34 10 Z" fill="var(--text-muted)" opacity="0.25" />
      <path d="M22 10 L10 54 L26 54 L34 10 Z" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" />
      <path d="M40 10 L48 54 L58 54 L46 10 Z" fill="var(--text-muted)" opacity="0.25" />
      <path d="M40 10 L48 54 L58 54 L46 10 Z" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" />
      <line x1="33" y1="14" x2="35" y2="14" stroke="var(--butter)" strokeWidth="3" strokeLinecap="round" />
      <line x1="35" y1="26" x2="37" y2="26" stroke="var(--butter)" strokeWidth="3" strokeLinecap="round" />
      <line x1="37" y1="38" x2="39" y2="38" stroke="var(--butter)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function IntersectionIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="10" y="26" width="44" height="12" fill="var(--text-muted)" opacity="0.25" />
      <rect x="26" y="10" width="12" height="44" fill="var(--text-muted)" opacity="0.25" />
      <rect x="10" y="26" width="44" height="12" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" />
      <rect x="26" y="10" width="12" height="44" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" />
      <line x1="14" y1="32" x2="20" y2="32" stroke="var(--butter)" strokeWidth="3" strokeLinecap="round" />
      <line x1="44" y1="32" x2="50" y2="32" stroke="var(--butter)" strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="14" x2="32" y2="20" stroke="var(--butter)" strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="44" x2="32" y2="50" stroke="var(--butter)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function WindowIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="12" y="10" width="40" height="44" rx="2" fill="var(--sky-bg)" stroke="var(--sky-strong)" strokeWidth="2.5" />
      <line x1="32" y1="10" x2="32" y2="54" stroke="var(--sky-strong)" strokeWidth="2.2" />
      <line x1="12" y1="32" x2="52" y2="32" stroke="var(--sky-strong)" strokeWidth="2.2" />
      <path d="M16 26 Q20 20 26 24" stroke="var(--surface)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
    </svg>
  )
}

export function ElevatorIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="14" y="8" width="36" height="48" rx="3" fill="var(--surface-2)" stroke="var(--text-muted)" strokeWidth="2.5" />
      <line x1="32" y1="8" x2="32" y2="56" stroke="var(--text-muted)" strokeWidth="2" />
      <path d="M23 26 L20 32 L26 32 Z" fill="var(--accent-strong)" />
      <path d="M23 40 L20 34 L26 34 Z" fill="var(--text-muted)" opacity="0.4" />
      <path d="M41 26 L38 32 L44 32 Z" fill="var(--text-muted)" opacity="0.4" />
      <path d="M41 40 L38 34 L44 34 Z" fill="var(--coral-strong)" />
    </svg>
  )
}

export function StairsIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path
        d="M10 54 L10 44 L22 44 L22 34 L34 34 L34 24 L46 24 L46 14 L56 14 L56 54 Z"
        fill="var(--butter-bg)"
        stroke="var(--butter-strong)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function EntranceIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path d="M14 54 L14 14 Q14 8 22 8 L32 8 L32 54 Z" fill="var(--accent-bg)" stroke="var(--accent-strong)" strokeWidth="2.5" />
      <circle cx="26" cy="32" r="1.8" fill="var(--accent-strong)" />
      <path d="M38 32 L54 32 M54 32 L47 25 M54 32 L47 39" stroke="var(--coral-strong)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// 취미/오락
export function GuitarIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <line x1="30" y1="30" x2="24" y2="8" stroke="var(--butter-strong)" strokeWidth="5" strokeLinecap="round" />
      <rect x="19" y="6" width="8" height="4" rx="1" fill="var(--text)" transform="rotate(-15 23 8)" />
      <path
        d="M24 28 Q10 28 12 40 Q14 52 26 54 Q40 56 42 44 Q44 34 34 30 Q30 28 24 28 Z"
        fill="var(--butter-bg)"
        stroke="var(--butter-strong)"
        strokeWidth="2.5"
      />
      <circle cx="27" cy="42" r="6" fill="var(--text)" opacity="0.5" />
    </svg>
  )
}

export function MovieIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="10" y="22" width="44" height="32" rx="2" fill="var(--text)" opacity="0.8" />
      <path d="M10 22 L18 12 L26 12 L20 22 Z" fill="var(--coral)" />
      <path d="M24 22 L32 12 L40 12 L34 22 Z" fill="var(--surface)" />
      <path d="M38 22 L46 12 L54 12 L48 22 Z" fill="var(--coral)" />
      <path d="M26 30 L26 46 L40 38 Z" fill="var(--surface)" />
    </svg>
  )
}

export function SongIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <line x1="24" y1="16" x2="24" y2="46" stroke="var(--accent-strong)" strokeWidth="3" strokeLinecap="round" />
      <line x1="42" y1="10" x2="42" y2="40" stroke="var(--accent-strong)" strokeWidth="3" strokeLinecap="round" />
      <line x1="24" y1="16" x2="42" y2="10" stroke="var(--accent-strong)" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="19" cy="48" rx="7" ry="5" fill="var(--accent)" stroke="var(--accent-strong)" strokeWidth="2" />
      <ellipse cx="37" cy="42" rx="7" ry="5" fill="var(--accent)" stroke="var(--accent-strong)" strokeWidth="2" />
    </svg>
  )
}

export function PictureIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="10" y="12" width="44" height="36" rx="2" fill="var(--surface)" stroke="var(--butter-strong)" strokeWidth="2.5" />
      <circle cx="20" cy="22" r="4" fill="var(--butter)" />
      <path d="M12 44 L24 30 L34 40 L42 30 L52 44 Z" fill="var(--accent-bg)" stroke="var(--accent-strong)" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

export function CakeIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="12" y="34" width="40" height="20" rx="3" fill="var(--coral-bg)" stroke="var(--coral-strong)" strokeWidth="2.5" />
      <path d="M12 34 Q18 28 24 34 Q30 28 36 34 Q42 28 48 34 Q52 34 52 34" fill="var(--surface)" stroke="var(--coral-strong)" strokeWidth="2" />
      <rect x="30" y="14" width="4" height="12" fill="var(--butter-strong)" />
      <path d="M32 8 Q28 12 32 16 Q36 12 32 8 Z" fill="var(--coral)" />
    </svg>
  )
}

export function PartyIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path d="M14 54 L28 22 L48 42 Z" fill="var(--butter-bg)" stroke="var(--butter-strong)" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="40" cy="16" r="2.5" fill="var(--coral)" />
      <circle cx="50" cy="24" r="2" fill="var(--sky)" />
      <circle cx="46" cy="10" r="1.8" fill="var(--accent)" />
      <circle cx="14" cy="20" r="2" fill="var(--coral)" />
      <circle cx="6" cy="34" r="1.8" fill="var(--sky)" />
    </svg>
  )
}

export function PondIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <ellipse cx="32" cy="36" rx="26" ry="16" fill="var(--sky-bg)" stroke="var(--sky-strong)" strokeWidth="2.5" />
      <ellipse cx="24" cy="32" rx="9" ry="5" fill="var(--accent)" opacity="0.7" />
      <ellipse cx="42" cy="42" rx="6" ry="3.5" fill="var(--accent)" opacity="0.7" />
    </svg>
  )
}

// 음식(추가)
export function RiceBowlIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path d="M12 30 Q12 48 32 50 Q52 48 52 30 Z" fill="var(--surface)" stroke="var(--coral-strong)" strokeWidth="2.5" />
      <ellipse cx="32" cy="30" rx="20" ry="6" fill="var(--coral-bg)" stroke="var(--coral-strong)" strokeWidth="2.2" />
      <ellipse cx="32" cy="26" rx="13" ry="4.5" fill="var(--surface)" stroke="var(--text-muted)" strokeWidth="1.6" />
    </svg>
  )
}

export function MealIcon({ size = 64, accent = 'var(--butter-strong)', accentBg = 'var(--butter-bg)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <ellipse cx="24" cy="42" rx="16" ry="10" fill="var(--surface)" stroke={accent} strokeWidth="2.5" />
      <ellipse cx="24" cy="38" rx="12" ry="6" fill={accentBg} stroke={accent} strokeWidth="1.8" />
      <circle cx="46" cy="34" r="10" fill="var(--sky-bg)" stroke="var(--sky-strong)" strokeWidth="2.2" />
      <path d="M40 32 Q46 26 52 32" stroke="var(--sky-strong)" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}

export function BentoIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="8" y="18" width="48" height="30" rx="4" fill="var(--surface)" stroke="var(--coral-strong)" strokeWidth="2.5" />
      <line x1="32" y1="18" x2="32" y2="48" stroke="var(--coral-strong)" strokeWidth="2" />
      <ellipse cx="20" cy="33" rx="9" ry="7" fill="var(--surface-2)" stroke="var(--coral-strong)" strokeWidth="1.6" />
      <circle cx="42" cy="28" r="4" fill="var(--coral)" />
      <circle cx="48" cy="38" r="3" fill="var(--accent)" />
      <circle cx="40" cy="40" r="3" fill="var(--butter)" />
    </svg>
  )
}

export function RamenIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path d="M10 28 Q10 50 32 52 Q54 50 54 28 Z" fill="var(--coral-bg)" stroke="var(--coral-strong)" strokeWidth="2.5" />
      <ellipse cx="32" cy="28" rx="22" ry="6" fill="var(--surface)" stroke="var(--coral-strong)" strokeWidth="2.2" />
      <path d="M20 26 Q24 22 20 18 M32 26 Q36 22 32 18 M44 26 Q48 22 44 18" stroke="var(--butter-strong)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M18 12 Q16 8 19 5 M46 12 Q44 8 47 5" stroke="var(--text-muted)" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

export function SakeIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path d="M26 10 L38 10 L40 22 L44 30 L44 50 Q44 54 32 54 Q20 54 20 50 L20 30 L24 22 Z" fill="var(--surface)" stroke="var(--sky-strong)" strokeWidth="2.5" />
      <rect x="16" y="42" width="14" height="10" rx="1.5" fill="var(--sky-bg)" stroke="var(--sky-strong)" strokeWidth="2" />
    </svg>
  )
}

// 생활용품
export function DoorIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="16" y="8" width="32" height="48" rx="2" fill="var(--butter-bg)" stroke="var(--butter-strong)" strokeWidth="2.5" />
      <circle cx="40" cy="32" r="2.2" fill="var(--butter-strong)" />
    </svg>
  )
}

export function HeaterIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="10" y="18" width="44" height="30" rx="4" fill="var(--surface-2)" stroke="var(--text-muted)" strokeWidth="2.5" />
      <rect x="18" y="24" width="20" height="18" rx="2" fill="var(--coral-bg)" stroke="var(--coral-strong)" strokeWidth="2" />
      <path d="M24 38 Q22 32 26 28 Q26 34 30 32 Q28 38 24 38 Z" fill="var(--coral)" />
      <circle cx="46" cy="33" r="3" fill="var(--text-muted)" opacity="0.5" />
    </svg>
  )
}

export function CalendarIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="10" y="14" width="44" height="40" rx="3" fill="var(--surface)" stroke="var(--coral-strong)" strokeWidth="2.5" />
      <rect x="10" y="14" width="44" height="10" fill="var(--coral-bg)" stroke="var(--coral-strong)" strokeWidth="2.5" />
      <line x1="20" y1="10" x2="20" y2="18" stroke="var(--coral-strong)" strokeWidth="3" strokeLinecap="round" />
      <line x1="44" y1="10" x2="44" y2="18" stroke="var(--coral-strong)" strokeWidth="3" strokeLinecap="round" />
      {[30, 38, 46].map((y) => (
        <g key={y}>
          <circle cx="20" cy={y} r="2" fill="var(--text-muted)" opacity="0.5" />
          <circle cx="32" cy={y} r="2" fill="var(--text-muted)" opacity="0.5" />
          <circle cx="44" cy={y} r="2" fill="var(--text-muted)" opacity="0.5" />
        </g>
      ))}
    </svg>
  )
}

export function WalletIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="8" y="20" width="48" height="32" rx="4" fill="var(--accent-bg)" stroke="var(--accent-strong)" strokeWidth="2.5" />
      <path d="M8 28 L56 28" stroke="var(--accent-strong)" strokeWidth="2" opacity="0.6" />
      <circle cx="46" cy="36" r="3" fill="var(--accent-strong)" />
    </svg>
  )
}

export function RadioIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <line x1="44" y1="18" x2="50" y2="6" stroke="var(--text-muted)" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="10" y="20" width="44" height="30" rx="4" fill="var(--butter-bg)" stroke="var(--butter-strong)" strokeWidth="2.5" />
      <circle cx="22" cy="35" r="8" fill="var(--surface)" stroke="var(--butter-strong)" strokeWidth="2" />
      <rect x="36" y="28" width="12" height="4" rx="1" fill="var(--butter-strong)" opacity="0.6" />
      <circle cx="40" cy="40" r="2.4" fill="var(--butter-strong)" />
      <circle cx="48" cy="40" r="2.4" fill="var(--butter-strong)" />
    </svg>
  )
}

export function ShoppingBagIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path d="M16 24 L48 24 L44 54 L20 54 Z" fill="var(--coral-bg)" stroke="var(--coral-strong)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M24 24 Q24 10 32 10 Q40 10 40 24" stroke="var(--coral-strong)" strokeWidth="2.5" fill="none" />
    </svg>
  )
}

export function DumbbellIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <line x1="20" y1="32" x2="44" y2="32" stroke="var(--text)" strokeWidth="4" strokeLinecap="round" />
      <rect x="8" y="20" width="12" height="24" rx="4" fill="var(--accent-bg)" stroke="var(--accent-strong)" strokeWidth="2.5" />
      <rect x="44" y="20" width="12" height="24" rx="4" fill="var(--accent-bg)" stroke="var(--accent-strong)" strokeWidth="2.5" />
    </svg>
  )
}

export function ButtonIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <circle cx="32" cy="32" r="22" fill="var(--sky-bg)" stroke="var(--sky-strong)" strokeWidth="2.5" />
      <circle cx="26" cy="26" r="2.2" fill="var(--sky-strong)" />
      <circle cx="38" cy="26" r="2.2" fill="var(--sky-strong)" />
      <circle cx="26" cy="38" r="2.2" fill="var(--sky-strong)" />
      <circle cx="38" cy="38" r="2.2" fill="var(--sky-strong)" />
    </svg>
  )
}

export function SweaterIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path
        d="M22 14 L12 24 L18 32 L22 28 L22 52 L42 52 L42 28 L46 32 L52 24 L42 14 Q37 20 32 20 Q27 20 22 14 Z"
        fill="var(--coral-bg)"
        stroke="var(--coral-strong)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <line x1="22" y1="44" x2="42" y2="44" stroke="var(--coral-strong)" strokeWidth="1.8" opacity="0.6" />
      <line x1="24" y1="48" x2="40" y2="48" stroke="var(--coral-strong)" strokeWidth="1.8" opacity="0.6" />
    </svg>
  )
}

export function HandkerchiefIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="14" y="14" width="36" height="36" rx="2" fill="var(--surface)" stroke="var(--sky-strong)" strokeWidth="2.5" transform="rotate(-8 32 32)" />
      <circle cx="26" cy="26" r="1.6" fill="var(--sky)" />
      <circle cx="38" cy="26" r="1.6" fill="var(--sky)" />
      <circle cx="26" cy="38" r="1.6" fill="var(--sky)" />
      <circle cx="38" cy="38" r="1.6" fill="var(--sky)" />
    </svg>
  )
}

export function NecktieIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path d="M26 10 L38 10 L34 20 L30 20 Z" fill="var(--coral-strong)" />
      <path d="M30 20 L34 20 L42 48 L32 56 L22 48 Z" fill="var(--coral)" stroke="var(--coral-strong)" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}
