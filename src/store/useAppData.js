import { useCallback, useMemo, useState } from 'react'
import { WORDS, WORDS_BY_ID, LEVELS, WORD_DAYS, DAY_COUNT } from '../data/words'
import { createCard, reviewCard, getDueCards, todayStr, addDaysStr } from '../srs/srs'
import { loadData, saveData, resetData } from './storage'

export function useAppData() {
  const [data, setData] = useState(loadData)
  const today = todayStr()

  const update = useCallback((updater) => {
    setData((prev) => {
      const next = updater(prev)
      saveData(next)
      return next
    })
  }, [])

  const dueReviewCards = useMemo(() => {
    const cards = Object.values(data.cards)
    return getDueCards(cards, today)
      .map((c) => ({ card: c, word: WORDS_BY_ID[c.wordId] }))
      .filter((x) => x.word)
  }, [data, today])

  const completeNewWord = useCallback(
    (wordId) => {
      update((prev) => {
        if (prev.cards[wordId]) return prev
        const word = WORDS_BY_ID[wordId]
        const card = createCard(wordId, word.level, today)
        return {
          ...prev,
          cards: { ...prev.cards, [wordId]: card },
          events: [...prev.events, { date: today, kind: 'new', wordId }],
        }
      })
    },
    [update, today]
  )

  const submitReview = useCallback(
    (wordId, correct, difficulty = 'normal') => {
      let updatedCard = null
      update((prev) => {
        const card = prev.cards[wordId]
        if (!card) return prev
        updatedCard = reviewCard(card, correct, difficulty, today)
        return {
          ...prev,
          cards: { ...prev.cards, [wordId]: updatedCard },
          events: [...prev.events, { date: today, kind: 'review', wordId, correct }],
        }
      })
      return updatedCard
    },
    [update, today]
  )

  const markDayComplete = useCallback(
    (day) => {
      update((prev) =>
        prev.completedDays.includes(day)
          ? prev
          : { ...prev, completedDays: [...prev.completedDays, day] }
      )
    },
    [update]
  )

  const setLevelUnlocked = useCallback(
    (level, unlocked) => {
      update((prev) => ({
        ...prev,
        levelUnlocked: { ...prev.levelUnlocked, [level]: unlocked },
      }))
    },
    [update]
  )

  const reset = useCallback(() => {
    const fresh = resetData()
    setData(fresh)
  }, [])

  // --- 28일 커리큘럼 진행 상태 ---
  const dayList = useMemo(() => {
    return WORD_DAYS.map(({ day, words }) => {
      const memorized = words.filter((w) => data.cards[w.id]).length
      const mastered = words.filter((w) => data.cards[w.id]?.status === 'mastered').length
      const completed = data.completedDays.includes(day)
      return {
        day,
        total: words.length,
        memorized,
        mastered,
        completed,
        status: completed ? 'done' : memorized > 0 ? 'in_progress' : 'todo',
      }
    })
  }, [data])

  // 다음으로 이어서 학습하면 좋을 Day (완료 안 된 것 중 가장 앞) — 다 끝났으면 마지막 Day
  const nextDay = useMemo(() => {
    const notDone = dayList.find((d) => d.status !== 'done')
    return notDone ? notDone.day : DAY_COUNT
  }, [dayList])

  // --- 통계 ---
  const stats = useMemo(() => {
    const eventDates = [...new Set(data.events.map((e) => e.date))].sort()
    let streak = 0
    if (eventDates.length > 0) {
      const dateSet = new Set(eventDates)
      let cursor = dateSet.has(today) ? today : addDaysStr(today, -1)
      while (dateSet.has(cursor)) {
        streak++
        cursor = addDaysStr(cursor, -1)
      }
    }

    const todayNewDone = data.events.filter((e) => e.kind === 'new' && e.date === today).length
    const todayReviews = data.events.filter((e) => e.kind === 'review' && e.date === today)
    const todayReviewDone = todayReviews.length
    const todayReviewCorrect = todayReviews.filter((e) => e.correct).length

    const levelStats = LEVELS.map((level) => {
      const levelWords = WORDS.filter((w) => w.level === level)
      const total = levelWords.length
      let mastered = 0
      let learning = 0
      for (const w of levelWords) {
        const c = data.cards[w.id]
        if (!c) continue
        if (c.status === 'mastered') mastered++
        else learning++
      }
      return { level, total, mastered, learning, notStarted: total - mastered - learning }
    })

    // 최근 7일 정답률 추이
    const trend = []
    for (let i = 6; i >= 0; i--) {
      const d = addDaysStr(today, -i)
      const reviews = data.events.filter((e) => e.kind === 'review' && e.date === d)
      const correct = reviews.filter((e) => e.correct).length
      trend.push({
        date: d,
        total: reviews.length,
        correct,
        accuracy: reviews.length ? correct / reviews.length : null,
      })
    }

    return {
      streak,
      todayNewDone,
      todayReviewDone,
      todayReviewCorrect,
      levelStats,
      trend,
      totalWords: WORDS.length,
      totalIntroduced: Object.keys(data.cards).length,
      totalMastered: Object.values(data.cards).filter((c) => c.status === 'mastered').length,
      completedDays: data.completedDays.length,
      dayCount: DAY_COUNT,
    }
  }, [data, today])

  return {
    data,
    today,
    dueReviewCards,
    completeNewWord,
    submitReview,
    markDayComplete,
    setLevelUnlocked,
    reset,
    stats,
    dayList,
    nextDay,
  }
}
