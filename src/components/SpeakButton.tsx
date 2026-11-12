import { speak, ttsSupported } from '../lib/speech'
import { Icon } from './Icon'

export function SpeakButton({ text, slow, size = 'md', label }: { text: string; slow?: boolean; size?: 'sm' | 'md' | 'lg'; label?: string }) {
  if (!ttsSupported()) return null
  return (
    <button
      type="button"
      className={`speak speak-${size} ${slow ? 'speak-slow' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        speak(text, { slow })
      }}
      aria-label={label ?? `Dengarkan: ${text}${slow ? ' (lambat)' : ''}`}
      title={slow ? 'Putar lambat' : 'Dengarkan'}
    >
      {slow ? <span className="slow-label">0.6×</span> : <Icon name="volume" size={size === 'lg' ? 24 : size === 'sm' ? 15 : 18} />}
    </button>
  )
}
