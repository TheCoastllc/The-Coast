import { WaveIcon } from './WaveIcon'
import { cn } from '@/lib/utils'

type WaveRowProps = {
  count: number
  total?: number
  color: string
  size?: number
  gap?: number
  dimClassName?: string
  className?: string
}

/**
 * Horizontal row of wave marks. `count` icons are tinted with `color`,
 * the rest fade to `dimClassName` (defaults to a subtle white wash).
 * Replaces the vertical `~` stack from the prototype.
 */
export function WaveRow({
  count,
  total = 5,
  color,
  size = 28,
  gap = 6,
  dimClassName = 'text-white/25',
  className,
}: WaveRowProps) {
  return (
    <div
      className={cn('inline-flex items-center', className)}
      style={{ gap }}
      aria-label={`Wave rating ${count} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => {
        const active = i < count
        return (
          <WaveIcon
            key={i}
            width={size}
            height={size}
            className={cn('transition-colors duration-500', !active && dimClassName)}
            style={active ? { color } : undefined}
          />
        )
      })}
    </div>
  )
}
