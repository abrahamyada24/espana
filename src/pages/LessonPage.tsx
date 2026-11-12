import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { LEVELS, UNITS, WORD_BY_ID, unitById } from '../data/curriculum'
import { PASS_SCORE, useProgress } from '../lib/store'
import { buildLesson, buildLevelTest } from '../lib/exercises'
import { sttSupported } from '../lib/speech'
import { isUnitUnlocked, unitsOfLevel } from '../lib/units'
import { LessonRunner, type LessonResult } from '../components/LessonRunner'
import type { Level } from '../types'
import { Icon } from '../components/Icon'

export default function LessonPage() {
  const { unitId, level } = useParams()
  const { progress, addXp, completeUnit, addWords } = useProgress()
  const [result, setResult] = useState<LessonResult | null>(null)
  const [round, setRound] = useState(0)

  const unit = unitId ? unitById(unitId) : undefined
  const lvl = LEVELS.find((l) => l.level === level)?.level as Level | undefined

  const exercises = useMemo(() => {
    const opts = { speaking: sttSupported() }
    if (unit) return buildLesson(unit, opts)
    if (lvl) return buildLevelTest(unitsOfLevel(lvl), opts)
    return []
  }, [unitId, level, round])

  if (!unit && !lvl) return <Navigate to="/belajar" replace />
  if (unit && !isUnitUnlocked(unit.id, progress)) return <Navigate to="/belajar" replace />

  const exitTo = unit ? `/unit/${unit.id}` : '/belajar'
  const recordKey = unit ? unit.id : `test-${lvl}`

  function finish(r: LessonResult) {
    setResult(r)
    addXp(r.xp)
    completeUnit(recordKey, r.score)
    // Words practised in a lesson enter the spaced-repetition deck.
    const ids = exercises.map((e) => e.wordId).filter((x): x is string => !!x)
    addWords(ids)
  }

  if (result) {
    const passed = result.score >= PASS_SCORE
    const idx = unit ? UNITS.findIndex((u) => u.id === unit.id) : -1
    const next = idx >= 0 ? UNITS[idx + 1] : undefined
    // One row per Spanish item, with its Indonesian meaning.
    const review = new Map<string, string>()
    for (const m of result.mistakes) {
      const w = m.wordId ? WORD_BY_ID.get(m.wordId) : undefined
      if (w) review.set(w.es, w.id_)
      else review.set(m.answer, m.prompt)
    }
    return (
      <div className="result">
        <p className="kicker">{unit ? unit.title : `Ujian ${lvl}`}</p>
        <h1 className="display">{result.score === 100 ? '¡Perfecto!' : passed ? '¡Muy bien!' : '¡Casi!'}</h1>
        <p className="muted">
          {passed
            ? unit
              ? 'Unit ini selesai. Kata-katanya sudah masuk ke kartu ulasan.'
              : `Selamat, kamu lulus ujian ${lvl}!`
            : `Butuh skor minimal ${PASS_SCORE}% untuk lulus. Coba sekali lagi!`}
        </p>
        <div className="result-stats">
          <div className="ledger-cell">
            <span className="label">Akurasi</span>
            <span className="figure">{result.score}%</span>
          </div>
          <div className="ledger-cell">
            <span className="label">XP</span>
            <span className="figure">+{result.xp}</span>
          </div>
        </div>
        {review.size > 0 && (
          <div className="mistakes">
            <h2 className="section-title">Perlu diulang</h2>
            <ul>
              {[...review].map(([es, id_]) => (
                <li key={es}>
                  <span lang="es">{es}</span>
                  <span className="muted"> · {id_}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="result-actions">
          <button
            className="btn"
            onClick={() => {
              setResult(null)
              setRound((r) => r + 1)
            }}
          >
            <Icon name="repeat" size={16} /> Ulangi
          </button>
          {passed && next ? (
            <Link to={`/unit/${next.id}`} className="btn primary">
              Unit berikutnya <Icon name="right" size={16} />
            </Link>
          ) : (
            <Link to={exitTo} className="btn primary">
              Selesai
            </Link>
          )}
        </div>
      </div>
    )
  }

  return <LessonRunner key={round} exercises={exercises} onFinish={finish} exitTo={exitTo} />
}
