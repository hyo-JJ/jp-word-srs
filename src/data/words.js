import n5Raw from './n5_words.json'
import n4Raw from './n4_words.json'

function withIds(raw, startId) {
  return raw.map((w, i) => ({ id: startId + i, ...w }))
}

// N5 단어의 id(배열 인덱스)는 기존 사용자 진행 기록과 매핑되어 있어 순서를 바꾸면 안 됨.
// N4는 그 뒤 id부터 이어 붙인다.
const N5_WORDS = withIds(n5Raw, 0)
const N4_WORDS = withIds(n4Raw, N5_WORDS.length)

export const WORDS = [...N5_WORDS, ...N4_WORDS]
export const WORDS_BY_ID = Object.fromEntries(WORDS.map((w) => [w.id, w]))
export const LEVELS = [...new Set(WORDS.map((w) => w.level))] // ['N5', 'N4']

const N5_DAY_COUNT = 28 // 기존 커리큘럼 고정값(변경 시 기존 사용자 Day 매핑이 깨짐)
const DAY_WORD_TARGET = 12 // N5 외 레벨은 하루 약 12개 기준으로 일수 산정

function splitIntoDays(words, dayCount) {
  const base = Math.floor(words.length / dayCount)
  const remainder = words.length % dayCount
  const days = []
  let cursor = 0
  for (let day = 1; day <= dayCount; day++) {
    const size = base + (day <= remainder ? 1 : 0)
    days.push({ day, words: words.slice(cursor, cursor + size) })
    cursor += size
  }
  return days
}

function levelWords(level) {
  return WORDS.filter((w) => w.level === level)
}

export const LEVEL_DAY_COUNT = Object.fromEntries(
  LEVELS.map((level) => [
    level,
    level === 'N5' ? N5_DAY_COUNT : Math.max(1, Math.ceil(levelWords(level).length / DAY_WORD_TARGET)),
  ])
)

export const LEVEL_WORD_DAYS = Object.fromEntries(
  LEVELS.map((level) => [level, splitIntoDays(levelWords(level), LEVEL_DAY_COUNT[level])])
)

export function dayCountFor(level) {
  return LEVEL_DAY_COUNT[level] ?? 0
}

export function wordsForDay(level, day) {
  return LEVEL_WORD_DAYS[level]?.[day - 1]?.words ?? []
}
