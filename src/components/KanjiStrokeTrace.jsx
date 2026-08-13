import { useRef, useState } from 'react'
import kanjiStrokes from '../data/kanjiStrokes.json'
import { scoreStroke } from '../utils/kanjiTrace'

const VIEWBOX = 109

// 한자 한 글자를 획순대로 따라 그리며 연습하는 컴포넌트.
// KanjiVG(CC BY-SA 3.0) 데이터를 오프라인으로 추출해 src/data/kanjiStrokes.json에 저장해두고 사용한다.
export default function KanjiStrokeTrace({ char, onDone }) {
  const data = kanjiStrokes[char]
  const [strokeIndex, setStrokeIndex] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [flash, setFlash] = useState(null) // 'wrong' | 'correct' | null
  const [showHint, setShowHint] = useState(false)
  const [hintKey, setHintKey] = useState(0)
  const svgRef = useRef(null)
  const drawing = useRef(false)
  const userPoints = useRef([])
  const [livePath, setLivePath] = useState('')

  const total = data?.strokes.length ?? 0
  const done = strokeIndex >= total

  function toViewboxPoint(clientX, clientY) {
    const rect = svgRef.current.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * VIEWBOX
    const y = ((clientY - rect.top) / rect.height) * VIEWBOX
    return [x, y]
  }

  function handlePointerDown(e) {
    if (done || flash) return
    drawing.current = true
    userPoints.current = [toViewboxPoint(e.clientX, e.clientY)]
    setLivePath(pointsToPath(userPoints.current))
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  function handlePointerMove(e) {
    if (!drawing.current) return
    userPoints.current.push(toViewboxPoint(e.clientX, e.clientY))
    setLivePath(pointsToPath(userPoints.current))
  }

  function handlePointerUp() {
    if (!drawing.current) return
    drawing.current = false
    const stroke = data.strokes[strokeIndex]
    const result = scoreStroke(userPoints.current, stroke.points)
    userPoints.current = []

    if (result.correct) {
      setFlash('correct')
      setTimeout(() => {
        setFlash(null)
        setLivePath('')
        setMistakes(0)
        setShowHint(false)
        setStrokeIndex((i) => i + 1)
      }, 260)
    } else {
      setFlash('wrong')
      const nextMistakes = mistakes + 1
      setMistakes(nextMistakes)
      setTimeout(() => {
        setFlash(null)
        setLivePath('')
        if (nextMistakes >= 2) {
          setShowHint(true)
          setHintKey((k) => k + 1)
        }
      }, 320)
    }
  }

  function replayHint() {
    setShowHint(true)
    setHintKey((k) => k + 1)
  }

  if (!data) {
    return (
      <div className="kanji-trace-missing">
        <p>이 글자의 획순 데이터가 아직 없어요.</p>
        <button className="btn btn-secondary" onClick={onDone}>닫기</button>
      </div>
    )
  }

  return (
    <div className="kanji-trace">
      <div className="kanji-trace-progress">
        획 {Math.min(strokeIndex + 1, total)} / {total}
      </div>

      <div
        ref={svgRef}
        className={`kanji-trace-canvas ${flash === 'wrong' ? 'is-wrong' : ''} ${flash === 'correct' ? 'is-correct' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <svg viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} width="100%" height="100%">
          {/* 米자 가이드선 */}
          <line x1="0" y1={VIEWBOX / 2} x2={VIEWBOX} y2={VIEWBOX / 2} className="kanji-guide-line" />
          <line x1={VIEWBOX / 2} y1="0" x2={VIEWBOX / 2} y2={VIEWBOX} className="kanji-guide-line" />
          <line x1="0" y1="0" x2={VIEWBOX} y2={VIEWBOX} className="kanji-guide-line" />
          <line x1={VIEWBOX} y1="0" x2="0" y2={VIEWBOX} className="kanji-guide-line" />

          {/* 아직 안 그린 획: 아주 옅은 밑그림 */}
          {data.strokes.slice(strokeIndex + (done ? 0 : 1)).map((s, i) => (
            <path key={`ghost-${i}`} d={s.d} className="kanji-stroke-ghost" />
          ))}

          {/* 이미 완료한 획 */}
          {data.strokes.slice(0, strokeIndex).map((s, i) => (
            <path key={`done-${i}`} d={s.d} className="kanji-stroke-done" />
          ))}

          {/* 지금 그려야 할 획 (옅은 안내선) */}
          {!done && (
            <path d={data.strokes[strokeIndex].d} className="kanji-stroke-target" />
          )}

          {/* 힌트: 정답 획 애니메이션 재생 */}
          {!done && showHint && (
            <path
              key={hintKey}
              d={data.strokes[strokeIndex].d}
              pathLength="1"
              className="kanji-stroke-hint"
            />
          )}

          {/* 사용자가 지금 그리고 있는 선 */}
          {livePath && <path d={livePath} className="kanji-stroke-live" />}
        </svg>
      </div>

      <div className="kanji-trace-controls">
        {!done ? (
          <button className="btn btn-secondary" onClick={replayHint}>정답 획 보기</button>
        ) : (
          <div className="kanji-trace-complete">🎉 완성했어요!</div>
        )}
        <button className="btn btn-primary" onClick={onDone}>{done ? '닫기' : '건너뛰기'}</button>
      </div>
      <p className="kanji-trace-credit">획순 데이터: KanjiVG (CC BY-SA 3.0)</p>
    </div>
  )
}

function pointsToPath(points) {
  if (points.length === 0) return ''
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
}
