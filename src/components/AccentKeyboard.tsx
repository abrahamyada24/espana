import type { RefObject } from 'react'

const KEYS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡']

/** Inserts special Spanish characters at the cursor of the given input. */
export function AccentKeyboard({ inputRef, onInsert }: { inputRef: RefObject<HTMLInputElement | null>; onInsert: (v: string) => void }) {
  const insert = (ch: string) => {
    const el = inputRef.current
    if (!el) return
    const start = el.selectionStart ?? el.value.length
    const end = el.selectionEnd ?? el.value.length
    const next = el.value.slice(0, start) + ch + el.value.slice(end)
    onInsert(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + ch.length, start + ch.length)
    })
  }
  return (
    <div className="accent-kb" aria-label="Huruf khusus Spanyol">
      {KEYS.map((k) => (
        <button key={k} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => insert(k)}>
          {k}
        </button>
      ))}
    </div>
  )
}
