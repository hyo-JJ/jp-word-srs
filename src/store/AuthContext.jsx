import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

// Supabase Auth는 이메일이 필요해서, 사용자가 입력한 아이디로 가짜 이메일을 만들어 내부적으로만 사용한다.
// 단, admin/mentor처럼 Supabase 대시보드에서 실제 이메일로 만든 계정도 로그인해야 하므로
// 입력값에 "@"가 있으면(=이메일 형태) 그대로 쓰고, 없으면(=아이디) 가짜 이메일로 변환한다
const FAKE_EMAIL_DOMAIN = 'jpword.local'
const usernameToEmail = (input) => {
  const trimmed = input.trim().toLowerCase()
  return trimmed.includes('@') ? trimmed : `${trimmed}@${FAKE_EMAIL_DOMAIN}`
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined) // undefined = 아직 확인 전, null = 비로그인
  const [profile, setProfile] = useState(undefined) // undefined = 아직 확인 전, { role, approved, username, nickname }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const userId = session?.user?.id
    if (!userId) {
      setProfile(session === null ? null : undefined)
      return
    }
    let cancelled = false
    supabase
      .from('profiles')
      .select('role, approved, username, nickname')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setProfile(data ?? { role: 'mentee', approved: false, username: null, nickname: null })
      })
    return () => {
      cancelled = true
    }
  }, [session])

  const value = {
    session,
    user: session?.user ?? null,
    role: profile?.role,
    approved: profile?.approved ?? false,
    nickname: profile?.nickname,
    loading: session === undefined || (session !== null && profile === undefined),
    signUp: (username, nickname, password) =>
      supabase.auth.signUp({
        email: usernameToEmail(username),
        password,
        options: { data: { username, nickname } },
      }),
    signIn: (username, password) => supabase.auth.signInWithPassword({ email: usernameToEmail(username), password }),
    signOut: () => supabase.auth.signOut(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다')
  return ctx
}
