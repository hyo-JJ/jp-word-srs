import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../store/AuthContext'

const ROLE_LABEL = { admin: '관리자', mentor: '멘토', mentee: '멘티' }

export default function AdminMembers() {
  const { user, signOut } = useAuth()
  const [members, setMembers] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    supabase
      .from('profiles')
      .select('id, email, role, created_at')
      .order('created_at', { ascending: true })
      .then(({ data, error: err }) => {
        if (cancelled) return
        if (err) setError(err.message)
        else setMembers(data)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <div className="page-header">
        <h1>관리자 모드</h1>
      </div>

      <div className="section-title">회원 목록 {members ? `(${members.length})` : ''}</div>

      {error && (
        <div className="card">
          <p style={{ margin: 0, color: 'var(--danger, #e5484d)' }}>불러오기 실패: {error}</p>
        </div>
      )}

      {!error && !members && (
        <div className="card">
          <p style={{ margin: 0 }}>불러오는 중...</p>
        </div>
      )}

      {members?.map((m) => (
        <div className="card" key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600 }}>{m.email}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              가입일 {new Date(m.created_at).toLocaleDateString('ko-KR')}
            </div>
          </div>
          <span className="badge badge-learning">{ROLE_LABEL[m.role] ?? m.role}</span>
        </div>
      ))}

      <div className="section-title">설정</div>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>{user?.email}로 로그인 중 (관리자)</p>
        <button className="btn btn-ghost" onClick={signOut}>
          로그아웃
        </button>
      </div>
    </div>
  )
}
