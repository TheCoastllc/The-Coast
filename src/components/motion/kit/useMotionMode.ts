'use client'

import { useEffect, useState } from 'react'
import type { MotionMode } from './types'

const KEY = 'coast-motion'
let cached: MotionMode | null = null
let explicit = false

/**
 * The one answer to "should anything move?". Resolved once per page load:
 *   ?motion=off | ?motion=full  -> explicit, remembered for the session
 *   prefers-reduced-motion      -> 'reduced'
 *   otherwise                   -> 'full'
 * Safe to call during layout effects (synchronous). Returns 'full' on the server,
 * which never matters because every primitive server-renders its final state.
 */
export function resolveMotionMode(): MotionMode {
  if (typeof window === 'undefined') return 'full'
  if (cached) return cached
  let mode: MotionMode | null = null
  try {
    const q = new URLSearchParams(window.location.search).get('motion')
    if (q === 'off' || q === 'full') {
      mode = q
      explicit = true
      sessionStorage.setItem(KEY, q)
    } else {
      const s = sessionStorage.getItem(KEY)
      if (s === 'off' || s === 'full') {
        mode = s
        explicit = true
      }
    }
  } catch {}
  if (!mode) mode = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'full'
  cached = mode
  document.documentElement.dataset.motionMode = mode
  return mode
}

/** React view of the mode. 'full' until mounted (SSR renders final states anyway). */
export function useMotionMode(): MotionMode {
  const [mode, setMode] = useState<MotionMode>('full')
  useEffect(() => {
    setMode(resolveMotionMode())
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => {
      if (explicit) return
      cached = mq.matches ? 'reduced' : 'full'
      document.documentElement.dataset.motionMode = cached
      setMode(cached)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return mode
}
