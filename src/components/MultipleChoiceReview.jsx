import { useMemo, useState } from 'react'
import { WORDS } from '../data/words'
import { MASTER_STREAK } from '../srs/mastery'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildChoices(word) {
  const pool = WORDS.filter((w) => w.id !== word.id && w.level === word.level)
  const distractors = shuffle(pool)
    .slice(0, 3)
    .map((w) => w.meaning)
  return shuffle([word.meaning, ...distractors])
}

// 오답풀/재복습 큐의 문항 하나를 객관식(4지선다)으로 출제. 문제가 바뀔 때마다 부모가
// key={word.id}로 리마운트시켜 선택 상태를 초기화하는 것을 전제로 한다.
export default function MultipleChoiceReview({ item, onAnswer }) {
  const { word, card } = item
  const isRecheck = card.status === 'mastered'
  const choices = useMemo(() => buildChoices(word), [word])
  const [selected, setSelected] = useState(null)

  function handlePick(choice) {
    if (selected) return
    setSelected(choice)
    const correct = choice === word.meaning
    setTimeout(() => onAnswer(word.id, correct), 550)
  }

  return (
    <div className="card">
      <span
        className={`badge ${isRecheck ? 'badge-mastered' : 'badge-wrong'}`}
        style={{ marginBottom: 10, display: 'inline-block' }}
      >
        {isRecheck ? '재복습' : '오답노트'}
      </span>

      <div style={{ textAlign: 'center', padding: '18px 0' }}>
        <div style={{ fontSize: 30, fontWeight: 700 }}>{word.word}</div>
        {word.word !== word.reading && (
          <div style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 4 }}>{word.reading}</div>
        )}
      </div>

      <div className="mc-options">
        {choices.map((choice) => {
          let cls = 'mc-option'
          if (selected) {
            if (choice === word.meaning) cls += ' correct'
            else if (choice === selected) cls += ' wrong'
          }
          return (
            <button key={choice} className={cls} onClick={() => handlePick(choice)} disabled={!!selected}>
              {choice}
            </button>
          )
        })}
      </div>

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
