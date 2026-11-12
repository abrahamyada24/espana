import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { WORD_BY_ID, unitById, unitNo } from '../data/curriculum'
import { useProgress } from '../lib/store'
import { previewInterval, type Grade } from '../lib/srs'
import { speak } from '../lib/speech'
import { shuffle } from '../lib/text'
import { SpeakButton } from '../components/SpeakButton'

const GRADES: { g: Grade; label: string; cls: string; key: string }[] = [
  { g: 0, label: 'Lupa', cls: 'g-again', key: '1' },
  { g: 3, label: 'Sulit', cls: 'g-hard', key: '2' },
  { g: 4, label: 'Bisa', cls: 'g-good', key: '3' },
  { g: 5, label: 'Mudah', cls: 'g-easy', key: '4' },
]

export default function Review() {
  const { progress, gradeWord, addXp } = useProgress()
  const [practice, setPractice] = useState(false)
  // Freeze the session's queue on mount so grading doesn't reshuffle it.
  const [sessionKey, setSessionKey] = useState(0)
  const queue = useMemo(() => {
    const ids = Object.entries(progress.srs)
    const list = practice ? shuffle(ids).slice(0, 15) : ids.filter(([, c]) => c.due <= Date.now()).sort((a, b) => a[1].due - b[1].due)
    return list.map(([id]) => id).filter((id) => WORD_BY_ID.has(id))
  }, [sessionKey, practice])
  const [i, setI] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [reviewed, setReviewed] = useState(0)

  const id = queue[i]
  const word = id ? WORD_BY_ID.get(id) : undefined
  const card = id ? progress.srs[id] : undefined
  // Recognition (es → id) for new cards, recall (id → es) once a card is known.
  const reverse = !!card && card.reps >= 2 && i % 2 === 1

  useEffect(() => {
    if (word && !reverse) speak(word.es)
  }, [word, reverse])

  function grade(g: Grade) {
    if (!id) return
    if (!practice) {
      gradeWord(id, g)
      addXp(1)
    }
    setReviewed((n) => n + 1)
    setRevealed(false)
    setI((n) => n + 1)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!word) return
      if (!revealed && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault()
        setRevealed(true)
        if (reverse) speak(word.es)
      } else if (revealed) {
        const gr = GRADES.find((x) => x.key === e.key)
        if (gr) grade(gr.g)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const total = Object.keys(progress.srs).length
  if (total === 0) {
    return (
      <div className="page center">
        <p className="kicker">Ulasan</p>
        <h1 className="display">Dek masih kosong.</h1>
        <p className="muted">Selesaikan latihan unit atau tambahkan kosakata dari halaman unit untuk mulai mengulas.</p>
        <Link to="/belajar" className="btn primary">
          Mulai belajar
        </Link>
      </div>
    )
  }

  if (!word) {
    const nextDue = Math.min(...Object.values(progress.srs).map((c) => c.due))
    return (
      <div className="page center">
        <p className="kicker">Ulasan</p>
        <h1 className="display">{reviewed ? `¡Bien hecho! ${reviewed} kartu selesai.` : 'Semua kartu sudah diulas.'}</h1>
        <p className="muted">
          Kartu berikutnya jatuh tempo{' '}
          {nextDue <= Date.now() ? 'sekarang' : new Date(nextDue).toLocaleString('id-ID', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}.
        </p>
        <div className="result-actions">
          <button
            className="btn"
            onClick={() => {
              setPractice(true)
              setI(0)
              setReviewed(0)
              setSessionKey((k) => k + 1)
            }}
          >
            Latihan tambahan (tidak mengubah jadwal)
          </button>
          {nextDue <= Date.now() && (
            <button
              className="btn primary"
              onClick={() => {
                setPractice(false)
                setI(0)
                setSessionKey((k) => k + 1)
              }}
            >
              Ulas lagi
            </button>
          )}
        </div>
      </div>
    )
  }

  const unit = unitById((WORD_BY_ID.get(id)!).unitId)

  return (
    <div className="page review">
      <div className="row-between">
        <h1 className="display small-display">{practice ? 'Latihan tambahan' : 'Ulasan'}</h1>
        <span className="note">
          {i + 1} / {queue.length}
        </span>
      </div>
      <div className={`flashcard ${revealed ? 'revealed' : ''}`} onClick={() => !revealed && setRevealed(true)}>
        <div className="fc-meta muted small">
          Unit {unit && unitNo(unit.id)} · {unit?.title} · {reverse ? 'Indonesia ke Spanyol' : 'Spanyol ke Indonesia'}
        </div>
        <div className="fc-front" lang={reverse ? 'id' : 'es'}>
          {reverse ? word.id_ : word.es}
          {!reverse && <SpeakButton text={word.es} />}
        </div>
        {revealed ? (
          <div className="fc-back">
            <div lang={reverse ? 'es' : 'id'}>
              {reverse ? word.es : word.id_} {reverse && <SpeakButton text={word.es} />}
            </div>
            {word.note && <div className="muted small">{word.note}</div>}
          </div>
        ) : (
          <div className="fc-hint muted">Ingat jawabannya, lalu ketuk / tekan Spasi</div>
        )}
      </div>
      {revealed && (
        <div className="grades">
          {GRADES.map((g) => (
            <button key={g.g} className={`grade ${g.cls}`} onClick={() => grade(g.g)}>
              <strong>{g.label}</strong>
              {!practice && card && <span className="small">{previewInterval(card, g.g)}</span>}
            </button>
          ))}
        </div>
      )}
      <p className="muted small center-text">
        Sistem pengulangan berjarak (SM-2): kata yang mudah muncul makin jarang, kata yang sulit muncul lebih sering.
      </p>
    </div>
  )
}
