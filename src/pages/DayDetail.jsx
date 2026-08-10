import { useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useApp } from '../store/AppDataContext'
import { wordsForDay, DAY_COUNT } from '../data/words'
import RecallSession from '../components/RecallSession'

export default function DayDetail() {
  const { day: dayParam } = useParams()
  const day = Number(dayParam)
  const navigate = useNavigate()
  const { completeNewWord, submitReview, markDayComplete, data } = useApp()

  const words = useMemo(() => wordsForDay(day), [day])
  const alreadyDone = data.completedDays.includes(day)

  const [phase, setPhase] = useState(alreadyDone ? 'done' : 'memorize')
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

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

  if (phase === 'memorize') {
    if (index >= words.length) {
      return (
        <div className="empty-state">
          <span className="emoji">📗</span>
          <h2>Day {day} 암기 완료</h2>
          <p>{words.length}개 단어를 모두 확인했어요. 이제 백지 복습으로 확인해볼까요?</p>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setPhase('recall')}>
            백지 복습 시작
          </button>
        </div>
      )
    }

    const word = words[index]

    function handleNext() {
      completeNewWord(word.id)
      setRevealed(false)
      setIndex((i) => i + 1)
    }

    return (
      <div>
        <div className="page-header">
          <h1>Day {day} 암기</h1>
          <p>
            {index + 1} / {words.length}
          </p>
        </div>

        <div className="card" style={{ minHeight: 320, display: 'flex', flexDirection: 'column' }}>
          <div>
            <span className="badge badge-new">{word.category}</span>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 8 }}>
            <div style={{ fontSize: 34, fontWeight: 700 }}>{word.word}</div>
            {word.word !== word.reading && (
              <div style={{ fontSize: 16, color: 'var(--text-muted)' }}>{word.reading}</div>
            )}

            {revealed && (
              <div style={{ marginTop: 16, width: '100%' }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--accent-strong)' }}>
                  {word.meaning}
                </div>
                {word.example && (
                  <div
                    style={{
                      marginTop: 14,
                      padding: 12,
                      background: 'var(--surface-2)',
                      borderRadius: 10,
                      fontSize: 14,
                      textAlign: 'left',
                    }}
                  >
                    <div>{word.example}</div>
                    {word.exampleMeaning && (
                      <div style={{ color: 'var(--text-muted)', marginTop: 4 }}>{word.exampleMeaning}</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {!revealed ? (
            <button className="btn btn-primary" onClick={() => setRevealed(true)}>
              뜻 보기
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleNext}>
              {index === words.length - 1 ? '암기 완료' : '다음 단어'}
            </button>
          )}
        </div>
      </div>
    )
  }

  if (phase === 'recall') {
    const items = words.map((w) => ({ word: w, card: data.cards[w.id] })).filter((x) => x.card)

    return (
      <div>
        <div className="page-header">
          <h1>Day {day} 백지 복습</h1>
          <p>방금 외운 단어를 빈 입력창에 바로 확인해봐요</p>
        </div>
        <RecallSession
          items={items}
          onSubmitReview={submitReview}
          onComplete={() => {
            markDayComplete(day)
            setPhase('done')
          }}
        />
      </div>
    )
  }

  // phase === 'done'
  return (
    <div className="empty-state">
      <span className="emoji">🎉</span>
      <h2>Day {day} 완료!</h2>
      <p>암기와 백지 복습을 모두 마쳤어요.</p>
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
