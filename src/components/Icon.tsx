const PATHS = {
  volume: 'M11 5 6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14',
  mic: 'M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3zM5 10v1a7 7 0 0 0 14 0v-1M12 18v4',
  stop: 'M6 6h12v12H6z',
  x: 'M18 6 6 18M6 6l12 12',
  right: 'M5 12h14M13 6l6 6-6 6',
  left: 'M19 12H5M11 6l-6 6 6 6',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
  check: 'M20 6 9 17l-5-5',
  home: 'M3 11 12 3l9 8M5 10v10h14V10',
  book: 'M2 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H2zM22 4h-7a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h8z',
  cards: 'M3 7h14v14H3zM7 3h14v14',
  table: 'M3 4h18v16H3zM3 10h18M3 15h18M9 4v16',
  wave: 'M3 10v4M7 7v10M11 3v18M15 7v10M19 10v4',
  search: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM20 20l-4-4',
  sliders: 'M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1M15 4v4M7 10v4M15 16v4',
  download: 'M12 3v12M6 11l6 6 6-6M4 21h16',
  upload: 'M12 21V9M6 13l6-6 6 6M4 3h16',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  repeat: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5',
  play: 'M7 4v16l13-8z',
  plus: 'M12 5v14M5 12h14',
} as const

export type IconName = keyof typeof PATHS

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
