import { createContext, useContext } from 'react'
import { useAppData } from './useAppData'
import { useAuth } from './AuthContext'

const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
  const { user } = useAuth()
  const value = useAppData(user.id)

  if (value.loading) {
    return (
      <div className="page-header">
        <p>불러오는 중...</p>
      </div>
    )
  }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useApp은 AppDataProvider 내부에서만 사용할 수 있습니다')
  return ctx
}
