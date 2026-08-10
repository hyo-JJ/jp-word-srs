import { useState } from 'react'
import { isAutoCorrect } from '../utils/similarity'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function randomDirection() {
  return Math.random() < 0.5 ? 'jp2kr' : 'kr2jp'
}

function buildQueue(items) {
  return shuffle(
    items.map(({ word, card }) => ({
      key: `${word.id}-${Math.random()}`,
      word,
      card,
      direction: randomDirection(),
    }))
  )
}

// 빈 입력창에 답을 적는 백지 복습 세션(공용). 전체 SRS 복습(Review)과
// Day별 백지 복습(DayDetail)에서 동일한 채점/큐 로직을 공유하기 위해 분리함.
export default function RecallSession({ items, onSubmitReview, onComplete, emptyState }) {
  const [queue, setQueue] = useState(() => buildQueue(items))
  const [phase, setPhase] = useState('answering') // 'answering' | 'revealed'
  const [readingInput, setReadingInput] = useState('')
  const [meaningInput, setMeaningInput] = useState('')
  const [autoResult, setAutoResult] = useState(null)
  const [session, setSession] = useState({ total: 0, correct: 0 })

  if (queue.length === 0) {
    return emptyState ?? null
  }

  const item = queue[0]
  const { word, card, direction } = item
  const showEaseButtons = phase === 'revealed' && autoResult?.correct && card.repetitions >= 4

  function handleSubmit(e) {
    e.preventDefault()
    let correct
    if (direction === 'jp2kr') {
      const readingOk = isAutoCorrect(readingInput, word.reading)
      const meaningOk = isAutoCorrect(meaningInput, word.meaning)
      correct = readingOk && meaningOk
      setAutoResult({ correct, readingOk, meaningOk })
    } else {
      const ok = isAutoCorrect(readingInput, word.reading) || isAutoCorrect(readingInput, word.word)
      correct = ok
      setAutoResult({ correct, ok })
    }
    setPhase('revealed')
  }

  function finalizeAndAdvance(finalCorrect, difficulty = 'normal') {
    const updated = onSubmitReview(word.id, finalCorrect, difficulty)
    const nextSession = { total: session.total + 1, correct: session.correct + (finalCorrect ? 1 : 0) }
    setSession(nextSession)

    setQueue((prev) => {
      const rest = prev.slice(1)
      if (updated?.immediateRequeue) {
        const requeueItem = { ...item, key: `${word.id}-${Math.random()}`, direction: randomDirection() }
        const insertAt = Math.min(rest.length, 2 + Math.floor(Math.random() * 3))
        return [...rest.slice(0, insertAt), requeueItem, ...rest.slice(insertAt)]
      }
      if (rest.length === 0) {
        onComplete?.(nextSession)
      }
      return rest
    })

    setPhase('answering')
    setReadingInput('')
    setMeaningInput('')
    setAutoResult(null)
  }

  return (
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 10 }}>
        남은 {queue.length}개 · 이번 세션 정답 {session.correct}/{session.total}
      </p>

      <div className="card">
        <span className="badge badge-learning" style={{ marginBottom: 10, display: 'inline-block' }}>
          {direction === 'jp2kr' ? '일본어 → 뜻' : '뜻 → 일본어'}
        </span>

        <div style={{ textAlign: 'center', padding: '20px 0', fontSize: direction === 'jp2kr' ? 32 : 22, fontWeight: 700 }}>
          {direction === 'jp2kr' ? word.word : word.meaning}
        </div>

        {phase === 'answering' && (
          <form onSubmit={handleSubmit}>
            {direction === 'jp2kr' ? (
              <>
                <input
                  className="text-input"
                  placeholder="읽기 (かな)"
                  value={readingInput}
                  onChange={(e) => setReadingInput(e.target.value)}
                  autoFocus
                  style={{ marginBottom: 8 }}
                />
                <input
                  className="text-input"
                  placeholder="뜻"
                  value={meaningInput}
                  onChange={(e) => setMeaningInput(e.target.value)}
                />
              </>
            ) : (
              <input
                className="text-input"
                placeholder="일본어 단어 (읽기로 입력 가능)"
                value={readingInput}
                onChange={(e) => setReadingInput(e.target.value)}
                autoFocus
              />
            )}
            <button type="submit" className="btn btn-primary" style={{ marginTop: 12 }}>
              정답 확인
            </button>
          </form>
        )}

        {phase === 'revealed' && (
          <div>
            <div
              style={{
                padding: 12,
                borderRadius: 10,
                background: autoResult.correct ? 'var(--success-bg)' : 'var(--danger-bg)',
                color: autoResult.correct ? 'var(--success)' : 'var(--danger)',
                fontWeight: 700,
                textAlign: 'center',
                marginBottom: 12,
              }}
            >
              {autoResult.correct ? '정답으로 채점되었어요' : '오답으로 채점되었어요'}
            </div>

            <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: 12, fontSize: 14 }}>
              <div>
                <strong>{word.word}</strong> ({word.reading})
              </div>
              <div style={{ color: 'var(--text-muted)' }}>{word.meaning}</div>
              {word.example && <div style={{ marginTop: 6 }}>{word.example}</div>}
            </div>

            {showEaseButtons ? (
              <div style={{ marginTop: 14 }}>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>체감 난이도는요?</p>
                <div className="btn-row">
                  <button className="btn" onClick={() => finalizeAndAdvance(true, 'hard')}>
                    어려웠음
                  </button>
                  <button className="btn" onClick={() => finalizeAndAdvance(true, 'normal')}>
                    보통
                  </button>
                  <button className="btn btn-success" onClick={() => finalizeAndAdvance(true, 'easy')}>
                    쉬웠음
                  </button>
                </div>
              </div>
            ) : (
              <div className="btn-row" style={{ marginTop: 14 }}>
                <button className="btn btn-danger" onClick={() => finalizeAndAdvance(false)}>
                  오답으로 처리
                </button>
                <button className="btn btn-success" onClick={() => finalizeAndAdvance(true)}>
                  정답으로 처리
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
