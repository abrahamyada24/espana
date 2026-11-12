import { useEffect, useRef, useState } from 'react'
import type { Exercise } from '../types'
import { compareAnswer, similarity, type MatchResult } from '../lib/text'
import { listen, speak, sttSupported } from '../lib/speech'
import { SpeakButton } from './SpeakButton'
import { AccentKeyboard } from './AccentKeyboard'

const TITLES: Record<Exercise['kind'], string> = {
  'mc-es': 'Apa artinya?',
  'mc-id': 'Pilih terjemahan Spanyolnya',
  listen: 'Dengarkan & pilih',
  type: 'Tulis dalam bahasa Spanyol',
  order: 'Susun kalimat',
  dictation: 'Dikte: tulis apa yang kamu dengar',
  speak: 'Ucapkan kalimat ini',
}

interface Feedback {
  correct: boolean
  message: string
}

const MATCH_MSG: Record<MatchResult, string> = {
  exact: '¡Perfecto! 🎉',
  accent: 'Benar! Tapi perhatikan tanda aksennya.',
  article: 'Benar! Ingat artikelnya juga.',
  close: 'Hampir! Ada salah ketik kecil.',
  wrong: 'Belum tepat.',
}

const PRAISE = ['¡Muy bien!', '¡Excelente!', '¡Genial!', '¡Perfecto!', '¡Fantástico!']

