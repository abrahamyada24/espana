import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { LEVELS, UNITS, unitById } from '../data/curriculum'
import { PASS_SCORE, useProgress } from '../lib/store'
import { buildLesson, buildLevelTest } from '../lib/exercises'
import { sttSupported } from '../lib/speech'
import { isUnitUnlocked, unitsOfLevel } from '../lib/units'
import { LessonRunner, type LessonResult } from '../components/LessonRunner'
import type { Level } from '../types'

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
    return (
      <div className="result">
        <div className="result-emoji">{result.score === 100 ? '🏆' : passed ? '🎉' : '💪'}</div>
        <h1>{result.score === 100 ? '¡Perfecto!' : passed ? '¡Muy bien!' : '¡Casi!'}</h1>
        <p className="muted">
          {passed
            ? unit
              ? 'Unit ini selesai. Kata-katanya sudah masuk ke kartu ulasan.'
              : `Selamat, kamu lulus ujian ${lvl}!`
            : `Butuh skor minimal ${PASS_SCORE}% untuk lulus. Coba sekali lagi!`}
        </p>
        <div className="result-stats">
          <div className="card stat-box">
            <div className="stat-num">{result.score}%</div>
            <div className="muted small">Akurasi</div>
          </div>
          <div className="card stat-box">
            <div className="stat-num">+{result.xp}</div>
            <div className="muted small">XP</div>
          </div>
        </div>
        {result.mistakes.length > 0 && (
          <div className="card mistakes">
            <h3>Perlu diulang</h3>
            <ul>
              {result.mistakes.map((m) => (
                <li key={m.key}>
                  <span lang="es">{m.answer}</span>
                  {m.kind !== 'mc-es' && <span className="muted"> · {m.prompt}</span>}
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
            ↻ Ulangi
          </button>
          {passed && next ? (
            <Link to={`/unit/${next.id}`} className="btn primary">
              Unit berikutnya →
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
