import { useState } from 'react'

// 사용자가 직접 작성하는 개인 투두리스트. 항목 추가/체크/삭제만 지원하는
// 단순 체크리스트(SRS 상태와는 무관, events에도 기록하지 않음).
export default function TodoList({ todos, onAdd, onToggle, onDelete }) {
  const [input, setInput] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onAdd(input)
    setInput('')
  }

  return (
    <div className="todo-section">
      <div className="section-title">내 투두리스트</div>

      {todos.length > 0 && (
        <div className="todo-list" style={{ marginBottom: 10 }}>
          {todos.map((t) => (
            <div key={t.id} className={`todo-row ${t.done ? 'done' : ''}`}>
              <button
                type="button"
                className={`todo-checkbox ${t.done ? 'checked' : ''}`}
                onClick={() => onToggle(t.id)}
                aria-label={t.done ? '완료 취소' : '완료 처리'}
              >
                {t.done && '✓'}
              </button>
              <span className="todo-text">{t.text}</span>
              <button className="todo-delete" onClick={() => onDelete(t.id)} aria-label="삭제">
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <form className="todo-add-row" onSubmit={handleSubmit}>
        <input
          className="text-input"
          placeholder="할 일을 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          추가
        </button>
      </form>
    </div>
  )
}
