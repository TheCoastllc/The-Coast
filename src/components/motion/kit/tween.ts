export type EaseFn = (t: number) => number

export const EASES: Record<'linear' | 'outCubic' | 'outQuart' | 'outExpo' | 'inOutCubic', EaseFn> = {
  linear: (t) => t,
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  outQuart: (t) => 1 - Math.pow(1 - t, 4),
  outExpo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
}

/** The same curves as CSS/WAAPI timing functions. */
export const BEZIER = {
  outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  outCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
  outQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
  inOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
} as const

type TweenOpts = {
  from?: number
  to?: number
  duration?: number
  delay?: number
  ease?: EaseFn
  onUpdate: (v: number, p: number) => void
  onComplete?: () => void
}

/** One rAF-driven numeric tween. Returns a cancel handle. */
export function tween({ from = 0, to = 1, duration = 1000, delay = 0, ease = EASES.outExpo, onUpdate, onComplete }: TweenOpts) {
  let raf = 0
  let cancelled = false
  const start = performance.now() + delay
  const step = (now: number) => {
    if (cancelled) return
    const p = Math.min(1, Math.max(0, (now - start) / duration))
    onUpdate(from + (to - from) * ease(p), p)
    if (p < 1) raf = requestAnimationFrame(step)
    else onComplete?.()
  }
  raf = requestAnimationFrame(step)
  return {
    cancel() {
      cancelled = true
      cancelAnimationFrame(raf)
    },
  }
}

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
