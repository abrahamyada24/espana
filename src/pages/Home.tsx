import { Link } from 'react-router-dom'
import { LEVELS, unitNo } from '../data/curriculum'
import { effectiveStreak, today, useProgress } from '../lib/store'
import { isMature } from '../lib/srs'
import { levelProgress, nextUnit } from '../lib/units'
import { ProgressBar } from '../components/ProgressBar'
import { SpeakButton } from '../components/SpeakButton'
import { Icon } from '../components/Icon'

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
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
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
  const dateLine = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (13 - i))
    const key = today(d)
    return { key, label: d.toLocaleDateString('id-ID', { weekday: 'narrow' }), xp: progress.history[key] ?? 0 }
  })

  return (
    <div className="page">
      <header className="page-head">
        <p className="kicker">{dateLine}</p>
        <h1 className="display">{greeting()}.</h1>
        <p className="lede">
          {progress.xp === 0
            ? 'Mulai dari unit pertama. Lima belas menit sehari sudah cukup untuk membangun kebiasaan.'
            : 'Lanjutkan dari terakhir kali kamu berhenti, lalu ulas kosakata yang jatuh tempo.'}
        </p>
      </header>

      <section className="ledger">
        <div className="ledger-cell">
          <span className="label">Runtutan</span>
          <span className="figure">{streak}</span>
          <span className="note">hari · terbaik {progress.bestStreak}</span>
        </div>
        <div className="ledger-cell">
          <span className="label">Hari ini</span>
          <span className="figure">
            {todayXp}
            <small>/{goal}</small>
          </span>
          <ProgressBar value={todayXp} max={goal} />
        </div>
        <div className="ledger-cell">
          <span className="label">Kosakata</span>
          <span className="figure">{cards.length}</span>
          <span className="note">{mature} sudah dikuasai</span>
        </div>
        <Link to="/ulasan" className={`ledger-cell link ${due ? 'attn' : ''}`}>
          <span className="label">Ulasan</span>
          <span className="figure">{due}</span>
          <span className="note">
            {due ? 'kartu jatuh tempo' : 'tidak ada kartu'} <Icon name="right" size={14} />
          </span>
        </Link>
      </section>

      <section className="block">
        <h2 className="section-title">Lanjutkan</h2>
        {next ? (
          <Link to={`/unit/${next.id}`} className="continue">
            <span className="unit-no">{unitNo(next.id)}</span>
            <span className="continue-body">
              <span className="tag">{next.level}</span>
              <span className="continue-title">{next.title}</span>
              <span className="es-sub">{next.titleEs}</span>
            </span>
            <span className="continue-go">
              Buka unit <Icon name="right" size={18} />
            </span>
          </Link>
        ) : (
          <div className="continue">
            <span className="continue-body">
              <span className="continue-title">Semua unit sudah selesai.</span>
              <span className="es-sub">¡Enhorabuena! Teruskan ulasan harian agar kosakata tetap melekat.</span>
            </span>
          </div>
        )}
      </section>

      <section className="two-col block">
        <div>
          <h2 className="section-title">14 hari terakhir</h2>
          <div className="heat" role="img" aria-label="Aktivitas XP 14 hari terakhir">
            {days.map((d) => {
              const lvl = d.xp === 0 ? 0 : d.xp < goal / 2 ? 1 : d.xp < goal ? 2 : 3
              return (
                <div key={d.key} className="heat-cell" title={`${d.key}: ${d.xp} XP`}>
                  <span className={`heat-sq h${lvl}`} />
                  <span className="heat-label">{d.label}</span>
                </div>
              )
            })}
          </div>
          <p className="note">Kotak penuh berarti target harian tercapai.</p>
        </div>
        <div>
          <h2 className="section-title">Frasa hari ini</h2>
          <blockquote className="pull">
            <p lang="es">{phrase.es}</p>
            <footer>
              <SpeakButton text={phrase.es} size="sm" /> {phrase.id_}
            </footer>
          </blockquote>
        </div>
      </section>

      <section className="block">
        <h2 className="section-title">Progres per level CEFR</h2>
        <div className="levels">
          {LEVELS.map((l) => {
            const lp = levelProgress(l.level, progress)
            return (
              <div key={l.level} className="level-row">
                <span className="level-code">{l.level}</span>
                <span className="level-name">{l.name}</span>
                <ProgressBar value={lp.passed} max={lp.total} />
                <span className="level-count">
                  {lp.passed}/{lp.total}
                  {lp.testScore >= 70 && <Icon name="check" size={14} />}
                </span>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
