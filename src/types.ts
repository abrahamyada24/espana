export type Level = 'A1' | 'A2' | 'B1'

export interface Word {
  /** Unique id, e.g. "a1-saludos-3" (filled in automatically). */
  id: string
  es: string
  id_: string
  /** Optional hint: word class, gender, register… */
  note?: string
}

export interface Sentence {
  es: string
  id_: string
}

export interface Grammar {
  title: string
  /** Paragraphs of explanation in Indonesian. Supports **bold**. */
  explanation: string[]
  /** Optional table: first row is the header. */
  table?: string[][]
  examples: Sentence[]
  tip?: string
}

export interface Unit {
  id: string
  level: Level
  title: string
  titleEs: string
  /** CEFR-style "can do" statements. */
  canDo: string[]
  vocab: Word[]
  grammar: Grammar
  sentences: Sentence[]
  /** A short dialogue to read & listen to. */
  dialogue: { speaker: string; es: string; id_: string }[]
}

export interface SrsCard {
  ease: number
  interval: number // days
  reps: number
  due: number // epoch ms
  lapses: number
}

export type ExerciseKind = 'mc-es' | 'mc-id' | 'listen' | 'type' | 'order' | 'speak' | 'dictation'

export interface Exercise {
  kind: ExerciseKind
  key: string
  prompt: string
  /** Spanish text to read aloud (for listen / dictation / speak). */
  audio?: string
  answer: string
  options?: string[]
  /** Shuffled tokens for word ordering. */
  tokens?: string[]
  wordId?: string
}
