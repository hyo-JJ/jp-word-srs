import { HashRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
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
import StudySchedule from './pages/StudySchedule'
import Todos from './pages/Todos'
import WordList from './pages/WordList'
import Stats from './pages/Stats'
import AdminMembers from './pages/AdminMembers'
import MentorDashboard from './pages/MentorDashboard'
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

  if (role === 'mentor') {
    return (
      <div className="app-shell">
        <main className="app-main">
          <Routes>
            <Route path="*" element={<MentorDashboard />} />
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
            <Route path="/schedule" element={<StudySchedule />} />
            <Route path="/todos" element={<Todos />} />
            <Route path="/words" element={<WordList />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <nav className="bottom-nav">
          <NavLink to="/" end className="nav-item">
            <span className="nav-icon">🏠</span>
            <span>홈</span>
          </NavLink>
          <NavLink to="/learn" className="nav-item">
            <span className="nav-icon">📗</span>
            <span>학습</span>
          </NavLink>
          <NavLink to="/review" className="nav-item">
            <span className="nav-icon">✏️</span>
            <span>오답노트</span>
          </NavLink>
          <NavLink to="/words" className="nav-item">
            <span className="nav-icon">📖</span>
            <span>단어장</span>
          </NavLink>
          <NavLink to="/stats" className="nav-item">
            <span className="nav-icon">📊</span>
            <span>통계</span>
          </NavLink>
        </nav>
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
