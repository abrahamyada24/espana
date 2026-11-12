import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { unitById } from '../data/curriculum'
import { useProgress } from '../lib/store'
import { isUnitUnlocked } from '../lib/units'
import { SpeakButton } from '../components/SpeakButton'
import { Rich } from '../components/Rich'
import { speak } from '../lib/speech'

type Tab = 'kosakata' | 'tatabahasa' | 'dialog'

export default function UnitPage() {
  const { unitId } = useParams()
  const unit = unitById(unitId ?? '')
  const { progress, addWords } = useProgress()
  const [tab, setTab] = useState<Tab>('kosakata')
  const [flipped, setFlipped] = useState<Set<string>>(new Set())
  const [showTranslation, setShowTranslation] = useState(false)

  if (!unit) return <Navigate to="/belajar" replace />
  if (!isUnitUnlocked(unit.id, progress)) return <Navigate to="/belajar" replace />

  const inDeck = unit.vocab.filter((w) => progress.srs[w.id]).length
  const toggle = (id: string) => {
    const s = new Set(flipped)
    if (s.has(id)) s.delete(id)
    else s.add(id)
    setFlipped(s)
  }

  async function playDialogue() {
    for (const line of unit!.dialogue) {
      await new Promise<void>((resolve) => {
        speak(line.es)
        const check = setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            clearInterval(check)
            setTimeout(resolve, 400)
          }
        }, 200)
      })
    }
  }

  return (
    <div className="page">
      <Link to="/belajar" className="back">
        ← Kurikulum
      </Link>
      <header className="unit-header">
        <span className="unit-emoji big">{unit.emoji}</span>
        <div>
          <span className={`level-pill lv-${unit.level}`}>{unit.level}</span>
          <h1>{unit.title}</h1>
          <p className="muted" lang="es">
            {unit.titleEs}
          </p>
        </div>
      </header>

      <div className="card cando">
        <h3>Setelah unit ini, kamu bisa…</h3>
        <ul>
          {unit.canDo.map((c) => (
            <li key={c}>✔️ {c}</li>
          ))}
        </ul>
        <div className="cando-actions">
          <Link to={`/latihan/${unit.id}`} className="btn primary big">
            ▶ Mulai latihan
          </Link>
          {inDeck < unit.vocab.length && (
            <button className="btn" onClick={() => addWords(unit.vocab.map((w) => w.id))}>
              + Tambah {unit.vocab.length - inDeck} kata ke kartu ulasan
            </button>
          )}
          {inDeck === unit.vocab.length && <span className="muted small">✅ Semua kata ada di kartu ulasan</span>}
        </div>
      </div>

      <div className="tabs" role="tablist">
        {(
          [
            ['kosakata', `Kosakata (${unit.vocab.length})`],
            ['tatabahasa', 'Tata bahasa'],
            ['dialog', 'Dialog'],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={`tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'kosakata' && (
        <>
          <p className="muted small">Klik kartu untuk melihat artinya. Ucapkan setiap kata dengan lantang setelah mendengarkannya.</p>
          <div className="vocab-grid">
            {unit.vocab.map((w) => (
              <button key={w.id} className={`vocab-card ${flipped.has(w.id) ? 'flipped' : ''}`} onClick={() => toggle(w.id)}>
                <span className="vocab-es" lang="es">
                  {w.es}
                </span>
                {flipped.has(w.id) ? (
                  <>
                    <span className="vocab-id">{w.id_}</span>
                    {w.note && <span className="vocab-note">{w.note}</span>}
                  </>
                ) : (
                  <span className="vocab-hint">ketuk untuk arti</span>
                )}
                <span className="vocab-audio">
                  <SpeakButton text={w.es} size="sm" />
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {tab === 'tatabahasa' && (
        <div className="card grammar">
          <h2>{unit.grammar.title}</h2>
          {unit.grammar.explanation.map((p, i) => (
            <p key={i}>
              <Rich text={p} />
            </p>
          ))}
          {unit.grammar.table && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    {unit.grammar.table[0].map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {unit.grammar.table.slice(1).map((row, i) => (
                    <tr key={i}>
                      {row.map((c, j) => (
                        <td key={j} lang="es">
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <h3>Contoh</h3>
          <ul className="examples">
            {unit.grammar.examples.map((e) => (
              <li key={e.es}>
                <SpeakButton text={e.es} size="sm" />
                <div>
                  <div lang="es" className="es">
                    {e.es}
                  </div>
                  <div className="muted small">{e.id_}</div>
                </div>
              </li>
            ))}
          </ul>
          {unit.grammar.tip && <div className="tip">💡 {unit.grammar.tip}</div>}
        </div>
      )}

      {tab === 'dialog' && (
        <div className="card">
          <div className="row-between">
            <button className="btn" onClick={playDialogue}>
              ▶ Putar seluruh dialog
            </button>
            <label className="toggle">
              <input type="checkbox" checked={showTranslation} onChange={(e) => setShowTranslation(e.target.checked)} /> Tampilkan terjemahan
            </label>
          </div>
          <div className="dialogue">
            {unit.dialogue.map((d, i) => (
              <div key={i} className={`bubble ${i % 2 ? 'right' : 'left'}`}>
                <div className="speaker">{d.speaker}</div>
                <div className="es" lang="es">
                  <SpeakButton text={d.es} size="sm" /> {d.es}
                </div>
                {showTranslation && <div className="muted small">{d.id_}</div>}
              </div>
            ))}
          </div>
          <p className="muted small">Tips: baca dialog dengan suara keras, lalu coba tutup terjemahannya dan pahami tanpa bantuan.</p>
        </div>
      )}
    </div>
  )
}
