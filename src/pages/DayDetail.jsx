import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useApp } from '../store/AppDataContext'
import { wordsForDay, DAY_COUNT } from '../data/words'
import FlashcardSwipe from '../components/FlashcardSwipe'
import RecallSession from '../components/RecallSession'

// day가 바뀔 때마다(예: Day 완료 후 "Day N+1 시작") 내부 진행 상태(phase/index 등)가
// 확실히 초기화되도록 day를 key로 하여 매번 새로 마운트한다.
export default function DayDetail() {
  const { day: dayParam } = useParams()
  return <DayDetailPage key={dayParam} dayParam={dayParam} />
}

function DayDetailPage({ dayParam }) {
  const day = Number(dayParam)
  const navigate = useNavigate()
  const { markFlashcard, beginDayAttempt, finishFlashcardPhase, logModeAnswer, recordModeScore, finalizeDay, data } =
    useApp()

  const words = useMemo(() => wordsForDay(day), [day])
  const alreadyDone = data.completedDays.includes(day)

  const [phase, setPhase] = useState(alreadyDone ? 'done' : 'memorize')
  const [index, setIndex] = useState(0)
  const [mode1Result, setMode1Result] = useState(null)

  useEffect(() => {
    if (!alreadyDone) beginDayAttempt(day)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day])

  if (!Number.isInteger(day) || day < 1 || day > DAY_COUNT || words.length === 0) {
    return (
      <div className="empty-state">
        <span className="emoji">🤔</span>
        <h2>존재하지 않는 Day예요</h2>
        <Link to="/learn" className="btn btn-primary" style={{ marginTop: 20 }}>
          커리큘럼으로
        </Link>
      </div>
    )
  }

  const items = words.map((w) => ({ word: w, card: data.cards[w.id] })).filter((x) => x.card)

  if (phase === 'memorize') {
    if (index >= words.length) {
      return (
        <div className="empty-state">
          <span className="emoji">📗</span>
          <h2>Day {day} 암기 완료</h2>
          <p>{words.length}개 단어를 모두 확인했어요. 이제 백지 복습 모드1로 확인해볼까요?</p>
          <button
            className="btn btn-primary"
            style={{ marginTop: 20 }}
            onClick={() => {
              finishFlashcardPhase(day)
              setPhase('mode1')
            }}
          >
            모드1 시작
          </button>
        </div>
      )
    }

    const word = words[index]

    return (
      <div>
        <div className="page-header">
          <h1>Day {day} 암기</h1>
          <p>
            {index + 1} / {words.length} · 스와이프하거나 버튼으로 아는 단어를 표시해요
          </p>
        </div>

        <FlashcardSwipe
          key={word.id}
          word={word}
          onDecide={(known) => {
            markFlashcard(word.id, known)
            setIndex((i) => i + 1)
          }}
        />
      </div>
    )
  }

  if (phase === 'mode1') {
    return (
      <div>
        <div className="page-header">
          <h1>Day {day} 백지 복습</h1>
          <p>모드1 · 한자/단어를 보고 히라가나와 뜻을 입력해요</p>
        </div>
        <RecallSession
          items={items}
          mode="mode1"
          onAnswer={(wordId, correct) => logModeAnswer(wordId, 'mode1', correct)}
          onComplete={(session) => {
            recordModeScore(day, 'mode1', session)
            setMode1Result(session)
            setPhase('mode2')
          }}
        />
      </div>
    )
  }

  if (phase === 'mode2') {
    return (
      <div>
        <div className="page-header">
          <h1>Day {day} 백지 복습</h1>
          <p>모드2 · 뜻을 보고 한자와 히라가나를 입력해요</p>
        </div>
        <RecallSession
          items={items}
          mode="mode2"
          onAnswer={(wordId, correct) => logModeAnswer(wordId, 'mode2', correct)}
          onComplete={(session) => {
            recordModeScore(day, 'mode2', session)
            const wrongWordIds = Array.from(
              new Set([...(mode1Result?.wrongWordIds ?? []), ...session.wrongWordIds])
            )
            finalizeDay(day, wrongWordIds)
            setPhase('result')
          }}
        />
      </div>
    )
  }

  if (phase === 'result') {
    const dayState = data.days[day] || {}
    const avgPct = dayState.avgScore != null ? Math.round(dayState.avgScore * 100) : 0

    if (dayState.passed) {
      return (
        <div className="empty-state">
          <span className="emoji">🎉</span>
          <h2>Day {day} 통과!</h2>
          <p>모드1·모드2 평균 정답률 {avgPct}% — 70% 기준을 넘었어요.</p>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setPhase('done')}>
            완료 확인
          </button>
        </div>
      )
    }

    return (
      <div className="empty-state">
        <span className="emoji">💪</span>
        <h2>Day {day} 재도전이 필요해요</h2>
        <p>모드1·모드2 평균 정답률 {avgPct}% — 70% 기준(통과)에 못 미쳤어요. 처음부터 다시 학습해요.</p>
        <button
          className="btn btn-primary"
          style={{ marginTop: 20 }}
          onClick={() => {
            beginDayAttempt(day)
            setMode1Result(null)
            setIndex(0)
            setPhase('memorize')
          }}
        >
          다시 도전
        </button>
      </div>
    )
  }

  // phase === 'done'
  return (
    <div className="empty-state">
      <span className="emoji">🎊</span>
      <h2>Day {day} 완료!</h2>
      <p>암기와 백지 복습(모드1·모드2)을 모두 마쳤어요.</p>
      <div className="btn-row" style={{ marginTop: 20 }}>
        {day < DAY_COUNT && (
          <button className="btn btn-primary" onClick={() => navigate(`/day/${day + 1}`)}>
            Day {day + 1} 시작
          </button>
        )}
        <Link to="/learn" className="btn">
          커리큘럼으로
        </Link>
      </div>
    </div>
  )
}
