import { cn } from '@/lib/utils'

type WaveRowProps = {
  count: number
  total?: number
  color: string
  /** max bar height in px (the meter scales to this) */
  size?: number
  gap?: number
  className?: string
}

/**
 * Wave-strength meter: a row of increasing-height bars (a rising swell / level
 * meter). `count` bars light up in `color` with a soft glow, the rest stay a
 * quiet wash. Replaces the repeated brand-logo glyphs - cleaner and premium.
 */
export function WaveRow({ count, total = 5, color, size = 28, gap, className }: WaveRowProps) {
  const maxH = size
  const minH = Math.max(4, size * 0.36)
  const barW = Math.max(2, Math.round(size * 0.15))
  const space = gap ?? Math.max(3, Math.round(size * 0.2))
  return (
    <div
      className={cn('inline-flex items-end', className)}
      style={{ gap: space, height: maxH }}
      aria-label={`Wave rating ${count} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => {
        const active = i < count
        const h = total > 1 ? minH + (maxH - minH) * (i / (total - 1)) : maxH
        return (
          <span
            key={i}
            style={{
              width: barW,
              height: h,
              borderRadius: barW,
              background: active ? color : 'rgba(255,255,255,0.16)',
              boxShadow: active ? `0 0 ${Math.round(size * 0.45)}px ${color}55` : 'none',
              transition: 'background 0.5s ease, box-shadow 0.5s ease',
            }}
          />
        )
      })}
    </div>
  )
}
