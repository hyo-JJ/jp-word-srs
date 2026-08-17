import { useNavigate } from 'react-router-dom'

export default function BackButton() {
  const navigate = useNavigate()
  return (
    <button type="button" className="back-btn" onClick={() => navigate(-1)}>
      ← 뒤로가기
    </button>
  )
}
