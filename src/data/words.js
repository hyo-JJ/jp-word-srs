import raw from './n5_words.json'

export const WORDS = raw.map((w, i) => ({ id: i, ...w }))
export const WORDS_BY_ID = Object.fromEntries(WORDS.map((w) => [w.id, w]))
export const LEVELS = [...new Set(WORDS.map((w) => w.level))]

export const DAY_COUNT = 28

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

// 315개 N5 단어를 28일 분량으로 균등 분배 (하루 11~12개)
export const WORD_DAYS = splitIntoDays(WORDS, DAY_COUNT)

export function wordsForDay(day) {
  return WORD_DAYS[day - 1]?.words ?? []
}
