import { LEVEL_WORD_DAYS } from '../data/words'
import grammarBank from '../data/jlptGrammarBank.json'
import readingBank from '../data/jlptReadingBank.json'
import { similarity as textSimilarity } from './similarity'

// 28일 커리큘럼을 7일 단위 4구간으로 나눠 각 구간 통과 시 모의고사 1회씩 해제
export const JLPT_BLOCKS = [
  { block: 1, startDay: 1, endDay: 7 },
  { block: 2, startDay: 8, endDay: 14 },
  { block: 3, startDay: 15, endDay: 21 },
  { block: 4, startDay: 22, endDay: 28 },
]

export function isBlockUnlocked(block, completedDays) {
  const def = JLPT_BLOCKS.find((b) => b.block === block)
  if (!def) return false
  const completed = new Set(completedDays)
  for (let d = def.startDay; d <= def.endDay; d++) {
    if (!completed.has(d)) return false
  }
  return true
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickN(arr, n) {
  return shuffle(arr).slice(0, n)
}

// 한자 표기끼리 겹치는 글자 비율(0~1) — 火曜日/水曜日처럼 한 글자만 다른 단어를 헷갈리게 고르기 위함
function charOverlapScore(a, b) {
  if (!a || !b) return 0
  const setA = new Set(a)
  const setB = new Set(b)
  let shared = 0
  for (const ch of setA) if (setB.has(ch)) shared++
  return shared / Math.max(setA.size, setB.size)
}

// 정답과 가장 헷갈리는(유사도 높은) 후보 중에서 오답을 뽑는다.
// 매번 똑같은 오답 조합만 나오지 않도록, 유사도 상위권 안에서만 무작위로 선택한다.
function pickConfusingDistractors(candidates, correctKey, keyFn, scoreFn, count) {
  const scored = shuffle(candidates)
    .map((w) => ({ w, score: scoreFn(keyFn(w), correctKey) }))
    .sort((a, b) => b.score - a.score)
  const windowSize = Math.min(scored.length, Math.max(count * 3, count + 2))
  return pickN(
    scored.slice(0, windowSize).map((s) => s.w),
    count
  )
}

// 해당 구간까지 배운 단어 전체(누적)를 문제 출제 범위로 사용
function wordPoolForBlock(block) {
  const def = JLPT_BLOCKS.find((b) => b.block === block)
  if (!def) return []
  return LEVEL_WORD_DAYS.N5.filter((d) => d.day <= def.endDay).flatMap((d) => d.words)
}

// 문자·어휘 15문제: 한자읽기 5 + 표기(한자 고르기) 5 + 뜻 고르기 5
function buildVocabQuestions(pool) {
  const usedIds = new Set()

  const kanjiCandidates = pool.filter((w) => w.word !== w.reading)
  const kanjiWords = pickN(kanjiCandidates, 5)
  kanjiWords.forEach((w) => usedIds.add(w.id))
  const kanjiQs = kanjiWords.map((word) => {
    const distractors = pickConfusingDistractors(
      pool.filter((w) => w.id !== word.id && w.reading !== word.reading),
      word.reading,
      (w) => w.reading,
      textSimilarity,
      3
    ).map((w) => w.reading)
    return {
      id: `vk-${word.id}`,
      type: 'kanji-reading',
      prompt: word.word,
      choices: shuffle([word.reading, ...distractors]),
      answer: word.reading,
    }
  })

  const writingCandidates = pool.filter((w) => w.word !== w.reading && !usedIds.has(w.id))
  const writingWords = pickN(writingCandidates, 5)
  writingWords.forEach((w) => usedIds.add(w.id))
  const writingQs = writingWords.map((word) => {
    const distractors = pickConfusingDistractors(
      pool.filter((w) => w.id !== word.id && w.word !== word.word),
      word.word,
      (w) => w.word,
      charOverlapScore,
      3
    ).map((w) => w.word)
    return {
      id: `vw-${word.id}`,
      type: 'writing',
      prompt: word.reading,
      choices: shuffle([word.word, ...distractors]),
      answer: word.word,
    }
  })

  const meaningCandidates = pool.filter((w) => !usedIds.has(w.id))
  const meaningWords = pickN(meaningCandidates, 5)
  const meaningQs = meaningWords.map((word) => {
    const distractors = pickConfusingDistractors(
      pool.filter((w) => w.id !== word.id && w.meaning !== word.meaning),
      word.meaning,
      (w) => w.meaning,
      textSimilarity,
      3
    ).map((w) => w.meaning)
    return {
      id: `vm-${word.id}`,
      type: 'meaning',
      prompt: word.word,
      sub: word.word !== word.reading ? word.reading : null,
      choices: shuffle([word.meaning, ...distractors]),
      answer: word.meaning,
    }
  })

  return [...kanjiQs, ...writingQs, ...meaningQs]
}

function buildGrammarQuestions() {
  return pickN(grammarBank, 10).map((g) => ({
    id: `gr-${g.id}`,
    type: 'grammar',
    prompt: g.sentence,
    choices: shuffle(g.choices),
    answer: g.answer,
  }))
}

function buildReadingQuestions() {
  return pickN(readingBank, 5).map((r) => ({
    id: `rd-${r.id}`,
    type: 'reading',
    passage: r.passage,
    prompt: r.question,
    choices: shuffle(r.choices),
    answer: r.answer,
  }))
}

// JLPT N5 형식(문자·어휘 15 + 문법 10 + 독해 5 = 총 30문제)의 모의고사 1회분 생성
export function buildJlptTest(block) {
  const pool = wordPoolForBlock(block)
  const vocabQs = buildVocabQuestions(pool)
  const grammarQs = buildGrammarQuestions()
  const readingQs = buildReadingQuestions()

  return {
    sections: [
      { title: '문자 · 어휘', questions: vocabQs },
      { title: '문법', questions: grammarQs },
      { title: '독해', questions: readingQs },
    ],
    questions: [...vocabQs, ...grammarQs, ...readingQs],
  }
}
