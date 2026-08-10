import { Link } from 'react-router-dom'
import { useApp } from '../store/AppDataContext'
import RecallSession from '../components/RecallSession'

export default function Review() {
  const { dueReviewCards, submitReview } = useApp()

  const emptyState = (
    <div className="empty-state">
      <span className="emoji">✨</span>
      <h2>오늘 복습할 단어가 없어요</h2>
      <p>새 Day를 학습하거나 내일 다시 확인해보세요.</p>
      <Link to="/learn" className="btn btn-primary" style={{ marginTop: 20 }}>
        학습 커리큘럼으로
      </Link>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <h1>백지 복습</h1>
        <p>오늘 복습 예정 단어를 빈 입력창에 답해보세요</p>
      </div>
      <RecallSession items={dueReviewCards} onSubmitReview={submitReview} emptyState={emptyState} />
    </div>
  )
}
