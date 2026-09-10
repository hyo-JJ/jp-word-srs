import { Link, useNavigate } from 'react-router-dom'

export default function BackButton() {
  const navigate = useNavigate()
  return (
    <div className="header-nav-row">
      <button type="button" className="back-btn" onClick={() => navigate(-1)}>
        ← 뒤로가기
      </button>
      <Link to="/" className="home-btn" aria-label="홈으로">
        🏠
      </Link>
    </div>
  )
}
