// 홈 화면 "학습(전체 커리큘럼)" 전용 아이콘 — 실제 아이콘 이미지가 없는 항목만 여기서 그린다.
// 나머지 홈 아이콘은 app/src/assets/icons(사용자 제공 이미지, 배경 제거본)를 사용한다.
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
