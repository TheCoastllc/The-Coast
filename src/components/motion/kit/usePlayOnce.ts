'use client'

import { useCallback, useEffect, useState, type RefObject } from 'react'
import { resolveMotionMode } from './useMotionMode'
import type { MotionState } from './types'

type Opts = {
  /** Visible fraction required (default 0.3). Clamped so tall elements still fire on phones. */
  threshold?: number
  rootMargin?: string
  /** Skip motion entirely (renders the final state). */
  disabled?: boolean
}

/**
 * Plays a primitive exactly once when it scrolls into view.
 *   idle -> playing (on intersection) -> done (the primitive calls setDone)
 *   static when motion is reduced/off or the primitive is disabled.
 * Pure IntersectionObserver: no ScrollTrigger, no scroll listeners.
 */
export function usePlayOnce(ref: RefObject<HTMLElement | null>, opts: Opts = {}) {
  const { threshold = 0.3, rootMargin = '0px 0px -10% 0px', disabled = false } = opts
  const [state, setState] = useState<MotionState>('idle')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (disabled || resolveMotionMode() !== 'full') {
      setState('static')
      return
    }
    if (typeof IntersectionObserver === 'undefined') {
      setState('done')
      return
    }
    // a 1400px-tall section can never be 30% visible on an 844px phone
    const ratio = Math.max(0.05, Math.min(threshold, (window.innerHeight * 0.6) / Math.max(1, el.offsetHeight)))
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0]
        // already above the viewport (jumped past via anchor / scrollIntoView): play, don't strand at the start state
        const passed = !e.isIntersecting && e.boundingClientRect.bottom < 0
        if (passed || (e.isIntersecting && e.intersectionRatio >= ratio - 1e-4)) {
          setState((s) => (s === 'idle' ? 'playing' : s))
          io.disconnect()
        }
      },
      { threshold: [0, ratio], rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold, rootMargin, disabled])

  const setDone = useCallback(() => setState((s) => (s === 'playing' ? 'done' : s)), [])
  return { state, setDone, playing: state === 'playing' }
}
