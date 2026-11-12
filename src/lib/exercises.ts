import type { Exercise, Sentence, Unit, Word } from '../types'
import { ALL_WORDS } from '../data/curriculum'
import { sample, shuffle } from './text'

function distractors(word: Word, pool: Word[], field: 'es' | 'id_', n = 3): string[] {
  const others = pool.filter((w) => w.id !== word.id && w[field] !== word[field])
  const fallback = ALL_WORDS.filter((w) => w.id !== word.id && w[field] !== word[field])
  const picked = sample(others, n)
  while (picked.length < n) {
    const extra = sample(fallback, 1)[0]
    if (!picked.some((p) => p[field] === extra[field])) picked.push(extra)
  }
  return shuffle([word[field], ...picked.map((w) => w[field])])
}

const tokenize = (s: string) => s.split(/\s+/).filter(Boolean)

function orderExercise(s: Sentence, key: string, extraPool: string[]): Exercise {
  const tokens = tokenize(s.es)
  // Add one or two distractor words so the task isn't trivial.
  const extras = sample(
    extraPool.filter((t) => !tokens.includes(t)),
    tokens.length > 5 ? 1 : 2,
  )
  return { kind: 'order', key, prompt: s.id_, answer: s.es, tokens: shuffle([...tokens, ...extras]) }
}

/**
 * Builds a lesson following "present → practice → produce":
 * recognition first (multiple choice, listening), then recall (typing),
 * then sentence-level production (ordering, dictation, speaking).
 */
export function buildLesson(unit: Unit, opts: { speaking: boolean }): Exercise[] {
  const words = sample(unit.vocab, Math.min(8, unit.vocab.length))
  const recognition: Exercise[] = []
  const recall: Exercise[] = []
  words.forEach((w, i) => {
    const kind = i % 3
    if (kind === 0)
      recognition.push({ kind: 'mc-es', key: `mces-${w.id}`, prompt: w.es, audio: w.es, answer: w.id_, options: distractors(w, unit.vocab, 'id_'), wordId: w.id })
    else if (kind === 1)
      recognition.push({ kind: 'mc-id', key: `mcid-${w.id}`, prompt: w.id_, answer: w.es, options: distractors(w, unit.vocab, 'es'), wordId: w.id })
    else
      recognition.push({ kind: 'listen', key: `lis-${w.id}`, prompt: 'Dengarkan dan pilih kata yang benar', audio: w.es, answer: w.es, options: distractors(w, unit.vocab, 'es'), wordId: w.id })
  })
  sample(words, 4).forEach((w) =>
    recall.push({ kind: 'type', key: `type-${w.id}`, prompt: w.id_, answer: w.es, wordId: w.id }),
  )

  const sentences = shuffle(unit.sentences)
  const pool = unit.sentences.flatMap((s) => tokenize(s.es))
  const production: Exercise[] = []
  sentences.slice(0, 2).forEach((s, i) => production.push(orderExercise(s, `ord-${unit.id}-${i}`, pool)))
  if (sentences[2]) production.push({ kind: 'dictation', key: `dic-${unit.id}`, prompt: sentences[2].id_, audio: sentences[2].es, answer: sentences[2].es })
  if (opts.speaking && sentences[3])
    production.push({ kind: 'speak', key: `spk-${unit.id}`, prompt: sentences[3].id_, audio: sentences[3].es, answer: sentences[3].es })

  return [...shuffle(recognition), ...shuffle(recall), ...production]
}

/** Mixed test across several units, used for the CEFR level checkpoint. */
export function buildLevelTest(units: Unit[], opts: { speaking: boolean }): Exercise[] {
  const all = units.flatMap((u) => buildLesson(u, opts))
  const pick = (k: Exercise['kind'][], n: number) => sample(all.filter((e) => k.includes(e.kind)), n)
  return [
    ...pick(['mc-es', 'mc-id', 'listen'], 8),
    ...pick(['type'], 5),
    ...pick(['order'], 4),
    ...pick(['dictation'], 2),
    ...(opts.speaking ? pick(['speak'], 1) : []),
  ]
}
