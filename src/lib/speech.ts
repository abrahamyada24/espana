/** Text-to-speech and speech recognition via the Web Speech API (no server needed). */

let cachedVoice: SpeechSynthesisVoice | null | undefined

function pickVoice(accent: 'es-ES' | 'es-MX'): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis?.getVoices() ?? []
  const spanish = voices.filter((v) => v.lang.toLowerCase().startsWith('es'))
  const exact = spanish.filter((v) => v.lang.replace('_', '-') === accent)
  const latam = accent === 'es-MX' ? spanish.filter((v) => /es[-_](mx|us|419|co|ar)/i.test(v.lang)) : []
  const pool = exact.length ? exact : latam.length ? latam : spanish
  // Prefer higher-quality voices when present.
  return pool.find((v) => /google|natural|premium|enhanced|neural/i.test(v.name)) ?? pool[0] ?? null
}

export const ttsSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window

if (ttsSupported()) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = undefined
  }
}

let currentAccent: 'es-ES' | 'es-MX' = 'es-ES'
let currentRate = 0.9

export function configureSpeech(opts: { accent: 'es-ES' | 'es-MX'; rate: number }) {
  if (opts.accent !== currentAccent) cachedVoice = undefined
  currentAccent = opts.accent
  currentRate = opts.rate
}

export function speak(text: string, opts: { slow?: boolean } = {}) {
  if (!ttsSupported()) return
  const synth = window.speechSynthesis
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  if (cachedVoice === undefined) cachedVoice = pickVoice(currentAccent)
  if (cachedVoice) u.voice = cachedVoice
  u.lang = cachedVoice?.lang ?? currentAccent
  u.rate = opts.slow ? Math.max(0.5, currentRate - 0.35) : currentRate
  synth.speak(u)
}

/* ─────────── Speech recognition ─────────── */

interface RecognitionLike {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}

function getRecognitionCtor(): (new () => RecognitionLike) | null {
  const w = window as unknown as Record<string, unknown>
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null) as (new () => RecognitionLike) | null
}

export const sttSupported = () => typeof window !== 'undefined' && !!getRecognitionCtor()

/** Listen once; resolves with the best transcripts (may be empty). */
export function listen(): { promise: Promise<string[]>; stop: () => void } {
  const Ctor = getRecognitionCtor()
  if (!Ctor) return { promise: Promise.reject(new Error('unsupported')), stop: () => {} }
  const rec = new Ctor()
  rec.lang = currentAccent
  rec.interimResults = false
  rec.maxAlternatives = 3
  const promise = new Promise<string[]>((resolve, reject) => {
    let done = false
    rec.onresult = (e) => {
      done = true
      const alts = Array.from(e.results[0] ?? []).map((r) => r.transcript)
      resolve(alts)
    }
    rec.onerror = (e) => {
      done = true
      reject(new Error(e.error))
    }
    rec.onend = () => {
      if (!done) resolve([])
    }
  })
  rec.start()
  return { promise, stop: () => rec.stop() }
}
