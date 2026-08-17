import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store/AppDataContext'
import WrongPoolReview from '../components/WrongPoolReview'
import BackButton from '../components/BackButton'

export default function WrongPool() {
  const { wrongPoolQueue, submitWrongPoolAnswer } = useApp()
  const [round, setRound] = useState(0)

  if (wrongPoolQueue.length === 0) {
    return (
      <div>
        <div className="page-header">
          <BackButton />
          <h1>오답노트</h1>
          <p>오답풀과 재복습 대상 단어를 직접 타이핑해서 다시 확인해요</p>
        </div>
        <div className="empty-state">
          <span className="emoji">✨</span>
          <h2>오답노트가 비어 있어요</h2>
          <p>Day 학습에서 틀린 단어가 여기 쌓이고, 완전암기한 단어는 1~2주 뒤 가끔 재복습으로 돌아와요.</p>
          <Link to="/learn" className="btn btn-primary" style={{ marginTop: 20 }}>
            학습 커리큘럼으로
          </Link>
        </div>
      </div>
    )
  }

  const item = wrongPoolQueue[0]

  return (
    <div>
      <div className="page-header">
        <BackButton />
        <h1>오답노트</h1>
        <p>남은 {wrongPoolQueue.length}개 · 연속 3번 정답이면 완전암기 처리돼요</p>
      </div>
      <WrongPoolReview
        key={`${item.word.id}-${round}`}
        item={item}
        onAnswer={(wordId, correct) => {
          submitWrongPoolAnswer(wordId, correct)
          setRound((r) => r + 1)
        }}
      />
    </div>
  )
}
