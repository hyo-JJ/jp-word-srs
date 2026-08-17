import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppDataContext'
import { WORDS } from '../data/words'
import SentenceArrange from '../components/SentenceArrange'

const ROUND_SIZE = 10

function pickRound() {
  const pool = WORDS.filter((w) => w.exampleChunks && w.exampleChunks.length >= 2)
  const shuffled = [...pool]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, ROUND_SIZE).map((word) => ({ word }))
}

export default function SentenceGame() {
  const navigate = useNavigate()
  const { logSentenceAnswer } = useApp()
  const [round, setRound] = useState(pickRound)
  const [result, setResult] = useState(null)

  if (round.length === 0) {
    return (
      <div className="empty-state">
        <span className="emoji">🧩</span>
        <h2>아직 예문 데이터가 없어요</h2>
        <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate(-1)}>
          뒤로가기
        </button>
      </div>
    )
  }

  if (result) {
    return (
      <div className="empty-state">
        <span className="emoji">🧩</span>
        <h2>문장게임 완료!</h2>
        <p>
          {result.total}문제 중 {result.correct}개 정답 ({Math.round((result.correct / result.total) * 100)}%)
        </p>
        <div className="btn-row" style={{ marginTop: 20 }}>
          <button
            className="btn btn-primary"
            onClick={() => {
              setRound(pickRound())
              setResult(null)
            }}
          >
            다시하기
          </button>
          <button className="btn" onClick={() => navigate(-1)}>
            뒤로가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1>🧩 문장게임</h1>
        <p>뜻을 보고 예문 조각을 순서대로 탭해서 문장을 완성해요</p>
      </div>
      <SentenceArrange
        key={round.map((r) => r.word.id).join('-')}
        items={round}
        onAnswer={(wordId, correct) => logSentenceAnswer(wordId, correct)}
        onComplete={(session) => setResult(session)}
      />
    </div>
  )
}
