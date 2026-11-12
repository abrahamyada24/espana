import { Link } from 'react-router-dom'
import { LEVELS, unitNo } from '../data/curriculum'
import { useProgress } from '../lib/store'
import { isUnitPassed, isUnitUnlocked, levelProgress, unitsOfLevel } from '../lib/units'
import { Icon } from '../components/Icon'

export default function Learn() {
  const { progress } = useProgress()
  return (
    <div className="page">
      <header className="page-head">
        <p className="kicker">Kurikulum</p>
        <h1 className="display">Daftar isi</h1>
        <p className="lede">
          Enam belas unit dari A1 sampai B1, disusun mengikuti CEFR dan Plan Curricular Instituto Cervantes. Skor minimal 70% membuka unit berikutnya.
        </p>
      </header>

      {LEVELS.map((l) => {
        const units = unitsOfLevel(l.level)
        const lp = levelProgress(l.level, progress)
        const testOpen = progress.settings.unlockAll || lp.passed === lp.total
        return (
          <section key={l.level} className="toc-level">
            <div className="toc-level-head">
              <span className="level-code big">{l.level}</span>
              <div>
                <h2>{l.name}</h2>
                <p className="note">{l.desc}</p>
              </div>
              <span className="toc-count">
                {lp.passed} dari {lp.total} selesai
              </span>
            </div>
            <ol className="toc">
              {units.map((u) => {
                const unlocked = isUnitUnlocked(u.id, progress)
                const passed = isUnitPassed(u.id, progress)
                const score = progress.units[u.id]
                const inner = (
                  <>
                    <span className="unit-no">{unitNo(u.id)}</span>
                    <span className="toc-main">
                      <span className="toc-title">{u.title}</span>
                      <span className="es-sub">{u.titleEs}</span>
                    </span>
                    <span className="toc-meta">
                      {u.vocab.length} kata · {u.grammar.title}
                    </span>
                    <span className="toc-status">
                      {!unlocked ? (
                        <Icon name="lock" size={16} />
                      ) : passed ? (
                        <span className="score ok">
                          <Icon name="check" size={14} /> {score}%
                        </span>
                      ) : score !== undefined ? (
                        <span className="score">{score}%</span>
                      ) : (
                        <Icon name="right" size={16} />
                      )}
                    </span>
                  </>
                )
                return (
                  <li key={u.id}>
                    {unlocked ? (
                      <Link to={`/unit/${u.id}`} className={`toc-row ${passed ? 'done' : ''}`}>
                        {inner}
                      </Link>
                    ) : (
                      <div className="toc-row locked" title="Selesaikan unit sebelumnya dulu">
                        {inner}
                      </div>
                    )}
                  </li>
                )
              })}
              <li>
                {testOpen ? (
                  <Link to={`/ujian/${l.level}`} className="toc-row exam">
                    <span className="unit-no">—</span>
                    <span className="toc-main">
                      <span className="toc-title">Ujian {l.level}</span>
                      <span className="es-sub">Examen de nivel</span>
                    </span>
                    <span className="toc-meta">20 soal campuran dari semua unit {l.level}</span>
                    <span className="toc-status">
                      {lp.testScore > 0 ? <span className={`score ${lp.testScore >= 70 ? 'ok' : ''}`}>{lp.testScore}%</span> : <Icon name="right" size={16} />}
                    </span>
                  </Link>
                ) : (
                  <div className="toc-row exam locked">
                    <span className="unit-no">—</span>
                    <span className="toc-main">
                      <span className="toc-title">Ujian {l.level}</span>
                      <span className="es-sub">Examen de nivel</span>
                    </span>
                    <span className="toc-meta">Terbuka setelah semua unit {l.level} selesai</span>
                    <span className="toc-status">
                      <Icon name="lock" size={16} />
                    </span>
                  </div>
                )}
              </li>
            </ol>
          </section>
        )
      })}
    </div>
  )
}
