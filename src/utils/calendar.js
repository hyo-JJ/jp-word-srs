import { todayStr } from '../srs/srs'

// 월요일 시작 달력 그리드. 앞뒤 빈 칸은 null.
export function monthGrid(year, month) {
  const first = new Date(year, month - 1, 1)
  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDow = first.getDay() // 0=일 ... 6=토
  const leadingBlanks = firstDow === 0 ? 6 : firstDow - 1

  const cells = []
  for (let i = 0; i < leadingBlanks; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, date })
  }
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

export function todayMonthYear() {
  const [y, m] = todayStr().split('-')
  return { year: Number(y), month: Number(m) }
}

export function addMonth({ year, month }, delta) {
  const d = new Date(year, month - 1 + delta, 1)
  return { year: d.getFullYear(), month: d.getMonth() + 1 }
}
