'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { usePlayOnce } from './usePlayOnce'
import { tween, EASES } from './tween'
import type { BaseMotionProps } from './types'
import kit from './kit.module.css'
import styles from './CompareSlider.module.css'

type Img = { src: string; alt: string }

export type CompareSliderProps = BaseMotionProps & {
  before: Img
  after: Img
  labels?: { before: string; after: string }
  /** CSS aspect-ratio for the frame (default "16 / 9") */
  aspect?: string
  /** cover fills the frame; contain letterboxes mismatched pairs (default cover) */
  fit?: 'cover' | 'contain'
  /** sweep once when the slider scrolls into view (default true) */
  auto?: boolean
  /** starting divider position 0-100 (default 50) */
  initial?: number
  sizes?: string
}

const clamp = (v: number) => Math.min(100, Math.max(0, v))

/**
 * Drag the line, see the glow-up. Two stacked images; the "after" layer is
 * clipped at a draggable divider. When it first scrolls into view it sweeps
 * left to reveal the redesign, pauses, sweeps right, and settles back in the
 * middle - unless the visitor has already grabbed it. Keyboard: arrows,
 * Home/End. Reduced motion: no sweep, still draggable.
 */
export function CompareSlider({
  before,
  after,
  labels = { before: 'Before', after: 'After' },
  aspect = '16 / 9',
  fit = 'cover',
  auto = true,
  initial = 50,
  sizes = '(max-width: 900px) 100vw, 900px',
  className,
  style,
  threshold,
  onDone,
  static: isStatic,
}: CompareSliderProps) {
  const ref = useRef<HTMLDivElement>(null)
  const posRef = useRef(clamp(initial))
  const [pos, setPosState] = useState(clamp(initial))
  const [moving, setMoving] = useState(false)
  const interacted = useRef(false)
  const { state, setDone } = usePlayOnce(ref, { threshold: threshold ?? 0.4, disabled: isStatic || !auto })

  const setPos = useCallback((v: number) => {
    const c = clamp(v)
    posRef.current = c
    ref.current?.style.setProperty('--pos', `${c}%`)
    setPosState(c)
  }, [])

  // auto sweep: 50 -> 18, pause, -> 82, pause, -> 50
  useEffect(() => {
    if (state !== 'playing') return
    let cancelled = false
    const active: Array<{ cancel: () => void }> = []
    const timers: number[] = []
    const stop = () => {
      cancelled = true
      active.forEach((t) => t.cancel())
      timers.forEach((t) => window.clearTimeout(t))
    }
    const go = (to: number, duration: number, ease: (t: number) => number, then?: () => void) => {
      if (cancelled || interacted.current) return
      const from = posRef.current
      setMoving(true)
      active.push(
        tween({
          from,
          to,
          duration,
          ease,
          onUpdate: (v) => setPos(v),
          onComplete: () => {
            setMoving(false)
            then?.()
          },
        }),
      )
    }
    const finish = () => {
      setDone()
      onDone?.()
    }
    go(18, 900, EASES.outCubic, () => {
      timers.push(
        window.setTimeout(() => {
          go(82, 1100, EASES.inOutCubic, () => {
            timers.push(
              window.setTimeout(() => {
                go(50, 700, EASES.outCubic, finish)
              }, 380),
            )
          })
        }, 480),
      )
    })
    return stop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const fromEvent = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect()
    return ((e.clientX - r.left) / r.width) * 100
  }
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    interacted.current = true
    if (state === 'playing') setDone()
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    setMoving(true)
    setPos(fromEvent(e))
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!(e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) return
    setPos(fromEvent(e))
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const el = e.currentTarget as HTMLElement
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
    setMoving(false)
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2
    let next: number | null = null
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = posRef.current - step
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = posRef.current + step
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = 100
    if (next === null) return
    e.preventDefault()
    interacted.current = true
    if (state === 'playing') setDone()
    setPos(next)
  }

  return (
    <div
      ref={ref}
      className={[kit.kit, styles.root, className ?? ''].filter(Boolean).join(' ')}
      style={{ ...style, ['--cs-aspect' as string]: aspect, ['--cs-fit' as string]: fit, ['--pos' as string]: `${pos}%` } as CSSProperties}
      data-motion="compare-slider"
      data-motion-state={state}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className={styles.layer}>
        <Image src={before.src} alt={before.alt} fill sizes={sizes} draggable={false} />
      </div>
      <div className={`${styles.layer} ${styles.after}`}>
        <Image src={after.src} alt={after.alt} fill sizes={sizes} draggable={false} />
      </div>
      <span className={`${styles.label} ${styles.labelBefore}`} data-show={pos > 12}>
        {labels.before}
      </span>
      <span className={`${styles.label} ${styles.labelAfter}`} data-show={pos < 88}>
        {labels.after}
      </span>
      <div className={styles.divider} aria-hidden="true" />
      <div
        className={styles.handle}
        role="slider"
        tabIndex={0}
        aria-label={`Compare ${labels.before.toLowerCase()} and ${labels.after.toLowerCase()}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% ${labels.before.toLowerCase()}`}
        data-moving={moving}
        onKeyDown={onKeyDown}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 7l-5 5 5 5" />
          <path d="M15 7l5 5-5 5" />
        </svg>
      </div>
    </div>
  )
}
