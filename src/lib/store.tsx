import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { SrsCard } from '../types'
import { newCard, review, type Grade } from './srs'
import { configureSpeech } from './speech'

export interface Settings {
  dailyGoal: number // XP per day
  accent: 'es-ES' | 'es-MX'
  rate: number
  unlockAll: boolean
}

export interface Progress {
  xp: number
  streak: number
  bestStreak: number
  lastActive: string | null // YYYY-MM-DD
  /** XP earned per day, for the activity chart. */
  history: Record<string, number>
  /** Best lesson score (0–100) per unit. */
  units: Record<string, number>
  srs: Record<string, SrsCard>
  settings: Settings
}

const KEY = 'vamos-progress-v1'

const DEFAULT: Progress = {
  xp: 0,
  streak: 0,
  bestStreak: 0,
  lastActive: null,
  history: {},
  units: {},
  srs: {},
  settings: { dailyGoal: 30, accent: 'es-ES', rate: 0.9, unlockAll: false },
}

export const today = (d = new Date()) => {
  const z = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`
}

function daysBetween(a: string, b: string) {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000)
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT
    const p = JSON.parse(raw) as Partial<Progress>
    return { ...DEFAULT, ...p, settings: { ...DEFAULT.settings, ...p.settings } }
  } catch {
    return DEFAULT
  }
}

/** If the user skipped a day, the displayed streak is 0. */
export function effectiveStreak(p: Progress): number {
  if (!p.lastActive) return 0
  return daysBetween(p.lastActive, today()) <= 1 ? p.streak : 0
}

interface Ctx {
  progress: Progress
  addXp: (n: number) => void
  completeUnit: (unitId: string, score: number) => void
  addWords: (ids: string[]) => void
  gradeWord: (id: string, grade: Grade) => void
  updateSettings: (s: Partial<Settings>) => void
  reset: () => void
  importData: (json: string) => boolean
}

const ProgressContext = createContext<Ctx | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(load)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(progress))
  }, [progress])

  useEffect(() => {
    configureSpeech({ accent: progress.settings.accent, rate: progress.settings.rate })
  }, [progress.settings.accent, progress.settings.rate])

  const addXp = useCallback((n: number) => {
    setProgress((p) => {
      const t = today()
      let streak = p.streak
      if (p.lastActive !== t) {
        streak = p.lastActive && daysBetween(p.lastActive, t) === 1 ? p.streak + 1 : 1
      }
      return {
        ...p,
        xp: p.xp + n,
        streak,
        bestStreak: Math.max(p.bestStreak, streak),
        lastActive: t,
        history: { ...p.history, [t]: (p.history[t] ?? 0) + n },
      }
    })
  }, [])

  const completeUnit = useCallback((unitId: string, score: number) => {
    setProgress((p) => ({ ...p, units: { ...p.units, [unitId]: Math.max(p.units[unitId] ?? 0, score) } }))
  }, [])

  const addWords = useCallback((ids: string[]) => {
    setProgress((p) => {
      const srs = { ...p.srs }
      const now = Date.now()
      for (const id of ids) if (!srs[id]) srs[id] = newCard(now)
      return { ...p, srs }
    })
  }, [])

  const gradeWord = useCallback((id: string, grade: Grade) => {
    setProgress((p) => ({ ...p, srs: { ...p.srs, [id]: review(p.srs[id] ?? newCard(), grade) } }))
  }, [])

  const updateSettings = useCallback((s: Partial<Settings>) => {
    setProgress((p) => ({ ...p, settings: { ...p.settings, ...s } }))
  }, [])

  const reset = useCallback(() => setProgress(DEFAULT), [])

  const importData = useCallback((json: string) => {
    try {
      const p = JSON.parse(json) as Progress
      if (typeof p.xp !== 'number' || typeof p.srs !== 'object') return false
      setProgress({ ...DEFAULT, ...p, settings: { ...DEFAULT.settings, ...p.settings } })
      return true
    } catch {
      return false
    }
  }, [])

  const value = useMemo(
    () => ({ progress, addXp, completeUnit, addWords, gradeWord, updateSettings, reset, importData }),
    [progress, addXp, completeUnit, addWords, gradeWord, updateSettings, reset, importData],
  )
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider')
  return ctx
}

export const PASS_SCORE = 70
