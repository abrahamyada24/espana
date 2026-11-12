import { useRef } from 'react'
import { useProgress } from '../lib/store'
import { speak, sttSupported, ttsSupported } from '../lib/speech'

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
      <h1>Pengaturan</h1>

      <section className="card settings">
        <h3>🎯 Target harian</h3>
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

      <section className="card settings">
        <h3>🔊 Suara</h3>
        {!ttsSupported() && <p className="bad-text">Browser ini tidak mendukung text-to-speech.</p>}
        <label>
          Aksen
          <select value={s.accent} onChange={(e) => updateSettings({ accent: e.target.value as 'es-ES' | 'es-MX' })}>
            <option value="es-ES">🇪🇸 Spanyol (España)</option>
            <option value="es-MX">🇲🇽 Amerika Latin (México)</option>
          </select>
        </label>
        <label>
          Kecepatan: {s.rate.toFixed(2)}×
          <input type="range" min={0.5} max={1.2} step={0.05} value={s.rate} onChange={(e) => updateSettings({ rate: Number(e.target.value) })} />
        </label>
        <button className="btn" onClick={() => speak('¡Hola! Bienvenido a tu curso de español.')}>
          ▶ Tes suara
        </button>
        <p className="muted small">
          Pengenalan suara: {sttSupported() ? '✅ didukung' : '❌ tidak didukung (gunakan Chrome/Edge untuk latihan bicara)'}. Kualitas suara bergantung pada
          suara bahasa Spanyol yang terpasang di perangkatmu.
        </p>
      </section>

      <section className="card settings">
        <h3>🔓 Kurikulum</h3>
        <label className="toggle">
          <input type="checkbox" checked={s.unlockAll} onChange={(e) => updateSettings({ unlockAll: e.target.checked })} />
          Buka semua unit (untuk yang sudah punya dasar)
        </label>
      </section>

      <section className="card settings">
        <h3>💾 Data</h3>
        <p className="muted small">Progres disimpan di browser ini. Ekspor untuk cadangan atau pindah perangkat.</p>
        <div className="seg">
          <button className="btn" onClick={exportData}>
            ⬇ Ekspor
          </button>
          <button className="btn" onClick={() => fileRef.current?.click()}>
            ⬆ Impor
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={async (e) => {
              const f = e.target.files?.[0]
              if (!f) return
              alert(importData(await f.text()) ? 'Progres berhasil diimpor ✅' : 'File tidak valid ❌')
              e.target.value = ''
            }}
          />
          <button
            className="btn danger"
            onClick={() => {
              if (confirm('Hapus semua progres? Tindakan ini tidak bisa dibatalkan.')) reset()
            }}
          >
            🗑 Reset progres
          </button>
        </div>
      </section>
    </div>
  )
}
