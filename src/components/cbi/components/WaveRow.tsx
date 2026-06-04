import { cn } from '@/lib/utils'

type WaveRowProps = {
  count: number
  total?: number
  color: string
  /** glyph width in px */
  size?: number
  gap?: number
  className?: string
}

/**
 * Wave rating: a row of clean sine-wave marks. `count` waves light up in `color`
 * with a soft glow; the rest stay a quiet wash. Refined replacement for the
 * repeated brand-logo glyphs - reads as waves, not a logo, not a bar.
 */
export function WaveRow({ count, total = 5, color, size = 22, gap, className }: WaveRowProps) {
  const w = size
  const h = Math.round(size * 0.62)
  const space = gap ?? Math.max(2, Math.round(size * 0.16))
  return (
    <div
      className={cn('inline-flex items-center', className)}
      style={{ gap: space }}
      aria-label={`Wave rating ${count} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => {
        const active = i < count
        return (
          <svg
            key={i}
            width={w}
            height={h}
            viewBox="0 0 22 13"
            fill="none"
            style={{ overflow: 'visible', flex: 'none' }}
          >
            <path
              d="M1 6.5 Q 6 0.5 11 6.5 T 21 6.5"
              stroke={active ? color : 'rgba(255,255,255,0.22)'}
              strokeWidth={1.7}
              strokeLinecap="round"
              style={{
                filter: active ? `drop-shadow(0 0 ${Math.round(size * 0.3)}px ${color}66)` : 'none',
                transition: 'stroke 0.5s ease',
              }}
            />
          </svg>
        )
      })}
    </div>
  )
}
