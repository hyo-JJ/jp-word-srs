import { useState } from 'react'
import { useAuth } from '../store/AuthContext'

export default function Auth() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setNotice('')
    setSubmitting(true)
    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password)
        if (error) throw error
      } else {
        const { data, error } = await signUp(email, password)
        if (error) throw error
        if (data.session === null) {
          setNotice('가입 확인 이메일을 보냈어요. 메일함에서 링크를 눌러 인증을 완료해주세요.')
        }
      }
    } catch (err) {
      setError(err.message || '문제가 발생했어요. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="page-header">
        <h1>{mode === 'signin' ? '로그인' : '회원가입'}</h1>
        <p>일본어 단어 학습을 계속하려면 로그인해주세요.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            className="text-input"
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <input
            className="text-input"
            type="password"
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            minLength={6}
            required
          />
          {error && <p style={{ color: 'var(--danger)', fontSize: 13, margin: 0 }}>{error}</p>}
          {notice && <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>{notice}</p>}
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? '처리 중...' : mode === 'signin' ? '로그인' : '회원가입'}
          </button>
        </form>
      </div>

      <button
        className="btn btn-ghost"
        type="button"
        onClick={() => {
          setMode(mode === 'signin' ? 'signup' : 'signin')
          setError('')
          setNotice('')
        }}
      >
        {mode === 'signin' ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
      </button>
    </div>
  )
}
