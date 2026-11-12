import { useRef } from 'react'
import { useProgress } from '../lib/store'
import { speak, sttSupported, ttsSupported } from '../lib/speech'
import { Icon } from '../components/Icon'

export default function Settings() {
  const { progress, updateSettings, reset, importData } = useProgress()
  const s = progress.settings
  const fileRef = useRef<HTMLInputElement>(null)

  function exportData() {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `vamos-progres-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="page narrow">
      <header className="page-head">
        <p className="kicker">Pengaturan</p>
        <h1 className="display">Preferensi</h1>
      </header>

      <section className="settings">
        <h2 className="section-title">Target harian</h2>
        <div className="seg">
          {[
            [10, 'Santai'],
            [30, 'Normal'],
            [50, 'Serius'],
            [100, 'Intens'],
          ].map(([v, l]) => (
            <button key={v} className={`chip ${s.dailyGoal === v ? 'active' : ''}`} onClick={() => updateSettings({ dailyGoal: v as number })}>
              {l} · {v} XP
            </button>
          ))}
        </div>
      </section>

      <section className="settings">
        <h2 className="section-title">Suara</h2>
        {!ttsSupported() && <p className="bad-text">Browser ini tidak mendukung text-to-speech.</p>}
        <label>
          Aksen
          <select value={s.accent} onChange={(e) => updateSettings({ accent: e.target.value as 'es-ES' | 'es-MX' })}>
            <option value="es-ES">Spanyol (España)</option>
            <option value="es-MX">Amerika Latin (México)</option>
          </select>
        </label>
        <label>
          Kecepatan: {s.rate.toFixed(2)}×
          <input type="range" min={0.5} max={1.2} step={0.05} value={s.rate} onChange={(e) => updateSettings({ rate: Number(e.target.value) })} />
        </label>
        <button className="btn" onClick={() => speak('¡Hola! Bienvenido a tu curso de español.')}>
          <Icon name="play" size={16} /> Tes suara
        </button>
        <p className="muted small">
          Pengenalan suara: {sttSupported() ? 'didukung' : 'tidak didukung (gunakan Chrome/Edge untuk latihan bicara)'}. Kualitas suara bergantung pada
          suara bahasa Spanyol yang terpasang di perangkatmu.
        </p>
      </section>

      <section className="settings">
        <h2 className="section-title">Kurikulum</h2>
        <label className="toggle">
          <input type="checkbox" checked={s.unlockAll} onChange={(e) => updateSettings({ unlockAll: e.target.checked })} />
          Buka semua unit (untuk yang sudah punya dasar)
        </label>
      </section>

      <section className="settings">
        <h2 className="section-title">Data</h2>
        <p className="muted small">Progres disimpan di browser ini. Ekspor untuk cadangan atau pindah perangkat.</p>
        <div className="seg">
          <button className="btn" onClick={exportData}>
            <Icon name="download" size={16} /> Ekspor
          </button>
          <button className="btn" onClick={() => fileRef.current?.click()}>
            <Icon name="upload" size={16} /> Impor
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={async (e) => {
              const f = e.target.files?.[0]
              if (!f) return
              alert(importData(await f.text()) ? 'Progres berhasil diimpor.' : 'File tidak valid.')
              e.target.value = ''
            }}
          />
          <button
            className="btn danger"
            onClick={() => {
              if (confirm('Hapus semua progres? Tindakan ini tidak bisa dibatalkan.')) reset()
            }}
          >
            <Icon name="trash" size={16} /> Reset progres
          </button>
        </div>
      </section>
    </div>
  )
}
