// 사용자가 손가락/마우스로 그린 궤적을 KanjiVG 기준 획 데이터(points)와 비교해
// 정오를 판정하는 순수 함수들. 완벽한 필기 인식이 아니라 "대략 맞는 방향·위치로
// 그렸는지"를 확인하는 관대한 매칭이 목표다.

const KANJI_RE = /[一-鿿㐀-䶿]/

export function extractKanjiChars(word) {
  const seen = new Set()
  const result = []
  for (const ch of word) {
    if (KANJI_RE.test(ch) && !seen.has(ch)) {
      seen.add(ch)
      result.push(ch)
    }
  }
  return result
}

function resample(points, count) {
  if (points.length === 0) return []
  if (points.length === 1) return Array.from({ length: count }, () => points[0])

  const segLengths = []
  let total = 0
  for (let i = 1; i < points.length; i++) {
    const dx = points[i][0] - points[i - 1][0]
    const dy = points[i][1] - points[i - 1][1]
    const len = Math.sqrt(dx * dx + dy * dy)
    segLengths.push(len)
    total += len
  }
  if (total === 0) return Array.from({ length: count }, () => points[0])

  const result = []
  for (let i = 0; i < count; i++) {
    const target = (total * i) / (count - 1)
    let acc = 0
    let seg = 0
    while (seg < segLengths.length - 1 && acc + segLengths[seg] < target) {
      acc += segLengths[seg]
      seg++
    }
    const segLen = segLengths[seg] || 1
    const t = Math.min(1, Math.max(0, (target - acc) / segLen))
    const [x1, y1] = points[seg]
    const [x2, y2] = points[seg + 1]
    result.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t])
  }
  return result
}

function dist(a, b) {
  const dx = a[0] - b[0]
  const dy = a[1] - b[1]
  return Math.sqrt(dx * dx + dy * dy)
}

// viewBox는 항상 0..109 (KanjiVG 표준) 이므로 그 기준으로 허용 오차를 잡는다.
const VIEWBOX_SIZE = 109

export function scoreStroke(userPoints, refPoints) {
  if (userPoints.length < 2) {
    return { correct: false, reason: 'too-short' }
  }

  const sampleCount = refPoints.length
  const userSampled = resample(userPoints, sampleCount)

  let sumDist = 0
  for (let i = 0; i < sampleCount; i++) {
    sumDist += dist(userSampled[i], refPoints[i])
  }
  const avgDist = sumDist / sampleCount

  const startDist = dist(userSampled[0], refPoints[0])
  const endDist = dist(userSampled[sampleCount - 1], refPoints[sampleCount - 1])

  // 시작/끝을 반대로 그렸는지(획 방향이 거꾸로인지) 확인
  const reversedStartDist = dist(userSampled[0], refPoints[sampleCount - 1])
  const reversedEndDist = dist(userSampled[sampleCount - 1], refPoints[0])
  const reversed = reversedStartDist + reversedEndDist < startDist + endDist - 6

  const avgThreshold = VIEWBOX_SIZE * 0.22
  const endpointThreshold = VIEWBOX_SIZE * 0.32

  const correct = !reversed && avgDist < avgThreshold && startDist < endpointThreshold && endDist < endpointThreshold

  return {
    correct,
    reason: correct ? null : reversed ? 'reversed' : 'off-path',
  }
}
