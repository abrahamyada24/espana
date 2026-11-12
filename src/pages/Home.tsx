import { Link } from 'react-router-dom'
import { LEVELS } from '../data/curriculum'
import { effectiveStreak, today, useProgress } from '../lib/store'
import { isMature } from '../lib/srs'
import { levelProgress, nextUnit } from '../lib/units'
import { ProgressBar } from '../components/ProgressBar'
import { SpeakButton } from '../components/SpeakButton'

const PHRASES = [
  { es: 'Poco a poco se va lejos.', id_: 'Sedikit demi sedikit, kita bisa pergi jauh.' },
  { es: 'Querer es poder.', id_: 'Di mana ada kemauan, di situ ada jalan.' },
  { es: 'Más vale tarde que nunca.', id_: 'Lebih baik terlambat daripada tidak sama sekali.' },
  { es: 'La práctica hace al maestro.', id_: 'Latihan membuat sempurna.' },
  { es: 'Paso a paso.', id_: 'Langkah demi langkah.' },
  { es: 'El que no arriesga, no gana.', id_: 'Siapa yang tidak berani mencoba, tidak akan menang.' },
  { es: 'Nunca es tarde para aprender.', id_: 'Tidak pernah terlambat untuk belajar.' },
]

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return '¡Buenos días!'
  if (h < 19) return '¡Buenas tardes!'
  return '¡Buenas noches!'
}

export default function Home() {
  const { progress } = useProgress()
  const t = today()
  const todayXp = progress.history[t] ?? 0
  const goal = progress.settings.dailyGoal
  const streak = effectiveStreak(progress)
  const cards = Object.values(progress.srs)
  const due = cards.filter((c) => c.due <= Date.now()).length
  const mature = cards.filter(isMature).length
  const next = nextUnit(progress)
  const phrase = PHRASES[new Date().getDate() % PHRASES.length]

  // Last 14 days of activity.
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (13 - i))
    const key = today(d)
    return { key, label: d.toLocaleDateString('id-ID', { weekday: 'narrow' }), xp: progress.history[key] ?? 0 }
  })
  const maxXp = Math.max(goal, ...days.map((d) => d.xp))

  return (
    <div className="page">
      <header className="hero">
        <div>
          <h1>{greeting()}</h1>
          <p className="muted">{progress.xp === 0 ? 'Selamat datang! Mari mulai perjalanan bahasa Spanyolmu.' : 'Lanjutkan belajarmu hari ini.'}</p>
        </div>
        <div className="hero-flag" aria-hidden>
          🇪🇸 🇲🇽 🇦🇷 🇨🇴
        </div>
      </header>

      <section className="grid-3">
        <div className="card stat">
          <span className="stat-icon">🔥</span>
          <div>
            <div className="stat-num">{streak} hari</div>
            <div className="muted small">Runtutan · terbaik {progress.bestStreak}</div>
          </div>
        </div>
        <div className="card stat">
          <span className="stat-icon">🎯</span>
          <div style={{ flex: 1 }}>
            <div className="stat-num">
              {todayXp}/{goal} XP
            </div>
            <ProgressBar value={todayXp} max={goal} color={todayXp >= goal ? 'var(--green)' : undefined} />
          </div>
        </div>
        <div className="card stat">
          <span className="stat-icon">🧠</span>
          <div>
            <div className="stat-num">{cards.length} kata</div>
            <div className="muted small">{mature} sudah dikuasai (≥21 hari)</div>
          </div>
        </div>
      </section>

      <section className="grid-2">
        {next ? (
          <Link to={`/unit/${next.id}`} className="card cta">
            <span className="cta-emoji">{next.emoji}</span>
            <div>
              <div className="eyebrow">Lanjutkan · {next.level}</div>
              <h2>{next.title}</h2>
              <p className="muted" lang="es">
                {next.titleEs}
              </p>
            </div>
            <span className="cta-arrow">→</span>
          </Link>
        ) : (
          <div className="card cta">
            <span className="cta-emoji">🏆</span>
            <div>
              <h2>Semua unit selesai!</h2>
              <p className="muted">¡Enhorabuena! Teruskan ulasan agar kosakata tetap melekat.</p>
            </div>
          </div>
        )}
        <Link to="/ulasan" className={`card cta ${due ? 'cta-alert' : ''}`}>
          <span className="cta-emoji">🃏</span>
          <div>
            <div className="eyebrow">Ulasan berjarak (SRS)</div>
            <h2>{due ? `${due} kartu menunggu` : 'Tidak ada kartu jatuh tempo'}</h2>
            <p className="muted">{due ? 'Ulas sekarang sebelum lupa!' : 'Pelajari unit baru untuk menambah kartu.'}</p>
          </div>
          <span className="cta-arrow">→</span>
        </Link>
      </section>

      <section className="grid-2">
        <div className="card">
          <h3>Aktivitas 14 hari</h3>
          <div className="chart" role="img" aria-label="Grafik XP harian 14 hari terakhir">
            {days.map((d) => (
              <div key={d.key} className="chart-col" title={`${d.key}: ${d.xp} XP`}>
                <div className="chart-bar-wrap">
                  <div className={`chart-bar ${d.xp >= goal ? 'met' : ''}`} style={{ height: `${(d.xp / maxXp) * 100}%` }} />
                </div>
                <span className="chart-label">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card phrase">
          <h3>Frasa hari ini</h3>
          <p className="phrase-es" lang="es">
            <SpeakButton text={phrase.es} /> {phrase.es}
          </p>
          <p className="muted">{phrase.id_}</p>
        </div>
      </section>

      <section className="card">
        <h3>Progres CEFR</h3>
        <div className="levels-mini">
          {LEVELS.map((l) => {
            const lp = levelProgress(l.level, progress)
            return (
              <div key={l.level} className="level-mini">
                <span className={`level-pill lv-${l.level}`}>{l.level}</span>
                <div style={{ flex: 1 }}>
                  <div className="row-between small">
                    <span>{l.name}</span>
                    <span className="muted">
                      {lp.passed}/{lp.total} unit {lp.testScore >= 70 ? '· ✅ ujian lulus' : ''}
                    </span>
                  </div>
                  <ProgressBar value={lp.passed} max={lp.total} />
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
