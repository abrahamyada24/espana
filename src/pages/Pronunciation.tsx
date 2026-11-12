import { useState } from 'react'
import { ALPHABET, TIPS } from '../data/alphabet'
import { listen, speak, sttSupported } from '../lib/speech'
import { similarity } from '../lib/text'
import { SpeakButton } from '../components/SpeakButton'
import { Icon } from '../components/Icon'

const PRACTICE = ['perro', 'pero', 'jamón', 'mañana', 'guitarra', 'ciudad', 'llave', 'zapato', 'hermano', 'gente', 'Rodrigo', 'trabajar']

export default function Pronunciation() {
  const [target, setTarget] = useState(PRACTICE[0])
  const [result, setResult] = useState<{ heard: string; score: number } | null>(null)
  const [busy, setBusy] = useState(false)

  async function test() {
    setBusy(true)
    setResult(null)
    try {
      const alts = await listen().promise
      const best = alts.map((h) => ({ heard: h, score: similarity(h, target) })).sort((a, b) => b.score - a.score)[0]
      setResult(best ?? { heard: '', score: 0 })
    } catch {
      setResult({ heard: '', score: 0 })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <header className="page-head">
        <p className="kicker">Pelafalan</p>
        <h1 className="display">El abecedario</h1>
        <p className="lede">Ejaan Spanyol sangat konsisten. Kuasai bunyi-bunyi di bawah ini dan kamu bisa membaca kata apa pun dengan benar.</p>
      </header>

      <div className="notes-grid">
        {TIPS.map((t, i) => (
          <div key={t.title} className="numbered-note">
            <span className="unit-no">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </div>
          </div>
        ))}
      </div>

      {sttSupported() && (
        <section className="pron-lab">
          <h2 className="section-title">Lab pelafalan</h2>
          <p className="muted small">Pilih kata, dengarkan, lalu ucapkan. Pengenal suara browser akan menilai seberapa mirip ucapanmu.</p>
          <div className="verb-picker">
            {PRACTICE.map((w) => (
              <button
                key={w}
                className={`chip ${w === target ? 'active' : ''}`}
                onClick={() => {
                  setTarget(w)
                  setResult(null)
                  speak(w)
                }}
              >
                {w}
              </button>
            ))}
          </div>
          <div className="pron-target" lang="es">
            {target} <SpeakButton text={target} /> <SpeakButton text={target} slow />
          </div>
          <button className={`mic ${busy ? 'on' : ''}`} onClick={test} disabled={busy}>
            <Icon name="mic" size={18} /> {busy ? 'Mendengarkan…' : 'Ucapkan'}
          </button>
          {result && (
            <p className={result.score >= 80 ? 'ok-text' : 'bad-text'}>
              Terdengar: <strong>{result.heard || '—'}</strong> · {result.score}% {result.score >= 80 ? '¡Excelente!' : 'Coba lagi.'}
            </p>
          )}
        </section>
      )}

      <h2 className="section-title">Alfabet</h2>
      <div className="alpha-grid">
        {ALPHABET.map((l) => (
          <div key={l.letter} className="alpha">
            <div className="alpha-head">
              <span className="alpha-letter">{l.letter}</span>
              <button className="linklike muted" onClick={() => speak(l.name)} lang="es">
                “{l.name}” <Icon name="volume" size={14} />
              </button>
            </div>
            <p className="small">{l.sound}</p>
            <div className="alpha-ex">
              {l.examples.map((e) => (
                <button key={e} className="chip small" onClick={() => speak(e)} lang="es">
                  {e}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
