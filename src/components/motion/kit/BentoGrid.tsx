'use client'

import { useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { usePlayOnce } from './usePlayOnce'
import { resolveMotionMode } from './useMotionMode'
import { drawAll } from './drawPath'
import { SPRING } from './spring'
import { mulberry32, hashSeed } from './seededRandom'
import type { BaseMotionProps } from './types'
import kit from './kit.module.css'
import styles from './BentoGrid.module.css'

export type BentoGridProps = BaseMotionProps & {
  /** the tiles - any elements; the consumer's className supplies the grid */
  children: ReactNode
  /** ms between tiles (default 120) */
  stagger?: number
  /** stroke-draw any SVG icon inside a tile after it lands (default true) */
  drawIcons?: boolean
  as?: 'div' | 'ul' | 'ol' | 'section'
  /** stable seed so the fly-in offsets are identical every visit */
  seed?: string
}

/**
 * Feature tiles that snap into place. Each direct child flies in from its own
 * seeded offset and slight rotation and settles with one small spring
 * overshoot, 120ms apart; then any line icon inside it draws itself. The
 * consumer's class owns the grid layout - this only moves the tiles. SSR and
 * reduced motion render the grid as-is.
 */
export function BentoGrid({ children, stagger = 120, drawIcons = true, as: Tag = 'div', seed = 'bento', className, style, threshold, onDone, static: isStatic }: BentoGridProps) {
  const ref = useRef<HTMLElement>(null)
  const { state, setDone } = usePlayOnce(ref, { threshold: threshold ?? 0.2, disabled: isStatic })
  const starts = useRef<string[]>([])

  useLayoutEffect(() => {
    const root = ref.current
    if (!root || isStatic || resolveMotionMode() !== 'full') return
    const rnd = mulberry32(hashSeed(seed))
    const gr = root.getBoundingClientRect()
    const cx = gr.left + gr.width / 2
    const tiles = Array.from(root.children) as HTMLElement[]
    starts.current = tiles.map((t) => {
      const r = t.getBoundingClientRect()
      const tcx = r.left + r.width / 2
      // inward start: left tiles come from the right, right tiles from the left; centred tiles rise straight up
      const dx = Math.abs(tcx - cx) < 8 ? 0 : (tcx < cx ? 1 : -1) * (18 + rnd() * 16)
      const dy = 26 + rnd() * 14
      const rot = (rnd() - 0.5) * 5
      const from = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(0.96)`
      t.style.opacity = '0'
      t.style.transform = from
      return from
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const root = ref.current
    if (state !== 'playing' || !root) return
    const tiles = Array.from(root.children) as HTMLElement[]
    const anims: Animation[] = []
    const timers: number[] = []
    tiles.forEach((t, i) => {
      const from = starts.current[i] ?? 'translateY(26px) scale(0.96)'
      const a = t.animate(
        [
          { opacity: 0, transform: from },
          { opacity: 1, transform: 'translate(0, 0) rotate(0) scale(1)' },
        ],
        { duration: 640, delay: i * stagger, easing: SPRING.SNAP, fill: 'forwards' },
      )
      a.onfinish = () => {
        t.style.opacity = ''
        t.style.transform = ''
        a.cancel()
      }
      anims.push(a)
      if (drawIcons) {
        timers.push(
          window.setTimeout(() => {
            anims.push(...drawAll(t.querySelector('svg'), { duration: 420, stagger: 50 }))
          }, i * stagger + 260),
        )
      }
    })
    timers.push(
      window.setTimeout(() => {
        setDone()
        onDone?.()
      }, (tiles.length - 1) * stagger + 640 + 520),
    )
    return () => {
      timers.forEach((t) => window.clearTimeout(t))
      anims.forEach((a) => a.playState === 'running' && a.finish())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <Tag ref={ref as never} className={[kit.kit, styles.root, className ?? ''].filter(Boolean).join(' ')} style={style as CSSProperties} data-motion="bento" data-motion-state={state}>
      {children}
    </Tag>
  )
}
