import { useAuth } from '../store/AuthContext'
import Mascot from '../components/Mascot'

export default function PendingApproval() {
  const { nickname, signOut } = useAuth()

  return (
    <div className="auth-page">
      <div className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
        <Mascot size={72} mood="neutral" />
        <h1 style={{ marginTop: 16, marginBottom: 8 }}>승인 대기 중이에요</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
          {nickname ? `${nickname}님, ` : ''}회원가입이 완료됐어요.
          <br />
          관리자가 승인하면 바로 이용하실 수 있어요.
        </p>
      </div>
      <button className="btn btn-ghost" type="button" onClick={signOut}>
        로그아웃
      </button>
    </div>
  )
}
