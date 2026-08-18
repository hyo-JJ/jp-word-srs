import { getWordIconEntry } from '../data/wordIconMap'
import { getWordPhotoUrl } from '../data/wordPhotoMap'

// 단어 뜻 옆에 보여주는 연상 이미지. 실사 누끼 사진이 있으면 그걸 우선 쓰고,
// 없으면 손그린 SVG 아이콘으로 대체한다. 둘 다 없는 단어(동사/조사 등 추상적인 단어)는
// 아무것도 렌더링하지 않고 조용히 생략한다 — 전체 단어의 일부만 채워진 상태를 전제로 한다.
export default function WordIcon({ word, size = 72, photoSize = 180 }) {
  const photoUrl = getWordPhotoUrl(word)
  if (photoUrl) {
    return (
      <div className="word-icon-photo" style={{ width: photoSize, height: photoSize }}>
        <img src={photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    )
  }

  const entry = getWordIconEntry(word)
  if (!entry) return null

  const { Icon, props } = entry
  return (
    <div className="word-icon" style={{ width: size, height: size }}>
      <Icon size={size - 16} {...props} />
    </div>
  )
}
