// 단어 학습 마스터리 로직 — 순수 함수 모듈
// 플래시카드(스와이프) → 백지복습 모드1/모드2(70% 통과제) → 오답풀 객관식(3연속 정답 마스터)
// → 완전암기 주기적 재복습 → 급수 90% 게이트

import { addDaysStr } from './srs'

export const DAY_PASS_THRESHOLD = 0.7
export const MASTER_STREAK = 3
export const RECHECK_MIN_DAYS = 7
export const RECHECK_MAX_DAYS = 14
export const LEVEL_UNLOCK_THRESHOLD = 0.9

// 모드1/모드2 점수({correct, total})로 평균 정답률 계산 (0~1), 아직 안 끝났으면 null
export function dayAvgScore(mode1Score, mode2Score) {
  if (!mode1Score || !mode2Score || !mode1Score.total || !mode2Score.total) return null
  const acc1 = mode1Score.correct / mode1Score.total
  const acc2 = mode2Score.correct / mode2Score.total
  return (acc1 + acc2) / 2
}

export function dayPassed(avgScore) {
  return avgScore !== null && avgScore >= DAY_PASS_THRESHOLD
}

// 오답풀 객관식 복습 연속 정답 카운트
export function nextCorrectStreak(streak, correct) {
  return correct ? streak + 1 : 0
}

export function isMastered(streak) {
  return streak >= MASTER_STREAK
}

// 완전암기 후 1~2주(7~14일) 사이 무작위 날짜에 재복습 예약
export function scheduleRecheck(today) {
  const days = RECHECK_MIN_DAYS + Math.floor(Math.random() * (RECHECK_MAX_DAYS - RECHECK_MIN_DAYS + 1))
  return addDaysStr(today, days)
}

export function isRecheckDue(nextRecheckDate, today) {
  return !!nextRecheckDate && nextRecheckDate <= today
}

// 급수 전체 마스터율(0~1) 및 90% 게이트
export function levelMasteryRate(masteredCount, total) {
  return total ? masteredCount / total : 0
}

export function isLevelUnlocked(rate) {
  return rate >= LEVEL_UNLOCK_THRESHOLD
}
