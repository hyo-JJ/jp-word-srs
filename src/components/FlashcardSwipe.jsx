import { useRef, useState } from 'react'

// 플래시카드 한 장: 탭하면 뒤집혀 히라가나+뜻이 보이고, 뒤집힌 뒤 좌우 스와이프(또는 버튼)로
// "아는 단어"/"모르는 단어"를 표시한다. 단어가 바뀔 때마다 부모가 key={word.id}로 리마운트시켜
// 내부 상태(flipped/dragX)를 초기화하는 것을 전제로 한다.
export default function FlashcardSwipe({ word, onDecide }) {
  const [flipped, setFlipped] = useState(false)
  const [dragX, setDragX] = useState(0)
  const dragging = useRef(false)
  const startX = useRef(0)

  function decide(known) {
    setDragX(known ? 480 : -480)
    setTimeout(() => onDecide(known), 120)
  }

  function handlePointerDown(e) {
    if (!flipped) return
    dragging.current = true
    startX.current = e.clientX
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  function handlePointerMove(e) {
    if (!dragging.current) return
    setDragX(e.clientX - startX.current)
  }

  function finishDrag() {
    if (!dragging.current) return
    dragging.current = false
    if (dragX > 90) decide(true)
    else if (dragX < -90) decide(false)
    else setDragX(0)
  }

  const rotate = dragX / 18
  const cardStyle =
    dragX !== 0
      ? { transform: `translateX(${dragX}px) rotate(${rotate}deg)`, transition: dragging.current ? 'none' : 'transform 0.25s ease' }
      : undefined

  return (
    <div className="flashcard-stage">
      <div
        className="card flashcard"
        style={cardStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onClick={() => !flipped && setFlipped(true)}
      >
        <div>
          <span className="badge badge-new">{word.category}</span>
        </div>

        <div className="flashcard-face">
          <div className="flashcard-word">{word.word}</div>
          {word.word !== word.reading && <div className="flashcard-reading">{word.reading}</div>}

          {flipped && (
            <>
              <div className="flashcard-meaning">{word.meaning}</div>
              {word.example && (
                <div className="flashcard-example">
                  <div>{word.example}</div>
                  {word.exampleMeaning && <div className="ex-meaning">{word.exampleMeaning}</div>}
                </div>
              )}
            </>
          )}
        </div>

        {!flipped ? (
          <p className="flashcard-hint">탭해서 히라가나·뜻 보기</p>
        ) : (
          <div className="flashcard-know-row">
            <button className="btn btn-dontknow" onClick={(e) => { e.stopPropagation(); decide(false) }}>
              모르는 단어
            </button>
            <button className="btn btn-know" onClick={(e) => { e.stopPropagation(); decide(true) }}>
              아는 단어
            </button>
          </div>
        )}
      </div>
      {flipped && <p className="flashcard-hint">좌우로 스와이프하거나 버튼을 눌러주세요</p>}
    </div>
  )
}
