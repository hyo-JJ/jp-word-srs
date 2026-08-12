import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../store/AuthContext'

const ROLE_LABEL = { admin: '관리자', mentor: '멘토', mentee: '멘티' }

function memberName(m) {
  return m.nickname || m.username || m.email
}

export default function AdminMembers() {
  const { user, signOut } = useAuth()
  const [members, setMembers] = useState(null)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  function load() {
    return supabase
      .from('profiles')
      .select('id, email, username, nickname, role, approved, created_at')
      .order('created_at', { ascending: true })
      .then(({ data, error: err }) => {
        if (err) setError(err.message)
        else setMembers(data)
      })
  }

  useEffect(() => {
    load()
  }, [])

  async function approve(id) {
    setBusyId(id)
    const { error: err } = await supabase.from('profiles').update({ approved: true }).eq('id', id)
    setBusyId(null)
    if (err) {
      alert('승인 실패: ' + err.message)
      return
    }
    load()
  }

  const pending = members?.filter((m) => !m.approved) ?? []
  const approved = members?.filter((m) => m.approved) ?? []

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <h1 style={{ whiteSpace: 'nowrap' }}>관리자 모드</h1>
        <button
          className="btn btn-ghost"
          style={{ padding: '6px 12px', fontSize: 13, flexShrink: 0 }}
          onClick={signOut}
        >
          로그아웃
        </button>
      </div>

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

      {members && (
        <>
          <div className="section-title">승인 대기 ({pending.length})</div>
          {pending.length === 0 && (
            <div className="card">
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>대기 중인 가입 신청이 없어요.</p>
            </div>
          )}
          {pending.map((m) => (
            <div className="card" key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{memberName(m)}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  아이디 {m.username ?? '-'} · 가입일 {new Date(m.created_at).toLocaleDateString('ko-KR')}
                </div>
              </div>
              <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: 13 }} disabled={busyId === m.id} onClick={() => approve(m.id)}>
                승인
              </button>
            </div>
          ))}

          <div className="section-title">회원 목록 ({approved.length})</div>
          {approved.map((m) => (
            <div className="card" key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{memberName(m)}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  가입일 {new Date(m.created_at).toLocaleDateString('ko-KR')}
                </div>
              </div>
              <span className="badge badge-learning">{ROLE_LABEL[m.role] ?? m.role}</span>
            </div>
          ))}
        </>
      )}

      <div className="section-title">설정</div>
      <div className="card">
        <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>{user?.email}로 로그인 중 (관리자)</p>
      </div>
    </div>
  )
}
