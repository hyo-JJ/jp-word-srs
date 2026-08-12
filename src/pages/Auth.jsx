import { useState } from 'react'
import { useAuth } from '../store/AuthContext'

const USERNAME_PATTERN = /^[a-z0-9_]{4,20}$/i

export default function Auth() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [nickname, setNickname] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setNotice('')

    if (mode === 'signup') {
      if (!USERNAME_PATTERN.test(username)) {
        setError('아이디는 영문/숫자/밑줄 4~20자로 입력해주세요.')
        return
      }
      if (!nickname.trim()) {
        setError('닉네임을 입력해주세요.')
        return
      }
      if (password !== passwordConfirm) {
        setError('비밀번호가 서로 달라요.')
        return
      }
    }

    setSubmitting(true)
    try {
      if (mode === 'signin') {
        const { error } = await signIn(username, password)
        if (error) throw error
      } else {
        const { error } = await signUp(username, nickname.trim(), password)
        if (error) {
          if (error.message?.includes('already registered')) {
            throw new Error('이미 사용 중인 아이디예요.')
          }
          throw error
        }
        setNotice('회원가입 완료! 관리자 승인 후 로그인할 수 있어요.')
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
          {mode === 'signup' && (
            <input
              className="text-input"
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              autoComplete="nickname"
              required
            />
          )}
          <input
            className="text-input"
            type="text"
            placeholder={mode === 'signup' ? '아이디 (영문/숫자/밑줄 4~20자)' : '아이디'}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
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
          {mode === 'signup' && (
            <input
              className="text-input"
              type="password"
              placeholder="비밀번호 확인"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
            />
          )}
          {error && <p style={{ color: 'var(--danger)', fontSize: 13, margin: 0 }}>{error}</p>}
          {notice && <p style={{ color: 'var(--accent-strong)', fontSize: 13, margin: 0, fontWeight: 600 }}>{notice}</p>}
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
