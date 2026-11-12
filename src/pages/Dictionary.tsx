import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ALL_WORDS, UNITS, unitNo } from '../data/curriculum'
import { Icon } from '../components/Icon'
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
      <header className="page-head">
        <p className="kicker">Kamus</p>
        <h1 className="display">Diccionario</h1>
        <p className="lede">{ALL_WORDS.length} kata dan frasa dari semua unit. Cari dalam bahasa Spanyol atau Indonesia, tanpa aksen pun bisa.</p>
      </header>
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
              <Link to={`/unit/${u.id}`} className="tag" title={u.title}>
                {u.level} · {unitNo(u.id)}
              </Link>
              <button className="btn small" disabled={inDeck} onClick={() => addWords([w.id])} title="Tambah ke kartu ulasan">
                <Icon name={inDeck ? 'check' : 'plus'} size={14} />
              </button>
            </div>
          )
        })}
        {results.length === 0 && <p className="muted">Tidak ditemukan.</p>}
      </div>
    </div>
  )
}
