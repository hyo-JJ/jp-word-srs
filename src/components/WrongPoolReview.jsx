import { useState } from 'react'
import { isAutoCorrectAny, textAlternatives } from '../utils/similarity'
import { MASTER_STREAK } from '../srs/mastery'
import WordIcon from './WordIcon'

const TYPE_LABEL = {
  meaning: '뜻 입력',
  word: '한자 · 단어 입력',
  reading: '읽기 입력',
}

// 오답풀 단어는 연속 3번 정답이어야 완전암기 처리되는데, 매번 같은 방향(뜻)만
// 물어보면 의미가 없으므로 correctStreak(0~2)에 따라 뜻→한자/단어→읽기 순서로
// 서로 다른 방향을 물어본다. 한자가 없는(히라가나 전용) 단어는 읽기 문제가
// 무의미해지므로 다시 뜻 문제로 대체한다.
function questionTypeForWord(word, round) {
  if (round === 0) return 'meaning'
  if (round === 1) return 'word'
  return word.word !== word.reading ? 'reading' : 'meaning'
}

// 오답노트/재복습 문항 하나를 직접 타이핑으로 채점(유사도 기반 자동채점)한다.
// 재복습(완전암기 후 주기 점검)은 3회 누적 개념이 없어 항상 뜻 문제로 물어본다.
export default function WrongPoolReview({ item, onAnswer }) {
  const { word, card } = item
  const isRecheck = card.status === 'mastered'
  const type = isRecheck ? 'meaning' : questionTypeForWord(word, card.correctStreak)

  const [input, setInput] = useState('')
  const [phase, setPhase] = useState('answering') // 'answering' | 'revealed'
  const [result, setResult] = useState(null)

  const prompt = type === 'word' ? word.meaning : word.word
  const placeholder = type === 'meaning' ? '뜻' : type === 'word' ? '한자 · 단어' : '읽기 (かな)'
  const answerText = type === 'meaning' ? word.meaning : type === 'word' ? word.word : word.reading

  function handleSubmit(e) {
    e.preventDefault()
    const correct = isAutoCorrectAny(input, textAlternatives(answerText))
    setResult({ correct })
    setPhase('revealed')
  }

  function advance() {
    onAnswer(word.id, result.correct)
  }

  return (
    <div className="card">
      <span
        className={`badge ${isRecheck ? 'badge-mastered' : 'badge-wrong'}`}
        style={{ marginBottom: 10, display: 'inline-block' }}
      >
        {isRecheck ? '재복습' : '오답노트'} · {TYPE_LABEL[type]}
      </span>

      <div style={{ textAlign: 'center', padding: '18px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          {type === 'word' && <WordIcon word={word} size={40} photoSize={40} inline />}
          <span style={{ fontSize: type === 'word' ? 20 : 30, fontWeight: 700 }}>{prompt}</span>
        </div>
        {type === 'meaning' && word.word !== word.reading && (
          <div style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 4 }}>{word.reading}</div>
        )}
      </div>

      {phase === 'answering' && (
        <form onSubmit={handleSubmit}>
          <input
            className="text-input"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn btn-primary" style={{ marginTop: 12, width: '100%' }}>
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
              background: result.correct ? 'var(--success-bg)' : 'var(--danger-bg)',
              color: result.correct ? 'var(--success)' : 'var(--danger)',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            {result.correct ? '정답이에요' : '오답이에요'}
          </div>

          <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: 12, fontSize: 14 }}>
            <div>
              <strong>{word.word}</strong> ({word.reading})
            </div>
            <div style={{ color: 'var(--text-muted)' }}>{word.meaning}</div>
          </div>

          <button className="btn btn-primary" style={{ marginTop: 14, width: '100%' }} onClick={advance}>
            다음
          </button>
        </div>
      )}

      {!isRecheck && (
        <div className="streak-dots" style={{ marginTop: 14, justifyContent: 'center', display: 'flex' }}>
          {Array.from({ length: MASTER_STREAK }).map((_, i) => (
            <span key={i} className={`dot ${i < card.correctStreak ? 'on' : ''}`} />
          ))}
        </div>
      )}
    </div>
  )
}
