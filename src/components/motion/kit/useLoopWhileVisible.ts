'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import { resolveMotionMode } from './useMotionMode'

/** IntersectionObserver boolean. True when IO is unavailable. */
export function useVisible(ref: RefObject<HTMLElement | null>, rootMargin = '0px'): boolean {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])
  return visible
}

/** True while the document is visible (tab in front). */
export function usePageVisible(): boolean {
  const [vis, setVis] = useState(true)
  useEffect(() => {
    const on = () => setVis(document.visibilityState === 'visible')
    on()
    document.addEventListener('visibilitychange', on)
    return () => document.removeEventListener('visibilitychange', on)
  }, [])
  return vis
}

type LoopOpts = { enabled?: boolean; rootMargin?: string }

/**
 * A requestAnimationFrame loop that runs ONLY while the element intersects,
 * the tab is visible, motion mode is `full`, and `enabled` is true. The tick
 * receives (dt ms, elapsed ms). The loop sleeps completely otherwise, so it
 * never taxes audits or battery.
 */
export function useLoopWhileVisible(
  ref: RefObject<HTMLElement | null>,
  tick: (dt: number, t: number) => void,
  { enabled = true, rootMargin = '0px' }: LoopOpts = {},
) {
  const visible = useVisible(ref, rootMargin)
  const pageVisible = usePageVisible()
  const tickRef = useRef(tick)
  tickRef.current = tick
  const active = enabled && visible && pageVisible

  useEffect(() => {
    if (!active || resolveMotionMode() !== 'full') return
    let raf = 0
    let last = performance.now()
    const start = last
    const loop = (now: number) => {
      const dt = Math.min(100, now - last)
      last = now
      tickRef.current(dt, now - start)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [active])

  return { visible, active }
}
