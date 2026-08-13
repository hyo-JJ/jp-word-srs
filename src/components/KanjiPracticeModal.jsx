import { useState } from 'react'
import KanjiStrokeTrace from './KanjiStrokeTrace'
import { extractKanjiChars } from '../utils/kanjiTrace'

// 단어에 포함된 한자를 하나씩(여러 글자면 순서대로) 획순 연습하는 바텀시트 모달.
export default function KanjiPracticeModal({ word, onClose }) {
  const chars = extractKanjiChars(word.word)
  const [index, setIndex] = useState(0)

  if (chars.length === 0) return null

  function handleDone() {
    if (index < chars.length - 1) {
      setIndex((i) => i + 1)
    } else {
      onClose()
    }
  }

  return (
    <div className="kanji-modal-backdrop" onClick={onClose}>
      <div className="kanji-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="kanji-modal-header">
          <div>
            <span className="kanji-modal-char">{chars[index]}</span>
            <span className="kanji-modal-word">{word.word} · {word.meaning}</span>
          </div>
          <button className="kanji-modal-close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        {chars.length > 1 && (
          <div className="kanji-modal-tabs">
            {chars.map((c, i) => (
              <button
                key={c}
                className={`kanji-modal-tab ${i === index ? 'is-active' : ''}`}
                onClick={() => setIndex(i)}
              >
                {c}
              </button>
            ))}
          </div>
        )}
        <KanjiStrokeTrace key={chars[index]} char={chars[index]} onDone={handleDone} />
      </div>
    </div>
  )
}
