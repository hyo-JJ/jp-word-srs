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

// "죄송합니다, 실례합니다" / "형/오빠(호칭)" / "①좋은 ②충분한"처럼 한 필드에 여러 유사어가
// 콤마·슬래시·①②③ 번호로 함께 적혀 있는 경우, 그중 하나만 맞혀도 정답으로 인정할 수 있도록
// 후보 목록을 뽑아낸다.
export function textAlternatives(text) {
  const variants = new Set()
  const stripped = (text ?? '').replace(/\([^)]*\)/g, '')
  for (const base of [text, stripped]) {
    for (const part of (base ?? '').split(/[,/①-⑩]/)) {
      const t = part.trim().replace(/^~+|~+$/g, '')
      if (t) variants.add(t)
    }
  }
  return [...variants]
}

export function isAutoCorrectAny(input, answers, threshold = 0.85) {
  return answers.some((answer) => isAutoCorrect(input, answer, threshold))
}
