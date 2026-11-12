import { speak, ttsSupported } from '../lib/speech'

export function SpeakButton({ text, slow, size = 'md', label }: { text: string; slow?: boolean; size?: 'sm' | 'md' | 'lg'; label?: string }) {
  if (!ttsSupported()) return null
  return (
    <button
      type="button"
      className={`speak speak-${size}`}
      onClick={(e) => {
        e.stopPropagation()
        speak(text, { slow })
      }}
      aria-label={label ?? `Dengarkan: ${text}${slow ? ' (lambat)' : ''}`}
      title={slow ? 'Putar lambat' : 'Dengarkan'}
    >
      {slow ? '🐢' : '🔊'}
    </button>
  )
}
