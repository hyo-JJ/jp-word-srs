import { getWordIconEntry } from '../data/wordIconMap'

// 단어 뜻 옆에 보여주는 연상 이미지. 매핑이 없는 단어(동사/조사 등 추상적인 단어)는
// 아무것도 렌더링하지 않고 조용히 생략한다 — 전체 단어의 일부만 아이콘이 채워진 상태를 전제로 한다.
export default function WordIcon({ word, size = 72 }) {
  const entry = getWordIconEntry(word)
  if (!entry) return null

  const { Icon, props } = entry
  return (
    <div className="word-icon" style={{ width: size, height: size }}>
      <Icon size={size - 16} {...props} />
    </div>
  )
}
