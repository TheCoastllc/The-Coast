import type { CSSProperties } from 'react'

/** Lifecycle of one kit primitive. `static` = final state rendered, no motion. */
export type MotionState = 'idle' | 'playing' | 'done' | 'static'

/** `full` plays motion, `reduced` honours prefers-reduced-motion, `off` is the ?motion=off escape. */
export type MotionMode = 'full' | 'reduced' | 'off'

export type BaseMotionProps = {
  className?: string
  style?: CSSProperties
  /** Fraction of the element that must be visible before it plays (default 0.3, clamped for tall elements). */
  threshold?: number
  onDone?: () => void
  /** Force the final state with no motion. */
  static?: boolean
}
