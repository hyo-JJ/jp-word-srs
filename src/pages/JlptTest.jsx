import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../store/AppDataContext'
import { buildJlptTest, isBlockUnlocked, JLPT_BLOCKS } from '../utils/jlptTest'
import JlptQuestion from '../components/JlptQuestion'
import BackButton from '../components/BackButton'

export default function JlptTest() {
  const navigate = useNavigate()
  const { block: blockParam } = useParams()
  const block = Number(blockParam)
  const { data, submitJlptTest } = useApp()
  const blockDef = JLPT_BLOCKS.find((b) => b.block === block)
  const unlocked = !!blockDef && isBlockUnlocked(block, data.completedDays)

  const [test, setTest] = useState(() => (unlocked ? buildJlptTest(block) : null))
  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [result, setResult] = useState(null)

  if (!blockDef || !unlocked) {
    return <Navigate to="/games" replace />
  }

  const questions = test.questions
  const current = questions[index]

  function handleAnswer(correct) {
    const nextCorrect = correct ? correctCount + 1 : correctCount
    if (index + 1 >= questions.length) {
      submitJlptTest(block, { correct: nextCorrect, total: questions.length })
      setResult({ correct: nextCorrect, total: questions.length })
    } else {
      setCorrectCount(nextCorrect)
      setIndex(index + 1)
    }
  }

  function restart() {
    setTest(buildJlptTest(block))
    setIndex(0)
    setCorrectCount(0)
    setResult(null)
  }

  if (result) {
    const percent = Math.round((result.correct / result.total) * 100)
    return (
      <div className="empty-state">
        <span className="emoji">🎓</span>
        <h2>{blockDef.block}회 모의고사 완료!</h2>
        <p>
          {result.total}문제 중 {result.correct}개 정답 ({percent}%)
        </p>
        <div className="btn-row" style={{ marginTop: 20 }}>
          <button className="btn btn-primary" onClick={restart}>
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
        <BackButton />
        <h1>🎓 JLPT 모의고사 {blockDef.block}회</h1>
        <p>
          {index + 1} / {questions.length}문제
        </p>
      </div>
      <div className="progress-bar" style={{ marginBottom: 16 }}>
        <div style={{ width: `${(index / questions.length) * 100}%` }} />
      </div>
      <JlptQuestion key={current.id} question={current} onAnswer={handleAnswer} />
    </div>
  )
}
