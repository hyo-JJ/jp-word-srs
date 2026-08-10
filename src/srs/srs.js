// 날짜 유틸 — 로컬 날짜 기준 YYYY-MM-DD (UTC 변환 없이) — toISOString()을 쓰면 UTC+ 시간대(KST/JST 등)에서
// 하루 전날로 밀리는 문제가 있어 로컬 연/월/일을 직접 조합함
export function todayStr(date = new Date()) {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDaysStr(baseDateStr, days) {
  const d = new Date(baseDateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return todayStr(d)
}
