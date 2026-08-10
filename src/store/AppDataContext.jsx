import { createContext, useContext } from 'react'
import { useAppData } from './useAppData'

const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
  const value = useAppData()
  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useApp은 AppDataProvider 내부에서만 사용할 수 있습니다')
  return ctx
}
