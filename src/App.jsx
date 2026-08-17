import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './store/AuthContext'
import { AppDataProvider } from './store/AppDataContext'
import Auth from './pages/Auth'
import PendingApproval from './pages/PendingApproval'
import Home from './pages/Home'
import Curriculum from './pages/Curriculum'
import DayDetail from './pages/DayDetail'
import WrongPool from './pages/WrongPool'
import SentenceGame from './pages/SentenceGame'
import GamesHub from './pages/GamesHub'
import JlptTest from './pages/JlptTest'
import WordList from './pages/WordList'
import Stats from './pages/Stats'
import AdminMembers from './pages/AdminMembers'
import './App.css'

function AppShell() {
  const { user, role, approved, loading } = useAuth()

  if (loading) {
    return (
      <div className="app-shell">
        <main className="app-main" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="app-shell">
        <main className="app-main">
          <Routes>
            <Route path="*" element={<Auth />} />
          </Routes>
        </main>
      </div>
    )
  }

  if (!approved) {
    return (
      <div className="app-shell">
        <main className="app-main">
          <PendingApproval />
        </main>
      </div>
    )
  }

  if (role === 'admin') {
    return (
      <div className="app-shell">
        <main className="app-main">
          <Routes>
            <Route path="*" element={<AdminMembers />} />
          </Routes>
        </main>
      </div>
    )
  }

  return (
    <AppDataProvider>
      <div className="app-shell">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Curriculum />} />
            <Route path="/day/:day" element={<DayDetail />} />
            <Route path="/review" element={<WrongPool />} />
            <Route path="/games" element={<GamesHub />} />
            <Route path="/sentence-game" element={<SentenceGame />} />
            <Route path="/jlpt/:block" element={<JlptTest />} />
            <Route path="/words" element={<WordList />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </AppDataProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppShell />
      </HashRouter>
    </AuthProvider>
  )
}

export default App
