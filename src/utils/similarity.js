// 간단한 문자열 유사도 채점 (Levenshtein 기반)
function levenshtein(a, b) {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    }
  }
  return dp[m][n]
}

function normalize(s) {
  return (s ?? '').trim().toLowerCase().replace(/\s+/g, '')
}

// 0(전혀 다름) ~ 1(완전 일치)
export function similarity(input, answer) {
  const a = normalize(input)
  const b = normalize(answer)
  if (!a && !b) return 1
  if (!a || !b) return 0
  const dist = levenshtein(a, b)
  return 1 - dist / Math.max(a.length, b.length)
}

export function isAutoCorrect(input, answer, threshold = 0.85) {
  return similarity(input, answer) >= threshold
}
