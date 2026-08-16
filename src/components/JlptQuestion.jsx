import { useState } from 'react'

const TYPE_LABEL = {
  'kanji-reading': '읽기를 고르세요',
  writing: '알맞은 단어를 고르세요',
  meaning: '뜻을 고르세요',
  grammar: '( )에 들어갈 말을 고르세요',
  reading: '질문에 맞는 답을 고르세요',
}

// JLPT 모의고사 문항 하나(4지선다)를 출제. 문제가 바뀔 때마다 부모가
// key={question.id}로 리마운트시켜 선택 상태를 초기화하는 것을 전제로 한다.
export default function JlptQuestion({ question, onAnswer }) {
  const [selected, setSelected] = useState(null)

  function handlePick(choice) {
    if (selected) return
    setSelected(choice)
    const correct = choice === question.answer
    setTimeout(() => onAnswer(correct), 550)
  }

  return (
    <div className="card">
      <span className="badge badge-learning" style={{ marginBottom: 10, display: 'inline-block' }}>
        {TYPE_LABEL[question.type]}
      </span>

      {question.type === 'reading' && <p className="jlpt-passage">{question.passage}</p>}

      <div style={{ textAlign: 'center', padding: '18px 0' }}>
        {question.type === 'grammar' ? (
          <div className="jlpt-grammar-sentence">
            {question.prompt.split('___').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <span className="jlpt-blank">＿＿＿</span>}
              </span>
            ))}
          </div>
        ) : (
          <>
            <div style={{ fontSize: question.type === 'reading' ? 16 : 30, fontWeight: 700 }}>{question.prompt}</div>
            {question.sub && <div style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 4 }}>{question.sub}</div>}
          </>
        )}
      </div>

      <div className="mc-options">
        {question.choices.map((choice) => {
          let cls = 'mc-option'
          if (selected) {
            if (choice === question.answer) cls += ' correct'
            else if (choice === selected) cls += ' wrong'
          }
          return (
            <button key={choice} className={cls} onClick={() => handlePick(choice)} disabled={!!selected}>
              {choice}
            </button>
          )
        })}
      </div>
    </div>
  )
}
