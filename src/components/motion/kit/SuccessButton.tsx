'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { resolveMotionMode, useMotionMode } from './useMotionMode'
import { drawPath } from './drawPath'
import { burst as fireBurst } from './burst'
import { BEZIER } from './tween'
import kit from './kit.module.css'
import styles from './SuccessButton.module.css'

export type SuccessState = 'idle' | 'sending' | 'sent' | 'error'

export type SuccessButtonProps = {
  /** driven by the owning form */
  state: SuccessState
  label: ReactNode
  sendingLabel?: string
  successLabel?: string
  /** the page's own button class (keeps its colours, type, padding) */
  className?: string
  /** small seeded gold/teal burst on success (default true) */
  burst?: boolean
  /** ms after `sent` before onDone fires (default 1100; 0 under reduced motion) */
  doneDelay?: number
  onDone?: () => void
  type?: 'submit' | 'button'
  disabled?: boolean
  onClick?: () => void
}

/**
 * The last click on the page. idle -> sending: the button morphs into a circle
 * with a spinning arc. sending -> sent: it fills accent, a check draws in with
 * a small pop and a restrained burst, then `onDone` lets the form show its
 * success panel. error / idle snap back. Reduced motion: label text swaps,
 * no morph, no burst, onDone immediately.
 */
export function SuccessButton({
  state,
  label,
  sendingLabel = 'Sending',
  successLabel = 'Sent',
  className,
  burst = true,
  doneDelay = 1100,
  onDone,
  type = 'submit',
  disabled,
  onClick,
}: SuccessButtonProps) {
  const mode = useMotionMode()
  const wrapRef = useRef<HTMLSpanElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const checkRef = useRef<SVGPathElement>(null)
  const burstRef = useRef<HTMLSpanElement>(null)
  const sizeRef = useRef<{ w: number; h: number } | null>(null)
  const [morph, setMorph] = useState<'none' | 'fixed' | 'circle'>('none')
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  // Measure once the real button exists so the wrapper can hold its footprint.
  useLayoutEffect(() => {
    const btn = btnRef.current
    const wrap = wrapRef.current
    if (!btn || !wrap) return
    if (state === 'sending' && !sizeRef.current && resolveMotionMode() === 'full') {
      const r = btn.getBoundingClientRect()
      sizeRef.current = { w: Math.ceil(r.width) + 1, h: Math.round(r.height) }
      wrap.style.minWidth = `${sizeRef.current.w}px`
      wrap.style.minHeight = `${sizeRef.current.h}px`
      btn.style.setProperty('--sb-w', `${sizeRef.current.w}px`)
      btn.style.setProperty('--sb-h', `${sizeRef.current.h}px`)
    }
  }, [state])

  useEffect(() => {
    const full = resolveMotionMode() === 'full'
    if (!full) {
      if (state === 'sent') {
        const id = window.setTimeout(() => onDoneRef.current?.(), 0)
        return () => window.clearTimeout(id)
      }
      return
    }
    if (state === 'sending') {
      // fixed width first so the transition has a start value, then the circle
      setMorph('fixed')
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setMorph('circle')))
      return () => cancelAnimationFrame(raf)
    }
    if (state === 'sent') {
      setMorph('circle')
      const btn = btnRef.current
      const timers: number[] = []
      timers.push(
        window.setTimeout(() => {
          if (checkRef.current) drawPath(checkRef.current, { duration: 280, easing: BEZIER.outCubic })
          if (btn) {
            const a = btn.animate(
              [{ transform: 'scale(1)' }, { transform: 'scale(1.08)', offset: 0.4 }, { transform: 'scale(1)' }],
              { duration: 420, easing: BEZIER.outCubic },
            )
            a.onfinish = () => a.cancel()
          }
          if (burst && burstRef.current) fireBurst(burstRef.current, { count: 18, seed: 11 })
        }, 120),
      )
      timers.push(window.setTimeout(() => onDoneRef.current?.(), doneDelay))
      return () => timers.forEach((t) => window.clearTimeout(t))
    }
    // idle / error: snap back
    setMorph('none')
    return
  }, [state, burst, doneDelay])

  const reduced = mode !== 'full'
  const text = reduced && state === 'sending' ? `${sendingLabel}…` : reduced && state === 'sent' ? successLabel : label
  const motionState = state === 'sent' ? 'done' : state === 'sending' ? 'playing' : reduced ? 'static' : 'idle'

  return (
    <span
      ref={wrapRef}
      className={`${kit.kit} ${styles.wrap}`}
      data-motion="success-button"
      data-motion-state={motionState}
      data-motion-trigger="interaction"
    >
      <button
        ref={btnRef}
        type={type}
        className={[styles.btn, className ?? ''].filter(Boolean).join(' ')}
        data-state={state}
        data-morph={morph === 'none' ? undefined : morph}
        disabled={disabled || state === 'sending' || state === 'sent'}
        onClick={onClick}
      >
        <span className={styles.label}>{text}</span>
        <span className={styles.arc} aria-hidden="true" data-decor="" />
        <svg className={styles.check} viewBox="0 0 24 24" aria-hidden="true" focusable="false" data-decor="">
          <path ref={checkRef} d="M5 12.5 L10 17.5 L19 7.5" />
        </svg>
        {!reduced && (state === 'sending' || state === 'sent') && (
          <span className={kit.srOnly} role="status">
            {state === 'sending' ? sendingLabel : successLabel}
          </span>
        )}
      </button>
      <span ref={burstRef} className={styles.burst} aria-hidden="true" data-decor="" />
    </span>
  )
}

/** A circle + check that draws itself on mount. For static success pages. */
export function SuccessMark({ size = 40, className, style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null)
  const circleRef = useRef<SVGCircleElement>(null)
  const checkRef = useRef<SVGPathElement>(null)
  const [state, setState] = useState<'idle' | 'done' | 'static'>('idle')

  useLayoutEffect(() => {
    if (resolveMotionMode() !== 'full') {
      setState('static')
      return
    }
    const c = circleRef.current
    const k = checkRef.current
    if (!c || !k) return
    const a1 = drawPath(c, { duration: 520, easing: BEZIER.outCubic })
    const a2 = drawPath(k, { duration: 300, delay: 380, easing: BEZIER.outCubic })
    const el = ref.current
    let a3: Animation | undefined
    if (el) {
      a3 = el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)', offset: 0.5 }, { transform: 'scale(1)' }], {
        duration: 420,
        delay: 520,
        easing: BEZIER.outCubic,
      })
      a3.onfinish = () => a3?.cancel()
    }
    const id = window.setTimeout(() => setState('done'), 1000)
    return () => {
      window.clearTimeout(id)
      ;[a1, a2, a3].forEach((a) => a && a.playState === 'running' && a.cancel())
    }
  }, [])

  return (
    <span
      ref={ref}
      className={[kit.kit, styles.mark, className ?? ''].filter(Boolean).join(' ')}
      style={{ width: size, height: size, ...style }}
      data-motion="success-mark"
      data-motion-state={state}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48">
        <circle ref={circleRef} cx="24" cy="24" r="21" />
        <path ref={checkRef} d="M15 25 L21.5 31.5 L33.5 17.5" />
      </svg>
    </span>
  )
}
