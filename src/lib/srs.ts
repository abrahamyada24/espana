import type { SrsCard } from '../types'

/**
 * Spaced repetition based on SM-2 (the algorithm behind Anki / SuperMemo).
 * Grades: 0 = Lupa, 3 = Sulit, 4 = Bisa, 5 = Mudah.
 */
export type Grade = 0 | 3 | 4 | 5

const DAY = 24 * 60 * 60 * 1000

export function newCard(now = Date.now()): SrsCard {
  return { ease: 2.5, interval: 0, reps: 0, due: now, lapses: 0 }
}

export function review(card: SrsCard, grade: Grade, now = Date.now()): SrsCard {
  let { ease, interval, reps, lapses } = card
  if (grade < 3) {
    reps = 0
    lapses += 1
    interval = 0
    // Show again in ~10 minutes.
    return { ease: Math.max(1.3, ease - 0.2), interval, reps, lapses, due: now + 10 * 60 * 1000 }
  }
  reps += 1
  if (reps === 1) interval = grade === 5 ? 3 : 1
  else if (reps === 2) interval = grade === 5 ? 7 : 4
  else interval = Math.round(interval * ease * (grade === 3 ? 0.8 : grade === 5 ? 1.3 : 1))
  ease = Math.max(1.3, ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)))
  return { ease, interval, reps, lapses, due: now + interval * DAY }
}

/** Human-readable preview of the next interval, for the grade buttons. */
export function previewInterval(card: SrsCard, grade: Grade): string {
  const next = review(card, grade, 0)
  if (next.interval === 0) return '10 mnt'
  if (next.interval < 30) return `${next.interval} hr`
  if (next.interval < 365) return `${Math.round(next.interval / 30)} bln`
  return `${(next.interval / 365).toFixed(1)} thn`
}

/** A word counts as "mastered" once its interval reaches 21 days (Anki convention). */
export const isMature = (c: SrsCard) => c.interval >= 21
