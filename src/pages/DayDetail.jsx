import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom'
import { useApp } from '../store/AppDataContext'
import { wordsForDay, dayCountFor } from '../data/words'
import FlashcardSwipe from '../components/FlashcardSwipe'
import RecallSession from '../components/RecallSession'
import BackButton from '../components/BackButton'

// day가 바뀔 때마다(예: Day 완료 후 "Day N+1 시작") 내부 진행 상태(phase/index 등)가
// 확실히 초기화되도록 day를 key로 하여 매번 새로 마운트한다.
export default function DayDetail() {
  const { level, day: dayParam } = useParams()
  const { stats } = useApp()
  const levelStats = stats.levelStats.find((ls) => ls.level === level)

  if (!levelStats || !levelStats.unlocked) {
    return <Navigate to="/learn" replace />
  }

  return <DayDetailPage key={`${level}-${dayParam}`} level={level} dayParam={dayParam} />
}

function DayDetailPage({ level, dayParam }) {
  const day = Number(dayParam)
  const dayCount = dayCountFor(level)
  const navigate = useNavigate()
  const { markFlashcard, beginDayAttempt, finishFlashcardPhase, logModeAnswer, recordModeScore, finalizeDay, data } =
    useApp()

  const words = useMemo(() => wordsForDay(level, day), [level, day])
  const levelData = data.levelDays[level] || { days: {}, completedDays: [] }
  const alreadyDone = levelData.completedDays.includes(day)

  const [phase, setPhase] = useState(alreadyDone ? 'done' : 'memorize')
  const [index, setIndex] = useState(0)
  const [mode1Result, setMode1Result] = useState(null)

  useEffect(() => {
    if (!alreadyDone) beginDayAttempt(level, day)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, day])

  if (!Number.isInteger(day) || day < 1 || day > dayCount || words.length === 0) {
    return (
      <div className="empty-state">
        <span className="emoji">🤔</span>
        <h2>존재하지 않는 Day예요</h2>
        <Link to={`/learn/${level}`} className="btn btn-primary" style={{ marginTop: 20 }}>
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
          <h2>
            {level} Day {day} 암기 완료
          </h2>
          <p>{words.length}개 단어를 모두 확인했어요. 이제 백지 복습 모드1로 확인해볼까요?</p>
          <button
            className="btn btn-primary"
            style={{ marginTop: 20 }}
            onClick={() => {
              finishFlashcardPhase(level, day)
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
          <BackButton />
          <h1>
            {level} Day {day} 암기
          </h1>
          <p>
            {index + 1} / {words.length} · 스와이프하거나 버튼으로 다음 단어로 넘어가요
          </p>
        </div>

        <FlashcardSwipe
          key={word.id}
          word={word}
          onNext={() => {
            markFlashcard(word.id)
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
          <BackButton />
          <h1>
            {level} Day {day} 백지 복습
          </h1>
          <p>모드1 · 한자/단어를 보고 히라가나와 뜻을 입력해요</p>
        </div>
        <RecallSession
          key="mode1"
          items={items}
          mode="mode1"
          onAnswer={(wordId, correct) => logModeAnswer(wordId, 'mode1', correct)}
          onComplete={(session) => {
            recordModeScore(level, day, 'mode1', session)
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
          <BackButton />
          <h1>
            {level} Day {day} 백지 복습
          </h1>
          <p>모드2 · 뜻을 보고 한자와 히라가나를 입력해요</p>
        </div>
        <RecallSession
          key="mode2"
          items={items}
          mode="mode2"
          onAnswer={(wordId, correct) => logModeAnswer(wordId, 'mode2', correct)}
          onComplete={(session) => {
            recordModeScore(level, day, 'mode2', session)
            const wrongWordIds = Array.from(
              new Set([...(mode1Result?.wrongWordIds ?? []), ...session.wrongWordIds])
            )
            finalizeDay(level, day, wrongWordIds)
            setPhase('result')
          }}
        />
      </div>
    )
  }

  if (phase === 'result') {
    const dayState = levelData.days[day] || {}
    const avgPct = dayState.avgScore != null ? Math.round(dayState.avgScore * 100) : 0

    if (dayState.passed) {
      return (
        <div className="empty-state">
          <span className="emoji">🎉</span>
          <h2>
            {level} Day {day} 통과!
          </h2>
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
        <h2>
          {level} Day {day} 재도전이 필요해요
        </h2>
        <p>모드1·모드2 평균 정답률 {avgPct}% — 70% 기준(통과)에 못 미쳤어요. 처음부터 다시 학습해요.</p>
        <button
          className="btn btn-primary"
          style={{ marginTop: 20 }}
          onClick={() => {
            beginDayAttempt(level, day)
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
      <h2>
        {level} Day {day} 완료!
      </h2>
      <p>암기와 백지 복습(모드1·모드2)을 모두 마쳤어요.</p>
      <div className="btn-row" style={{ marginTop: 20 }}>
        {day < dayCount && (
          <button className="btn btn-primary" onClick={() => navigate(`/day/${level}/${day + 1}`)}>
            Day {day + 1} 시작
          </button>
        )}
        <Link to={`/learn/${level}`} className="btn">
          커리큘럼으로
        </Link>
      </div>
    </div>
  )
}
