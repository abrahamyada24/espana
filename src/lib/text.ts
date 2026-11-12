/** Lowercase, trim, collapse whitespace, strip punctuation (¿?¡!.,;:"). */
export function clean(s: string): string {
  return s
    .toLowerCase()
    .replace(/[¿?¡!.,;:"«»()…]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function stripAccents(s: string): string {
  // Keep ñ distinct from n: it is a different letter in Spanish.
  return s.replace(/ñ/g, '\u0000').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\u0000/g, 'ñ')
}

const ARTICLES = /^(el|la|los|las|un|una|unos|unas) /

export type MatchResult = 'exact' | 'accent' | 'article' | 'close' | 'wrong'

/**
 * Compare a typed answer with the expected Spanish text.
 * - exact: identical after cleaning
 * - accent: correct apart from accent marks (counted correct, with a hint)
 * - article: correct word but missing/extra article (counted correct, with a hint)
 * - close: one small typo (counted wrong but shown as "almost")
 */
export function compareAnswer(given: string, expected: string): MatchResult {
  const g = clean(given)
  const e = clean(expected)
  if (!g) return 'wrong'
  if (g === e) return 'exact'
  if (stripAccents(g) === stripAccents(e)) return 'accent'
  const ga = g.replace(ARTICLES, '')
  const ea = e.replace(ARTICLES, '')
  if (ga === ea || stripAccents(ga) === stripAccents(ea)) return 'article'
  if (levenshtein(stripAccents(g), stripAccents(e)) <= (e.length > 6 ? 1 : 0)) return 'close'
  return 'wrong'
}

export function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0]
    dp[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j]
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = tmp
    }
  }
  return dp[b.length]
}

/** 0–100 similarity score, used for pronunciation feedback. */
export function similarity(a: string, b: string): number {
  const x = stripAccents(clean(a))
  const y = stripAccents(clean(b))
  if (!x && !y) return 100
  const d = levenshtein(x, y)
  return Math.max(0, Math.round((1 - d / Math.max(x.length, y.length)) * 100))
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function sample<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n)
}

/** Render **bold** and *italic* markers to React-friendly segments. */
export function tokenizeRich(s: string): { text: string; bold?: boolean; italic?: boolean }[] {
  const out: { text: string; bold?: boolean; italic?: boolean }[] = []
  const re = /\*\*(.+?)\*\*|\*(.+?)\*/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(s))) {
    if (m.index > last) out.push({ text: s.slice(last, m.index) })
    if (m[1] !== undefined) out.push({ text: m[1], bold: true })
    else out.push({ text: m[2], italic: true })
    last = re.lastIndex
  }
  if (last < s.length) out.push({ text: s.slice(last) })
  return out
}
