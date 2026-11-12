import { Link } from 'react-router-dom'
import { LEVELS } from '../data/curriculum'
import { useProgress } from '../lib/store'
import { isUnitPassed, isUnitUnlocked, levelProgress, unitsOfLevel } from '../lib/units'

export default function Learn() {
  const { progress } = useProgress()
  return (
    <div className="page">
      <h1>Kurikulum</h1>
      <p className="muted">
        Disusun mengikuti <strong>CEFR</strong> (Common European Framework of Reference) dan Plan Curricular Instituto Cervantes. Selesaikan latihan
        dengan skor ≥70% untuk membuka unit berikutnya.
      </p>

      {LEVELS.map((l) => {
        const units = unitsOfLevel(l.level)
        const lp = levelProgress(l.level, progress)
        const testOpen = progress.settings.unlockAll || lp.passed === lp.total
        return (
          <section key={l.level} className="level-section">
            <div className="level-head">
              <span className={`level-pill big lv-${l.level}`}>{l.level}</span>
              <div>
                <h2>{l.name}</h2>
                <p className="muted small">{l.desc}</p>
              </div>
            </div>
            <div className="unit-grid">
              {units.map((u) => {
                const unlocked = isUnitUnlocked(u.id, progress)
                const passed = isUnitPassed(u.id, progress)
                const score = progress.units[u.id]
                const body = (
                  <>
                    <span className="unit-emoji">{unlocked ? u.emoji : '🔒'}</span>
                    <div className="unit-info">
                      <h3>{u.title}</h3>
                      <p className="muted small" lang="es">
                        {u.titleEs}
                      </p>
                      <p className="small unit-meta">
                        {u.vocab.length} kata · {u.grammar.title}
                      </p>
                    </div>
                    {passed && <span className="unit-score">✅ {score}%</span>}
                    {!passed && score !== undefined && <span className="unit-score warn">{score}%</span>}
                  </>
                )
                return unlocked ? (
                  <Link key={u.id} to={`/unit/${u.id}`} className={`card unit-card ${passed ? 'done' : ''}`}>
                    {body}
                  </Link>
                ) : (
                  <div key={u.id} className="card unit-card locked" title="Selesaikan unit sebelumnya dulu">
                    {body}
                  </div>
                )
              })}
              {testOpen ? (
                <Link to={`/ujian/${l.level}`} className="card unit-card test">
                  <span className="unit-emoji">🎓</span>
                  <div className="unit-info">
                    <h3>Ujian {l.level}</h3>
                    <p className="muted small">Tes campuran 20 soal dari semua unit {l.level}</p>
                  </div>
                  {lp.testScore > 0 && <span className={`unit-score ${lp.testScore >= 70 ? '' : 'warn'}`}>{lp.testScore}%</span>}
                </Link>
              ) : (
                <div className="card unit-card test locked">
                  <span className="unit-emoji">🔒</span>
                  <div className="unit-info">
                    <h3>Ujian {l.level}</h3>
                    <p className="muted small">Selesaikan semua unit {l.level} untuk membuka</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
