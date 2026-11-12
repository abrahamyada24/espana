import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Learn from './pages/Learn'
import UnitPage from './pages/UnitPage'
import LessonPage from './pages/LessonPage'
import Review from './pages/Review'
import Verbs from './pages/Verbs'
import Pronunciation from './pages/Pronunciation'
import Dictionary from './pages/Dictionary'
import Settings from './pages/Settings'
import { effectiveStreak, useProgress } from './lib/store'

const NAV = [
  { to: '/', icon: '🏠', label: 'Beranda' },
  { to: '/belajar', icon: '📚', label: 'Belajar' },
  { to: '/ulasan', icon: '🃏', label: 'Ulasan' },
  { to: '/konjugasi', icon: '🔀', label: 'Konjugasi' },
  { to: '/pelafalan', icon: '🗣️', label: 'Pelafalan' },
  { to: '/kamus', icon: '📖', label: 'Kamus' },
  { to: '/pengaturan', icon: '⚙️', label: 'Pengaturan' },
]

export default function App() {
  const { progress } = useProgress()
  const { pathname } = useLocation()
  const inLesson = pathname.startsWith('/latihan') || pathname.startsWith('/ujian')
  const due = Object.values(progress.srs).filter((c) => c.due <= Date.now()).length

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  if (inLesson) {
    return (
      <main className="lesson-shell">
        <Routes>
          <Route path="/latihan/:unitId" element={<LessonPage />} />
          <Route path="/ujian/:level" element={<LessonPage />} />
        </Routes>
      </main>
    )
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <NavLink to="/" className="brand">
          <span className="brand-logo">ñ</span>
          <span>
            ¡Vamos!
            <small>Belajar Spanyol</small>
          </span>
        </NavLink>
        <nav>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className="nav-item">
              <span className="nav-icon">{n.icon}</span>
              <span className="nav-label">{n.label}</span>
              {n.to === '/ulasan' && due > 0 && <span className="badge">{due}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="side-stats">
          <span title="Runtutan hari">🔥 {effectiveStreak(progress)}</span>
          <span title="Total XP">⭐ {progress.xp}</span>
        </div>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/belajar" element={<Learn />} />
          <Route path="/unit/:unitId" element={<UnitPage />} />
          <Route path="/ulasan" element={<Review />} />
          <Route path="/konjugasi" element={<Verbs />} />
          <Route path="/pelafalan" element={<Pronunciation />} />
          <Route path="/kamus" element={<Dictionary />} />
          <Route path="/pengaturan" element={<Settings />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  )
}
