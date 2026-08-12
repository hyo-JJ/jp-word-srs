import { useEffect, useState } from 'react'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// exampleChunks를 원래 순서와 다르게 섞는다 (2개짜리 문장은 뒤집기만 해도 충분)
function shuffledChunks(chunks) {
  if (chunks.length < 2) return chunks.map((c, i) => ({ text: c, key: i }))
  let order
  do {
    order = shuffle(chunks.map((_, i) => i))
  } while (order.every((v, i) => v === i))
  return order.map((i) => ({ text: chunks[i], key: i }))
}

// 예문 어순 맞추기 게임 한 문제: 청크를 순서대로 탭해서 원문을 복원한다
export default function SentenceArrange({ items, onAnswer, onComplete }) {
  const [queue, setQueue] = useState(items)
  const [tray, setTray] = useState(() => shuffledChunks(items[0]?.word.exampleChunks || []))
  const [answer, setAnswer] = useState([])
  const [phase, setPhase] = useState('answering') // 'answering' | 'revealed'
  const [result, setResult] = useState(null)
  const [session, setSession] = useState({ total: 0, correct: 0 })

  useEffect(() => {
    setTray(shuffledChunks(queue[0]?.word.exampleChunks || []))
    setAnswer([])
    setPhase('answering')
    setResult(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue[0]?.word.id])

  if (queue.length === 0) return null

  const { word } = queue[0]

  function pickChunk(chunk) {
    if (phase !== 'answering') return
    setTray((prev) => prev.filter((c) => c.key !== chunk.key))
    setAnswer((prev) => {
      const next = [...prev, chunk]
      if (next.length === word.exampleChunks.length) {
        const correct = next.every((c, idx) => c.key === idx)
        setResult(correct)
        setPhase('revealed')
      }
      return next
    })
  }

  function undoChunk(chunk) {
    if (phase !== 'answering') return
    setAnswer((prev) => prev.filter((c) => c.key !== chunk.key))
    setTray((prev) => [...prev, chunk])
  }

  function advance() {
    onAnswer(word.id, result)
    const nextSession = { total: session.total + 1, correct: session.correct + (result ? 1 : 0) }
    setSession(nextSession)
    setQueue((prev) => {
      const rest = prev.slice(1)
      if (rest.length === 0) onComplete(nextSession)
      return rest
    })
  }

  return (
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 10 }}>
        남은 {queue.length}개 · 이번 세션 정답 {session.correct}/{session.total}
      </p>

      <div className="card">
        <span className="badge badge-learning" style={{ marginBottom: 10, display: 'inline-block' }}>
          문장게임 · 뜻에 맞게 순서 맞추기
        </span>

        <div style={{ textAlign: 'center', padding: '14px 0', fontSize: 18, fontWeight: 700 }}>
          {word.exampleMeaning}
        </div>

        <div className="sentence-answer-row">
          {answer.length === 0 && <span className="sentence-placeholder">여기에 순서대로 탭해서 채워보세요</span>}
          {answer.map((c) => (
            <button
              key={c.key}
              className="sentence-chunk placed"
              onClick={() => undoChunk(c)}
              disabled={phase !== 'answering'}
            >
              {c.text}
            </button>
          ))}
        </div>

        <div className="sentence-tray">
          {tray.map((c) => (
            <button key={c.key} className="sentence-chunk" onClick={() => pickChunk(c)}>
              {c.text}
            </button>
          ))}
        </div>

        {phase === 'revealed' && (
          <div style={{ marginTop: 14 }}>
            <div
              style={{
                padding: 12,
                borderRadius: 10,
                background: result ? 'var(--success-bg)' : 'var(--danger-bg)',
                color: result ? 'var(--success)' : 'var(--danger)',
                fontWeight: 700,
                textAlign: 'center',
                marginBottom: 12,
              }}
            >
              {result ? '정답이에요' : '오답이에요'}
            </div>

            <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: 12, fontSize: 14 }}>
              <div style={{ fontWeight: 700 }}>{word.example}</div>
              <div style={{ color: 'var(--text-muted)', marginTop: 4 }}>{word.exampleMeaning}</div>
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
