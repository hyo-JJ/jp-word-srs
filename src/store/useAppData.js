import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { WORDS, WORDS_BY_ID, LEVELS, LEVEL_WORD_DAYS, dayCountFor } from '../data/words'
import { todayStr, addDaysStr } from '../srs/srs'
import {
  dayAvgScore,
  dayPassed,
  nextCorrectStreak,
  isMastered,
  scheduleRecheck,
  isRecheckDue,
  levelMasteryRate,
  isLevelUnlocked,
} from '../srs/mastery'
import { defaultData, loadData, saveData, resetData } from './storage'

const SAVE_DEBOUNCE_MS = 400

function freshCard(word) {
  return {
    wordId: word.id,
    level: word.level,
    status: 'new',
    correctStreak: 0,
    nextRecheckDate: null,
  }
}

export function useAppData(userId) {
  const [data, setData] = useState(defaultData)
  const [loading, setLoading] = useState(true)
  const today = todayStr()
  const saveTimer = useRef(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    loadData(userId).then((loaded) => {
      if (!cancelled) {
        setData(loaded)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [userId])

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [])

  const scheduleSave = useCallback(
    (next) => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        saveData(userId, next)
      }, SAVE_DEBOUNCE_MS)
    },
    [userId]
  )

  const update = useCallback(
    (updater) => {
      setData((prev) => {
        const next = updater(prev)
        scheduleSave(next)
        return next
      })
    },
    [scheduleSave]
  )

  // --- 플래시카드(스와이프) ---
  const markFlashcard = useCallback(
    (wordId) => {
      update((prev) => {
        const word = WORDS_BY_ID[wordId]
        const card = prev.cards[wordId] || freshCard(word)
        const updated = { ...card, status: card.status === 'new' ? 'learning' : card.status }
        return {
          ...prev,
          cards: { ...prev.cards, [wordId]: updated },
          events: [...prev.events, { date: today, kind: 'flashcard', wordId }],
        }
      })
    },
    [update, today]
  )

  // --- Day 진입/재도전 시작: 해당 Day의 시도 상태 초기화 ---
  const beginDayAttempt = useCallback(
    (level, day) => {
      update((prev) => {
        const levelData = prev.levelDays[level] || { days: {}, completedDays: [] }
        const prevDay = levelData.days[day]
        const attempts = (prevDay?.attempts || 0) + 1
        return {
          ...prev,
          levelDays: {
            ...prev.levelDays,
            [level]: {
              ...levelData,
              days: {
                ...levelData.days,
                [day]: {
                  flashcardDone: false,
                  mode1Score: null,
                  mode2Score: null,
                  avgScore: null,
                  passed: false,
                  attempts,
                  completed: levelData.completedDays.includes(day),
                },
              },
            },
          },
        }
      })
    },
    [update]
  )

  const finishFlashcardPhase = useCallback(
    (level, day) => {
      update((prev) => {
        const levelData = prev.levelDays[level] || { days: {}, completedDays: [] }
        return {
          ...prev,
          levelDays: {
            ...prev.levelDays,
            [level]: {
              ...levelData,
              days: { ...levelData.days, [day]: { ...(levelData.days[day] || {}), flashcardDone: true } },
            },
          },
        }
      })
    },
    [update]
  )

  // 백지 복습 문항 채점 로그 (모드1/모드2 공용)
  const logModeAnswer = useCallback(
    (wordId, mode, correct) => {
      update((prev) => ({
        ...prev,
        events: [...prev.events, { date: today, kind: mode, wordId, correct }],
      }))
    },
    [update, today]
  )

  // 모드1/모드2 세션 종료 시 점수 저장
  const recordModeScore = useCallback(
    (level, day, mode, session) => {
      const scoreKey = mode === 'mode1' ? 'mode1Score' : 'mode2Score'
      update((prev) => {
        const levelData = prev.levelDays[level] || { days: {}, completedDays: [] }
        return {
          ...prev,
          levelDays: {
            ...prev.levelDays,
            [level]: {
              ...levelData,
              days: {
                ...levelData.days,
                [day]: {
                  ...(levelData.days[day] || {}),
                  [scoreKey]: { correct: session.correct, total: session.total },
                },
              },
            },
          },
        }
      })
    },
    [update]
  )

  // 모드1+모드2 완료 후 평균 70% 게이트 판정, 오답 단어 오답풀에 등록
  const finalizeDay = useCallback(
    (level, day, wrongWordIds) => {
      let passed = false
      update((prev) => {
        const levelData = prev.levelDays[level] || { days: {}, completedDays: [] }
        const dayState = levelData.days[day] || {}
        const avg = dayAvgScore(dayState.mode1Score, dayState.mode2Score)
        passed = dayPassed(avg)
        const completedDays =
          passed && !levelData.completedDays.includes(day) ? [...levelData.completedDays, day] : levelData.completedDays

        let cards = prev.cards
        let wrongPool = prev.wrongPool
        for (const wordId of wrongWordIds) {
          const word = WORDS_BY_ID[wordId]
          const card = cards[wordId] || freshCard(word)
          cards = { ...cards, [wordId]: { ...card, status: 'wrongPool', correctStreak: 0 } }
          if (!wrongPool.includes(wordId)) wrongPool = [...wrongPool, wordId]
        }

        return {
          ...prev,
          levelDays: {
            ...prev.levelDays,
            [level]: {
              ...levelData,
              days: { ...levelData.days, [day]: { ...dayState, avgScore: avg, passed, completed: passed } },
              completedDays,
            },
          },
          cards,
          wrongPool,
        }
      })
      return passed
    },
    [update]
  )

  // --- 오답노트: 오답풀 객관식 + 완전암기 재복습 통합 큐 채점 ---
  const submitWrongPoolAnswer = useCallback(
    (wordId, correct) => {
      update((prev) => {
        const card = prev.cards[wordId]
        if (!card) return prev
        const isRecheck = card.status === 'mastered'
        let newCard
        let wrongPool = prev.wrongPool

        if (isRecheck) {
          if (correct) {
            newCard = { ...card, nextRecheckDate: scheduleRecheck(today) }
          } else {
            newCard = { ...card, status: 'wrongPool', correctStreak: 0, nextRecheckDate: null }
            if (!wrongPool.includes(wordId)) wrongPool = [...wrongPool, wordId]
          }
        } else {
          const streak = nextCorrectStreak(card.correctStreak, correct)
          if (isMastered(streak)) {
            newCard = { ...card, status: 'mastered', correctStreak: streak, nextRecheckDate: scheduleRecheck(today) }
            wrongPool = wrongPool.filter((id) => id !== wordId)
          } else {
            newCard = { ...card, correctStreak: streak }
          }
        }

        return {
          ...prev,
          cards: { ...prev.cards, [wordId]: newCard },
          wrongPool,
          events: [...prev.events, { date: today, kind: isRecheck ? 'recheck' : 'mc', wordId, correct }],
        }
      })
    },
    [update, today]
  )

  // --- 문장게임: 예문 어순 맞추기 채점 로그 (SRS 상태에는 영향 없음, 스트릭/통계용) ---
  const logSentenceAnswer = useCallback(
    (wordId, correct) => {
      update((prev) => ({
        ...prev,
        events: [...prev.events, { date: today, kind: 'sentence', wordId, correct }],
      }))
    },
    [update, today]
  )

  // --- JLPT 모의고사: 구간(7일 단위) 완료 시 최고/최근 점수 기록 ---
  const submitJlptTest = useCallback(
    (block, { correct, total }) => {
      update((prev) => {
        const prevResult = prev.jlptTests[block]
        const attempts = (prevResult?.attempts || 0) + 1
        const bestCorrect = Math.max(prevResult?.bestCorrect ?? 0, correct)
        return {
          ...prev,
          jlptTests: {
            ...prev.jlptTests,
            [block]: { attempts, lastCorrect: correct, lastTotal: total, bestCorrect, bestTotal: total },
          },
          events: [...prev.events, { date: today, kind: 'jlpt', correct: correct >= Math.ceil(total * 0.6) }],
        }
      })
    },
    [update, today]
  )

  const reset = useCallback(async () => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    const fresh = await resetData(userId)
    setData(fresh)
  }, [userId])

  // --- 오답노트 큐: 오답풀 + 재복습 도래 단어 ---
  const wrongPoolQueue = useMemo(() => {
    const wrongItems = data.wrongPool
      .map((id) => ({ word: WORDS_BY_ID[id], card: data.cards[id] }))
      .filter((x) => x.word && x.card)
    const dueRecheck = Object.values(data.cards)
      .filter((c) => c.status === 'mastered' && isRecheckDue(c.nextRecheckDate, today))
      .map((c) => ({ word: WORDS_BY_ID[c.wordId], card: c }))
    return [...wrongItems, ...dueRecheck]
  }, [data, today])

  // --- 레벨별 커리큘럼 진행 상태 ---
  const dayListByLevel = useMemo(() => {
    return Object.fromEntries(
      LEVELS.map((level) => {
        const levelData = data.levelDays[level] || { days: {}, completedDays: [] }
        const list = LEVEL_WORD_DAYS[level].map(({ day, words }) => {
          const dayState = levelData.days[day]
          const completed = levelData.completedDays.includes(day)
          let status = 'todo'
          if (completed) status = 'done'
          else if (dayState && dayState.avgScore !== null && !dayState.passed) status = 'failed'
          else if (dayState) status = 'in_progress'
          return {
            day,
            total: words.length,
            completed,
            status,
            avgScore: dayState?.avgScore ?? null,
            attempts: dayState?.attempts ?? 0,
          }
        })
        return [level, list]
      })
    )
  }, [data])

  const nextDayByLevel = useMemo(() => {
    return Object.fromEntries(
      LEVELS.map((level) => {
        const notDone = dayListByLevel[level].find((d) => d.status !== 'done')
        return [level, notDone ? notDone.day : dayCountFor(level)]
      })
    )
  }, [dayListByLevel])

  // --- 통계 ---
  const stats = useMemo(() => {
    const eventDates = [...new Set(data.events.map((e) => e.date))].sort()
    const eventDateSet = new Set(eventDates)

    // 이번 주(월~일) 요일별 학습 여부
    const todayDow = new Date(today + 'T00:00:00').getDay() // 0=일 ... 6=토
    const mondayOffset = todayDow === 0 ? -6 : 1 - todayDow
    const monday = addDaysStr(today, mondayOffset)
    const weekActivity = Array.from({ length: 7 }, (_, i) => {
      const date = addDaysStr(monday, i)
      return {
        date,
        studied: eventDateSet.has(date),
        isToday: date === today,
        isFuture: date > today,
      }
    })

    let streak = 0
    if (eventDates.length > 0) {
      const dateSet = eventDateSet
      let cursor = dateSet.has(today) ? today : addDaysStr(today, -1)
      while (dateSet.has(cursor)) {
        streak++
        cursor = addDaysStr(cursor, -1)
      }
    }

    const recallKinds = ['mode1', 'mode2', 'mc', 'recheck']
    const todayFlashcardDone = data.events.filter((e) => e.kind === 'flashcard' && e.date === today).length
    const todayRecall = data.events.filter((e) => recallKinds.includes(e.kind) && e.date === today)
    const todayRecallDone = todayRecall.length
    const todayRecallCorrect = todayRecall.filter((e) => e.correct).length

    const rawLevelStats = LEVELS.map((level) => {
      const levelWords = WORDS.filter((w) => w.level === level)
      const total = levelWords.length
      let mastered = 0
      let wrongPoolCount = 0
      let learning = 0
      for (const w of levelWords) {
        const c = data.cards[w.id]
        if (!c) continue
        if (c.status === 'mastered') mastered++
        else if (c.status === 'wrongPool') wrongPoolCount++
        else learning++
      }
      const rate = levelMasteryRate(mastered, total)
      const levelData = data.levelDays[level] || { days: {}, completedDays: [] }
      const dayCount = dayCountFor(level)
      const allDaysDone = levelData.completedDays.length >= dayCount
      return {
        level,
        total,
        mastered,
        learning,
        wrongPoolCount,
        notStarted: total - mastered - learning - wrongPoolCount,
        rate,
        dayCount,
        completedDaysCount: levelData.completedDays.length,
        allDaysDone,
      }
    })

    // 순차 잠금: 첫 레벨(N5)은 항상 열려있고, 이후 레벨은 이전 레벨을 90% 이상 완전암기 + 전체 Day 통과해야 열림
    let chainOpen = true
    const levelStats = rawLevelStats.map((ls) => {
      const unlocked = chainOpen
      chainOpen = chainOpen && ls.allDaysDone && isLevelUnlocked(ls.rate)
      return { ...ls, unlocked }
    })

    // 다 배웠는데 90%를 못 채운 레벨들의 부족한 단어 목록(레벨별)
    const weakWordsByLevel = Object.fromEntries(
      levelStats
        .filter((ls) => ls.unlocked && ls.allDaysDone && !isLevelUnlocked(ls.rate))
        .map((ls) => [
          ls.level,
          WORDS.filter((w) => w.level === ls.level && data.cards[w.id]?.status !== 'mastered').slice(0, 30),
        ])
    )

    // 홈 화면 "다음 학습" 바로가기용: 열려있고 아직 다 안 끝난 첫 레벨(전부 끝났으면 마지막 레벨)
    const currentLevel =
      levelStats.find((ls) => ls.unlocked && !(ls.allDaysDone && isLevelUnlocked(ls.rate)))?.level ??
      levelStats[levelStats.length - 1].level
    const currentLevelStats = levelStats.find((ls) => ls.level === currentLevel)

    // 최근 7일 정답률 추이
    const trend = []
    for (let i = 6; i >= 0; i--) {
      const d = addDaysStr(today, -i)
      const reviews = data.events.filter((e) => recallKinds.includes(e.kind) && e.date === d)
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
      weekActivity,
      todayFlashcardDone,
      todayRecallDone,
      todayRecallCorrect,
      levelStats,
      trend,
      totalWords: WORDS.length,
      totalMastered: Object.values(data.cards).filter((c) => c.status === 'mastered').length,
      wrongPoolCount: data.wrongPool.length,
      currentLevel,
      completedDays: currentLevelStats.completedDaysCount,
      dayCount: currentLevelStats.dayCount,
      weakWordsByLevel,
    }
  }, [data, today])

  return {
    data,
    loading,
    today,
    markFlashcard,
    beginDayAttempt,
    finishFlashcardPhase,
    logModeAnswer,
    recordModeScore,
    finalizeDay,
    submitWrongPoolAnswer,
    logSentenceAnswer,
    submitJlptTest,
    wrongPoolQueue,
    reset,
    stats,
    dayListByLevel,
    nextDayByLevel,
  }
}
