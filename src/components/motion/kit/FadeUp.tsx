'use client'

import { useLayoutEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { resolveMotionMode } from './useMotionMode'
import { BEZIER } from './tween'

type Props = Omit<HTMLAttributes<HTMLElement>, 'children' | 'className' | 'style'> & {
  children: ReactNode
  as?: 'div' | 'section' | 'p' | 'span'
  className?: string
  style?: CSSProperties
  delay?: number
  duration?: number
  distance?: number
}

/** Mount-time rise + fade for panels that appear after an action (done states). SSR/reduced = visible. */
export function FadeUp({ children, as: Tag = 'div', className, style, delay = 0, duration = 420, distance = 12, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || resolveMotionMode() !== 'full') return
    const a = el.animate(
      [
        { opacity: 0, transform: `translateY(${distance}px)` },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration, delay, easing: BEZIER.outCubic, fill: 'both' },
    )
    a.onfinish = () => a.cancel()
    return () => a.cancel()
  }, [delay, duration, distance])
  return (
    <Tag ref={ref as never} className={className} style={style} data-motion="fadeup" {...rest}>
      {children}
    </Tag>
  )
}
