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
import { Icon, type IconName } from './components/Icon'

const NAV: { to: string; icon: IconName; label: string }[] = [
  { to: '/', icon: 'home', label: 'Beranda' },
  { to: '/belajar', icon: 'book', label: 'Belajar' },
  { to: '/ulasan', icon: 'cards', label: 'Ulasan' },
  { to: '/konjugasi', icon: 'table', label: 'Konjugasi' },
  { to: '/pelafalan', icon: 'wave', label: 'Pelafalan' },
  { to: '/kamus', icon: 'search', label: 'Kamus' },
  { to: '/pengaturan', icon: 'sliders', label: 'Pengaturan' },
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
      <header className="masthead">
        <NavLink to="/" className="wordmark">
          <span className="wm-mark">ñ</span>
          <span className="wm-text">Vamos</span>
        </NavLink>
        <nav className="nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className="nav-item">
              <Icon name={n.icon} size={20} className="nav-icon" />
              <span className="nav-label">{n.label}</span>
              {n.to === '/ulasan' && due > 0 && <span className="badge">{due}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="mast-stats">
          <span>
            <b>{effectiveStreak(progress)}</b> hari
          </span>
          <span>
            <b>{progress.xp}</b> XP
          </span>
        </div>
      </header>
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
      <footer className="colophon">
        Vamos · Kurikulum mengikuti CEFR &amp; Plan Curricular del Instituto Cervantes
      </footer>
    </div>
  )
}
