// SM-2 계열 간격반복(SRS) 스케줄러 — 순수 함수 모듈
// 카드 레코드 형태: { wordId, level, repetitions, intervalDays, easeFactor, nextReviewDate, status }

export const DEFAULT_EASE_FACTOR = 2.5
export const MIN_EASE_FACTOR = 1.3
export const MAX_EASE_FACTOR = 3.0
export const MASTER_REPETITIONS = 6

const STEP_INTERVALS = [1, 3, 7, 14] // repetitions 0,1,2,3 회차 통과 시 간격(일)

// 로컬 날짜 기준 YYYY-MM-DD (UTC 변환 없이) — toISOString()을 쓰면 UTC+ 시간대(KST/JST 등)에서
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

function stepIntervalDays(repetitions, easeFactor, prevIntervalDays) {
  if (repetitions < STEP_INTERVALS.length) {
    return STEP_INTERVALS[repetitions]
  }
  const base = prevIntervalDays || STEP_INTERVALS[STEP_INTERVALS.length - 1]
  return Math.max(1, Math.round(base * easeFactor))
}

function computeStatus(repetitions) {
  return repetitions >= MASTER_REPETITIONS ? 'mastered' : 'learning'
}

// 신규 단어 학습 완료 시 SRS에 최초 등록 (1일 뒤 복습 예약)
export function createCard(wordId, level, today = todayStr()) {
  return {
    wordId,
    level,
    repetitions: 0,
    intervalDays: 1,
    easeFactor: DEFAULT_EASE_FACTOR,
    nextReviewDate: addDaysStr(today, 1),
    status: 'learning',
  }
}

// difficulty: 'hard' | 'normal' | 'easy' — repetitions >= 4(5회차 이상) 단계에서 easeFactor 조정에 사용
export function reviewCard(card, isCorrect, difficulty = 'normal', today = todayStr()) {
  const rep = card.repetitions

  if (isCorrect) {
    let easeFactor = card.easeFactor
    if (rep >= STEP_INTERVALS.length) {
      const delta = difficulty === 'easy' ? 0.15 : difficulty === 'hard' ? -0.15 : 0
      easeFactor = Math.min(MAX_EASE_FACTOR, Math.max(MIN_EASE_FACTOR, easeFactor + delta))
    }
    const newRep = rep + 1
    const intervalDays = stepIntervalDays(newRep, easeFactor, card.intervalDays)
    return {
      ...card,
      repetitions: newRep,
      easeFactor,
      intervalDays,
      nextReviewDate: addDaysStr(today, intervalDays),
      status: computeStatus(newRep),
      immediateRequeue: false,
    }
  }

  // 오답
  if (rep === 0) {
    // 1회차 오답: 즉시 재출제(당일 복습 목록에 유지)
    return {
      ...card,
      repetitions: 0,
      intervalDays: 0,
      nextReviewDate: today,
      status: 'learning',
      immediateRequeue: true,
    }
  }

  if (rep === 1 || rep === 2) {
    // 2,3회차 오답: 간격 초기화 → 1일 뒤
    return {
      ...card,
      repetitions: 0,
      intervalDays: 1,
      nextReviewDate: addDaysStr(today, 1),
      status: 'learning',
      immediateRequeue: false,
    }
  }

  // 4회차 이상 오답: 간격 1단계 하향
  const newRep = Math.max(0, rep - 1)
  let intervalDays
  if (newRep >= STEP_INTERVALS.length) {
    intervalDays = Math.max(1, Math.round(card.intervalDays / card.easeFactor))
  } else {
    intervalDays = STEP_INTERVALS[newRep]
  }
  return {
    ...card,
    repetitions: newRep,
    intervalDays,
    nextReviewDate: addDaysStr(today, intervalDays),
    status: computeStatus(newRep),
    immediateRequeue: false,
  }
}

export function getDueCards(cards, today = todayStr()) {
  return cards.filter((c) => c.nextReviewDate <= today)
}
