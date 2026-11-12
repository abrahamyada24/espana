import { useRef, useState, type FormEvent } from 'react'
import { PERSONS, TENSES, VERBS, conjugate, isIrregular, type Tense } from '../data/verbs'
import { compareAnswer } from '../lib/text'
import { useProgress } from '../lib/store'
import { speak } from '../lib/speech'
import { SpeakButton } from '../components/SpeakButton'
import { AccentKeyboard } from '../components/AccentKeyboard'

function randomQuestion(tenses: Tense[]) {
  const v = VERBS[Math.floor(Math.random() * VERBS.length)]
  const t = tenses[Math.floor(Math.random() * tenses.length)]
  const p = Math.floor(Math.random() * PERSONS.length)
  return { v, t, p, answer: conjugate(v, t)[p] }
}

export default function Verbs() {
  const [mode, setMode] = useState<'tabel' | 'drill'>('tabel')
  const [verbIdx, setVerbIdx] = useState(0)
  const verb = VERBS[verbIdx]

  return (
    <div className="page">
      <header className="page-head">
        <p className="kicker">Tata bahasa</p>
        <h1 className="display">Konjugasi</h1>
        <p className="lede">Kata kerja adalah inti bahasa Spanyol. Pelajari polanya di tabel, lalu latih sampai keluar dengan sendirinya.</p>
      </header>
      <div className="tabs">
        <button className={`tab ${mode === 'tabel' ? 'active' : ''}`} onClick={() => setMode('tabel')}>
          Tabel
        </button>
        <button className={`tab ${mode === 'drill' ? 'active' : ''}`} onClick={() => setMode('drill')}>
          Latihan cepat
        </button>
      </div>

      {mode === 'tabel' ? (
        <>
          <div className="verb-picker">
            {VERBS.map((v, i) => (
              <button key={v.inf} className={`chip ${i === verbIdx ? 'active' : ''} ${v.irr ? 'irr' : ''}`} onClick={() => setVerbIdx(i)}>
                {v.inf}
              </button>
            ))}
          </div>
          <p className="small muted">
            <span className="legend irr" /> bentuk tidak beraturan
          </p>
          <h2 lang="es">
            {verb.inf} <SpeakButton text={verb.inf} /> <span className="muted small">· {verb.id_}</span>
          </h2>
          <div className="table-wrap">
            <table className="conj">
              <thead>
                <tr>
                  <th></th>
                  {TENSES.map((t) => (
                    <th key={t.id}>
                      {t.name}
                      <div className="small muted">
                        {t.level} · {t.desc}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERSONS.map((p, pi) => (
                  <tr key={p}>
                    <th>{p}</th>
                    {TENSES.map((t) => {
                      const form = conjugate(verb, t.id)[pi]
                      return (
                        <td key={t.id} lang="es" className={isIrregular(verb, t.id) ? 'irr' : ''}>
                          <button className="linklike" onClick={() => speak(form)}>
                            {form}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <Drill />
      )}
    </div>
  )
}

function Drill() {
  const { addXp } = useProgress()
  const [tenses, setTenses] = useState<Tense[]>(['presente'])
  const [q, setQ] = useState(() => randomQuestion(['presente']))
  const [input, setInput] = useState('')
  const [state, setState] = useState<'ask' | 'ok' | 'bad'>('ask')
  const [stats, setStats] = useState({ ok: 0, total: 0, streak: 0 })
  const inputRef = useRef<HTMLInputElement>(null)

  const toggleTense = (t: Tense) => {
    const next = tenses.includes(t) ? tenses.filter((x) => x !== t) : [...tenses, t]
    if (next.length === 0) return
    setTenses(next)
    setQ(randomQuestion(next))
    setInput('')
    setState('ask')
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    if (state !== 'ask') {
      setQ(randomQuestion(tenses))
      setInput('')
      setState('ask')
      requestAnimationFrame(() => inputRef.current?.focus())
      return
    }
    if (!input.trim()) return
    const m = compareAnswer(input, q.answer)
    // Accents matter in conjugation (hablo ≠ habló), so only exact matches count.
    const ok = m === 'exact'
    setState(ok ? 'ok' : 'bad')
    setStats((s) => ({ ok: s.ok + (ok ? 1 : 0), total: s.total + 1, streak: ok ? s.streak + 1 : 0 }))
    if (ok) addXp(1)
    speak(q.answer)
  }

  const tenseInfo = TENSES.find((t) => t.id === q.t)!

  return (
    <div className="drill">
      <div className="verb-picker">
        {TENSES.map((t) => (
          <button key={t.id} className={`chip ${tenses.includes(t.id) ? 'active' : ''}`} onClick={() => toggleTense(t.id)}>
            {t.name} <span className="small muted">{t.level}</span>
          </button>
        ))}
      </div>
      <form className="drill-card" onSubmit={submit}>
        <div className="muted small">
          {tenseInfo.name} · {tenseInfo.desc}
        </div>
        <div className="drill-q">
          <span className="drill-person">{PERSONS[q.p]}</span> + <strong lang="es">{q.v.inf}</strong> <span className="muted">({q.v.id_})</span>
        </div>
        <input
          ref={inputRef}
          className={`text-input ${state === 'ok' ? 'correct' : state === 'bad' ? 'wrong' : ''}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          readOnly={state !== 'ask'}
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          lang="es"
          placeholder="bentuk kata kerja…"
        />
        {state === 'ask' && <AccentKeyboard inputRef={inputRef} onInsert={setInput} />}
        {state !== 'ask' && (
          <p className={state === 'ok' ? 'ok-text' : 'bad-text'}>
            {state === 'ok' ? '¡Correcto!' : 'Jawaban benar: '}
            {state === 'bad' && <strong lang="es">{q.answer}</strong>}
          </p>
        )}
        <button className="btn primary" type="submit">
          {state === 'ask' ? 'Periksa' : 'Berikutnya'}
        </button>
        <div className="row-between small muted">
          <span>
            Benar {stats.ok}/{stats.total}
          </span>
          <span>Beruntun {stats.streak}</span>
        </div>
      </form>
    </div>
  )
}
