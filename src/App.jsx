import { HashRouter, Routes, Route, NavLink } from 'react-router-dom'
import { AppDataProvider } from './store/AppDataContext'
import Home from './pages/Home'
import Curriculum from './pages/Curriculum'
import DayDetail from './pages/DayDetail'
import Review from './pages/Review'
import WordList from './pages/WordList'
import Stats from './pages/Stats'
import './App.css'

function App() {
  return (
    <AppDataProvider>
      <HashRouter>
        <div className="app-shell">
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/learn" element={<Curriculum />} />
              <Route path="/day/:day" element={<DayDetail />} />
              <Route path="/review" element={<Review />} />
              <Route path="/words" element={<WordList />} />
              <Route path="/stats" element={<Stats />} />
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
              <span>복습</span>
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
      </HashRouter>
    </AppDataProvider>
  )
}

export default App
