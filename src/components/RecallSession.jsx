import { useState } from 'react'
import { isAutoCorrect, isAutoCorrectAny, textAlternatives } from '../utils/similarity'
import WordIcon from './WordIcon'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const MODE_LABEL = {
  mode1: '모드1 · 일본어 → 히라가나+뜻',
  mode2: '모드2 · 뜻 → 일본어',
}

// 빈 입력창에 답을 적는 백지 복습 세션(공용). mode='mode1'(한자/단어 제시 → 히라가나+뜻 입력)
// 또는 mode='mode2'(뜻 제시 → 일본어 입력)로 방향을 고정해 Day 상세 화면에서 순차 진행한다.
// 채점은 전부 자동(유사도 기반, 유사어 여러 개 중 하나만 맞아도 정답)이며 수동으로 정답/오답을
// 뒤집을 수 있는 버튼은 없다 — "다음"으로만 다음 문제로 넘어간다.
export default function RecallSession({ items, mode, onAnswer, onComplete }) {
  const [queue, setQueue] = useState(() => shuffle(items))
  const [phase, setPhase] = useState('answering') // 'answering' | 'revealed'
  const [readingInput, setReadingInput] = useState('')
  const [meaningInput, setMeaningInput] = useState('')
  const [autoResult, setAutoResult] = useState(null)
  const [session, setSession] = useState({ total: 0, correct: 0, wrongWordIds: [] })

  if (queue.length === 0) {
    return null
  }

  const { word } = queue[0]
  const hasKanji = word.word !== word.reading

  function handleSubmit(e) {
    e.preventDefault()
    let correct
    if (mode === 'mode1') {
      const readingOk = !hasKanji || isAutoCorrect(readingInput, word.reading)
      const meaningOk = isAutoCorrectAny(meaningInput, textAlternatives(word.meaning))
      correct = readingOk && meaningOk
      setAutoResult({ correct, readingOk, meaningOk })
    } else if (hasKanji) {
      const wordOk = isAutoCorrectAny(meaningInput, textAlternatives(word.word))
      const readOk = isAutoCorrectAny(readingInput, textAlternatives(word.reading))
      correct = wordOk && readOk
      setAutoResult({ correct, wordOk, readOk })
    } else {
      const ok = isAutoCorrectAny(readingInput, textAlternatives(word.reading))
      correct = ok
      setAutoResult({ correct, ok })
    }
    setPhase('revealed')
  }

  function advance() {
    const finalCorrect = autoResult.correct
    onAnswer(word.id, finalCorrect)
    const nextSession = {
      total: session.total + 1,
      correct: session.correct + (finalCorrect ? 1 : 0),
      wrongWordIds: finalCorrect ? session.wrongWordIds : [...session.wrongWordIds, word.id],
    }
    setSession(nextSession)

    setQueue((prev) => {
      const rest = prev.slice(1)
      if (rest.length === 0) {
        onComplete(nextSession)
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
          {MODE_LABEL[mode]}
        </span>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            textAlign: 'center',
            padding: '20px 0',
          }}
        >
          <WordIcon word={word} size={44} photoSize={44} inline />
          <span style={{ fontSize: mode === 'mode1' ? 32 : 22, fontWeight: 700 }}>
            {mode === 'mode1' ? word.word : word.meaning}
          </span>
        </div>

        {phase === 'answering' && (
          <form onSubmit={handleSubmit}>
            {mode === 'mode1' ? (
              <>
                {hasKanji && (
                  <input
                    className="text-input"
                    placeholder="읽기 (かな)"
                    value={readingInput}
                    onChange={(e) => setReadingInput(e.target.value)}
                    autoFocus
                    style={{ marginBottom: 8 }}
                  />
                )}
                <input
                  className="text-input"
                  placeholder="뜻"
                  value={meaningInput}
                  onChange={(e) => setMeaningInput(e.target.value)}
                  autoFocus={!hasKanji}
                />
              </>
            ) : hasKanji ? (
              <>
                <input
                  className="text-input"
                  placeholder="한자/단어"
                  value={meaningInput}
                  onChange={(e) => setMeaningInput(e.target.value)}
                  autoFocus
                  style={{ marginBottom: 8 }}
                />
                <input
                  className="text-input"
                  placeholder="읽기 (かな)"
                  value={readingInput}
                  onChange={(e) => setReadingInput(e.target.value)}
                />
              </>
            ) : (
              <input
                className="text-input"
                placeholder="히라가나로 입력"
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
              {autoResult.correct ? '정답이에요' : '오답이에요'}
            </div>

            <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: 12, fontSize: 14 }}>
              <div>
                <strong>{word.word}</strong> ({word.reading})
              </div>
              <div style={{ color: 'var(--text-muted)' }}>{word.meaning}</div>
              {word.example && <div style={{ marginTop: 6 }}>{word.example}</div>}
            </div>

            <button className="btn btn-primary" style={{ marginTop: 14, width: '100%' }} onClick={advance}>
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