export function ExerciseView({ ex, onDone }: { ex: Exercise; onDone: (correct: boolean) => void }) {
  const [choice, setChoice] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [picked, setPicked] = useState<number[]>([])
  const [heard, setHeard] = useState<string | null>(null)
  const [listening, setListening] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const stopRef = useRef<() => void>(() => {})

  // Auto-play audio for listening-based exercises.
  useEffect(() => {
    if ((ex.kind === 'listen' || ex.kind === 'dictation' || ex.kind === 'mc-es') && ex.audio) {
      const t = setTimeout(() => speak(ex.audio!), 250)
      return () => clearTimeout(t)
    }
  }, [ex])

  useEffect(() => () => stopRef.current(), [])

  const isMc = ex.kind === 'mc-es' || ex.kind === 'mc-id' || ex.kind === 'listen'

  const canCheck =
    !feedback &&
    ((isMc && choice !== null) ||
      ((ex.kind === 'type' || ex.kind === 'dictation') && text.trim().length > 0) ||
      (ex.kind === 'order' && picked.length > 0) ||
      (ex.kind === 'speak' && heard !== null))

  function check() {
    if (!canCheck) return
    let fb: Feedback
    const praise = PRAISE[Math.floor(Math.random() * PRAISE.length)]
    if (isMc) {
      const ok = choice === ex.answer
      fb = { correct: ok, message: ok ? praise : 'Belum tepat.' }
    } else if (ex.kind === 'type' || ex.kind === 'dictation') {
      const m = compareAnswer(text, ex.answer)
      const ok = m === 'exact' || m === 'accent' || m === 'article'
      fb = { correct: ok, message: m === 'exact' ? praise : MATCH_MSG[m] }
    } else if (ex.kind === 'order') {
      const sentence = picked.map((i) => ex.tokens![i]).join(' ')
      const m = compareAnswer(sentence, ex.answer)
      const ok = m === 'exact' || m === 'accent'
      fb = { correct: ok, message: ok ? praise : 'Urutannya belum tepat.' }
    } else {
      const score = similarity(heard ?? '', ex.answer)
      const ok = score >= 70
      fb = { correct: ok, message: ok ? `${praise} Kemiripan ${score}%` : `Kemiripan ${score}%. Coba dengarkan lagi.` }
    }
    setFeedback(fb)
    if (ex.kind !== 'listen' && ex.kind !== 'dictation' && ex.audio) speak(ex.audio)
    else if (ex.kind === 'mc-id' || ex.kind === 'type') speak(ex.answer)
  }

  async function record() {
    if (listening) {
      stopRef.current()
      return
    }
    setListening(true)
    setHeard(null)
    const { promise, stop } = listen()
    stopRef.current = stop
    try {
      const alts = await promise
      // Use the best-matching alternative.
      const best = alts.sort((a, b) => similarity(b, ex.answer) - similarity(a, ex.answer))[0]
      setHeard(best ?? '')
    } catch (e) {
      setHeard('')
      if ((e as Error).message === 'not-allowed') alert('Izin mikrofon ditolak. Aktifkan di pengaturan browser.')
    } finally {
      setListening(false)
    }
  }

  // Keyboard: Enter = check / continue, 1-4 = choose option.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        if (feedback) onDone(feedback.correct)
        else check()
      } else if (isMc && !feedback && /^[1-4]$/.test(e.key) && !(e.target instanceof HTMLInputElement)) {
        const opt = ex.options?.[Number(e.key) - 1]
        if (opt) setChoice(opt)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="exercise">
      <p className="ex-title">{TITLES[ex.kind]}</p>

      {/* Prompt */}
      {ex.kind === 'mc-es' && (
        <div className="ex-prompt es">
          <SpeakButton text={ex.prompt} size="lg" /> {ex.prompt}
        </div>
      )}
      {(ex.kind === 'mc-id' || ex.kind === 'type' || ex.kind === 'order') && <div className="ex-prompt">{ex.prompt}</div>}
      {(ex.kind === 'listen' || ex.kind === 'dictation') && (
        <div className="ex-prompt listen-row">
          <SpeakButton text={ex.audio!} size="lg" />
          <SpeakButton text={ex.audio!} size="lg" slow />
          {ex.kind === 'dictation' && feedback && <span className="muted"> {ex.prompt}</span>}
        </div>
      )}
      {ex.kind === 'speak' && (
        <div className="ex-prompt es">
          <SpeakButton text={ex.answer} size="lg" /> {ex.answer}
          <div className="muted small">{ex.prompt}</div>
        </div>
      )}

      {/* Answer area */}
      {isMc && (
        <div className="options">
          {ex.options!.map((o, i) => {
            let cls = 'option'
            if (choice === o) cls += ' selected'
            if (feedback && o === ex.answer) cls += ' correct'
            else if (feedback && choice === o) cls += ' wrong'
            return (
              <button
                key={o}
                className={cls}
                disabled={!!feedback}
                onClick={() => {
                  setChoice(o)
                  if (ex.kind !== 'mc-es') speak(o)
                }}
              >
                <span className="kbd">{i + 1}</span> {o}
              </button>
            )
          })}
        </div>
      )}

      {(ex.kind === 'type' || ex.kind === 'dictation') && (
        <div className="type-area">
          <input
            ref={inputRef}
            className={`text-input ${feedback ? (feedback.correct ? 'correct' : 'wrong') : ''}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ketik dalam bahasa Spanyol…"
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            lang="es"
            disabled={!!feedback}
          />
          {!feedback && <AccentKeyboard inputRef={inputRef} onInsert={setText} />}
        </div>
      )}

      {ex.kind === 'order' && (
        <div className="order">
          <div className={`order-answer ${feedback ? (feedback.correct ? 'correct' : 'wrong') : ''}`}>
            {picked.map((ti, pi) => (
              <button key={pi} className="chip" disabled={!!feedback} onClick={() => setPicked(picked.filter((_, j) => j !== pi))}>
                {ex.tokens![ti]}
              </button>
            ))}
          </div>
          <div className="order-bank">
            {ex.tokens!.map((t, i) => (
              <button
                key={i}
                className="chip"
                disabled={picked.includes(i) || !!feedback}
                onClick={() => {
                  setPicked([...picked, i])
                  speak(t)
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {ex.kind === 'speak' && (
        <div className="speak-area">
          {sttSupported() ? (
            <>
              <button className={`mic ${listening ? 'on' : ''}`} onClick={record} disabled={!!feedback}>
                {listening ? '⏹️ Berhenti' : '🎙️ Tekan & bicara'}
              </button>
              {heard !== null && (
                <p className="heard">
                  Terdengar: <strong>{heard || '(tidak terdengar apa pun)'}</strong>
                </p>
              )}
            </>
          ) : (
            <p className="muted">Browser ini belum mendukung pengenalan suara (coba Chrome atau Edge). Ucapkan dengan lantang, lalu lanjutkan.</p>
          )}
        </div>
      )}

      {/* Footer */}
      <div className={`ex-footer ${feedback ? (feedback.correct ? 'ok' : 'bad') : ''}`}>
        {feedback ? (
          <>
            <div className="fb">
              <strong>{feedback.message}</strong>
              {(!feedback.correct || ex.kind === 'dictation' || ex.kind === 'type') && (
                <div className="fb-answer">
                  Jawaban: <span lang="es">{ex.answer}</span>
                </div>
              )}
            </div>
            <button className="btn primary" onClick={() => onDone(feedback.correct)} autoFocus>
              Lanjut
            </button>
          </>
        ) : (
          <>
            {ex.kind === 'speak' && !sttSupported() ? (
              <button className="btn" onClick={() => onDone(true)}>
                Lewati
              </button>
            ) : ex.kind === 'speak' ? (
              <button className="btn ghost" onClick={() => onDone(true)}>
                Tidak bisa bicara sekarang
              </button>
            ) : (
              <span />
            )}
            <button className="btn primary" onClick={check} disabled={!canCheck}>
              Periksa
            </button>
          </>
        )}
      </div>
    </div>
  )
}
