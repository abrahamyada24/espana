import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ALL_WORDS, UNITS } from '../data/curriculum'
import { clean, stripAccents } from '../lib/text'
import { useProgress } from '../lib/store'
import { SpeakButton } from '../components/SpeakButton'

const unitMap = new Map(UNITS.map((u) => [u.id, u]))

export default function Dictionary() {
  const [q, setQ] = useState('')
  const { progress, addWords } = useProgress()
  const results = useMemo(() => {
    const n = stripAccents(clean(q))
    if (!n) return ALL_WORDS
    return ALL_WORDS.filter((w) => stripAccents(clean(w.es)).includes(n) || clean(w.id_).includes(n))
  }, [q])

  return (
    <div className="page">
      <h1>Kamus</h1>
      <p className="muted">{ALL_WORDS.length} kata & frasa dari semua unit. Cari dalam bahasa Spanyol atau Indonesia (tanpa aksen pun bisa).</p>
      <input className="text-input search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari… mis. 'casa' atau 'rumah'" autoFocus />
      <div className="dict-list">
        {results.map((w) => {
          const u = unitMap.get(w.unitId)!
          const inDeck = !!progress.srs[w.id]
          return (
            <div key={w.id} className="dict-row">
              <SpeakButton text={w.es} size="sm" />
              <div className="dict-main">
                <span lang="es" className="es">
                  {w.es}
                </span>
                <span className="muted"> · {w.id_}</span>
                {w.note && <span className="vocab-note"> {w.note}</span>}
              </div>
              <Link to={`/unit/${u.id}`} className={`level-pill lv-${u.level}`} title={u.title}>
                {u.level} {u.emoji}
              </Link>
              <button className="btn small" disabled={inDeck} onClick={() => addWords([w.id])} title="Tambah ke kartu ulasan">
                {inDeck ? '✓' : '+'}
              </button>
            </div>
          )
        })}
        {results.length === 0 && <p className="muted">Tidak ditemukan.</p>}
      </div>
    </div>
  )
}
