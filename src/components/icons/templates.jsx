// 가족 단어용 인물 아이콘 템플릿 — props로 헤어스타일/색상을 바꿔 10명을 하나의 컴포넌트로 표현
export function PersonIcon({ size = 64, hair = 'short', bodyColor = 'var(--accent)', glasses = false, small = false }) {
  const headR = small ? 12 : 14
  const headCy = small ? 24 : 22
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <circle cx="32" cy={headCy} r={headR} fill="var(--surface-2)" stroke="var(--text-muted)" strokeWidth="2" />

      {hair === 'short' && (
        <path d={`M${32 - headR} ${headCy - 2} Q32 ${headCy - headR - 8} ${32 + headR} ${headCy - 2} L${32 + headR} ${headCy - 6} Q32 ${headCy - headR - 4} ${32 - headR} ${headCy - 6} Z`} fill="var(--text)" opacity="0.75" />
      )}
      {hair === 'long' && (
        <>
          <path d={`M${32 - headR} ${headCy - 4} Q32 ${headCy - headR - 6} ${32 + headR} ${headCy - 4} L${32 + headR} ${headCy + 14} Q${32 + headR - 4} ${headCy + 8} ${32 + headR - 2} ${headCy - 2} L${32 - headR + 2} ${headCy - 2} Q${32 - headR + 4} ${headCy + 8} ${32 - headR} ${headCy + 14} Z`} fill="var(--text)" opacity="0.75" />
        </>
      )}
      {hair === 'twintail' && (
        <>
          <path d={`M${32 - headR} ${headCy - 3} Q32 ${headCy - headR - 6} ${32 + headR} ${headCy - 3} Z`} fill="var(--text)" opacity="0.75" />
          <circle cx={32 - headR - 2} cy={headCy + 6} r="4" fill="var(--text)" opacity="0.75" />
          <circle cx={32 + headR + 2} cy={headCy + 6} r="4" fill="var(--text)" opacity="0.75" />
        </>
      )}
      {hair === 'bun' && (
        <>
          <path d={`M${32 - headR} ${headCy - 3} Q32 ${headCy - headR - 4} ${32 + headR} ${headCy - 3} Z`} fill="var(--text)" opacity="0.7" />
          <circle cx="32" cy={headCy - headR - 5} r="5" fill="var(--text)" opacity="0.7" />
        </>
      )}
      {hair === 'mustache' && (
        <path d={`M${32 - headR} ${headCy - 3} Q32 ${headCy - headR - 8} ${32 + headR} ${headCy - 3} Z`} fill="var(--text)" opacity="0.75" />
      )}
      {hair === 'gray' && (
        <path d={`M${32 - headR} ${headCy - 3} Q32 ${headCy - headR - 6} ${32 + headR} ${headCy - 3} Z`} fill="var(--text-muted)" opacity="0.8" />
      )}
      {hair === 'bald' && null}

      {hair === 'mustache' && (
        <path d={`M27 ${headCy + 6} Q32 ${headCy + 9} 37 ${headCy + 6}`} stroke="var(--text)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}

      {glasses && (
        <g stroke="var(--text-muted)" strokeWidth="2" fill="none">
          <circle cx={32 - 6} cy={headCy + 1} r="5" />
          <circle cx={32 + 6} cy={headCy + 1} r="5" />
          <line x1={32 - 1} y1={headCy + 1} x2={32 + 1} y2={headCy + 1} />
        </g>
      )}

      {!glasses && (
        <>
          <circle cx="27" cy={headCy + 1} r="1.6" fill="var(--text)" />
          <circle cx="37" cy={headCy + 1} r="1.6" fill="var(--text)" />
        </>
      )}
      <path d={`M28 ${headCy + 6} Q32 ${headCy + 9} 36 ${headCy + 6}`} stroke="var(--text)" strokeWidth="2" fill="none" strokeLinecap="round" />

      <path d={`M18 58 Q18 ${headCy + headR + 6} 32 ${headCy + headR + 4} Q46 ${headCy + headR + 6} 46 58 Z`} fill={bodyColor} />
    </svg>
  )
}

// 건물류 단어용 아이콘 템플릿 — 지붕 모양/창문 배치를 props로 바꿔 여러 건물 단어를 표현
export function BuildingIcon({ size = 64, roof = 'flat', rows = 3, cols = 2, wallColor = 'var(--accent-bg)', accent = 'var(--accent)' }) {
  const wallTop = roof === 'peak' ? 26 : roof === 'awning' ? 24 : 16
  const winW = 5
  const winGapX = (40 - cols * winW) / (cols + 1)
  const winGapY = (54 - wallTop - rows * winW) / (rows + 1)

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect x="12" y={wallTop} width="40" height={54 - wallTop} rx="2" fill={wallColor} stroke={accent} strokeWidth="2.5" />

      {roof === 'peak' && <path d="M9 27 L32 10 L55 27 Z" fill={accent} />}
      {roof === 'awning' && (
        <>
          <path d="M10 26 Q32 14 54 26 L54 20 Q32 10 10 20 Z" fill="var(--coral)" />
          <rect x="26" y="42" width="12" height="12" fill="var(--surface)" stroke={accent} strokeWidth="2" />
        </>
      )}
      {roof === 'flag' && (
        <>
          <line x1="32" y1="16" x2="32" y2="6" stroke={accent} strokeWidth="2" />
          <path d="M32 6 L44 9 L32 12 Z" fill="var(--butter)" />
        </>
      )}

      {roof !== 'awning' &&
        Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => (
            <rect
              key={`${r}-${c}`}
              x={12 + winGapX * (c + 1) + winW * c}
              y={wallTop + winGapY * (r + 1) + winW * r}
              width={winW}
              height={winW}
              fill="var(--sky-bg)"
              stroke={accent}
              strokeWidth="1.4"
            />
          ))
        )}

      {roof === 'peak' && <rect x="28" y="44" width="8" height="10" fill={accent} />}
    </svg>
  )
}
