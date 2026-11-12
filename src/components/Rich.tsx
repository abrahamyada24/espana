import { tokenizeRich } from '../lib/text'

export function Rich({ text }: { text: string }) {
  return (
    <>
      {tokenizeRich(text).map((t, i) =>
        t.bold ? <strong key={i}>{t.text}</strong> : t.italic ? <em key={i}>{t.text}</em> : <span key={i}>{t.text}</span>,
      )}
    </>
  )
}
