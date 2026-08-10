import { useMemo, useState } from 'react'
import { WORDS, LEVELS } from '../data/words'
import { useApp } from '../store/AppDataContext'

const STATUS_FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'new', label: '신규' },
  { key: 'learning', label: '학습중' },
  { key: 'wrongPool', label: '오답노트' },
  { key: 'mastered', label: '완전암기' },
]

function statusOf(data, wordId) {
  const card = data.cards[wordId]
  if (!card) return 'new'
  return card.status
}

const STATUS_BADGE = {
  new: { cls: 'badge-new', label: '신규' },
  learning: { cls: 'badge-learning', label: '학습중' },
  wrongPool: { cls: 'badge-wrong', label: '오답노트' },
  mastered: { cls: 'badge-mastered', label: '완전암기' },
}

export default function WordList() {
  const { data } = useApp()
  const [level, setLevel] = useState(LEVELS[0])
  const [status, setStatus] = useState('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return WORDS.filter((w) => w.level === level)
      .filter((w) => status === 'all' || statusOf(data, w.id) === status)
      .filter((w) => {
        if (!query.trim()) return true
        const q = query.trim().toLowerCase()
        return (
          w.word.toLowerCase().includes(q) ||
          w.reading.toLowerCase().includes(q) ||
          w.meaning.toLowerCase().includes(q)
        )
      })
  }, [data, level, status, query])

  return (
    <div>
      <div className="page-header">
        <h1>단어장</h1>
        <p>총 {WORDS.length}개 단어</p>
      </div>

      <div className="chip-row">
        {LEVELS.map((lv) => (
          <button
            key={lv}
            className={`chip ${level === lv ? 'active' : ''}`}
            onClick={() => setLevel(lv)}
          >
            {lv}
          </button>
        ))}
      </div>

      <div className="chip-row">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            className={`chip ${status === f.key ? 'active' : ''}`}
            onClick={() => setStatus(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <input
        className="text-input"
        placeholder="단어, 읽기, 뜻 검색"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginBottom: 14 }}
      />

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <span className="emoji">🔍</span>
            <p>조건에 맞는 단어가 없어요</p>
          </div>
        ) : (
          filtered.map((w) => {
            const st = statusOf(data, w.id)
            const badge = STATUS_BADGE[st]
            return (
              <div className="word-row" key={w.id}>
                <div className="main">
                  <div className="word">
                    {w.word}
                    {w.word !== w.reading && <span className="reading"> · {w.reading}</span>}
                  </div>
                  <div className="meaning">{w.meaning}</div>
                </div>
                <span className={`badge ${badge.cls}`}>{badge.label}</span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
