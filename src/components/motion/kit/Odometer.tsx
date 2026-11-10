'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { usePlayOnce } from './usePlayOnce'
import { resolveMotionMode } from './useMotionMode'
import { BEZIER } from './tween'
import type { BaseMotionProps } from './types'
import kit from './kit.module.css'
import styles from './Odometer.module.css'

export type OdometerProps = BaseMotionProps & {
  /** "$1,500", "$5,000", "2,140" - digits roll, every other glyph stays put */
  value: string
  /** ms, default 1400 */
  duration?: number
  /** the ones column spins one full extra turn (default true) */
  extraTurnOnes?: boolean
}

/**
 * Prices that spin like an odometer when they scroll into view. The real text
 * stays in the DOM (so the box, baseline and selection are always the text's
 * own); while rolling it is hidden and an absolutely positioned overlay of
 * 0-9 strips rolls to the value, highest place first, the ones column taking
 * an extra turn. A price that is already on screen at load is left alone.
 * Reduced motion / ?motion=off: plain text.
 */
export function Odometer({ value, duration = 1400, extraTurnOnes = true, className, style, threshold, onDone, static: isStatic }: OdometerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const stripRefs = useRef<Array<HTMLSpanElement | null>>([])
  const [skipped, setSkipped] = useState(false)
  const [overlay, setOverlay] = useState<{ d: number; h: number } | null>(null)
  const hasDigit = /\d/.test(value)
  const { state, setDone } = usePlayOnce(ref, { threshold, disabled: isStatic || !hasDigit || skipped })
  const chars = Array.from(value)
  const digitIdx = chars.map((c, i) => (/\d/.test(c) ? i : -1)).filter((i) => i >= 0)
  const lastDigit = digitIdx[digitIdx.length - 1]

  // a price the reader can already see must never flip to zero in front of them
  useEffect(() => {
    if (isStatic || !hasDigit || resolveMotionMode() !== 'full') return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight && r.bottom > 0) setSkipped(true)
  }, [isStatic, hasDigit])

  // play: measure a digit in the live font, mount the overlay
  useEffect(() => {
    if (state !== 'playing') return
    const el = ref.current
    if (!el) return
    const probe = document.createElement('span')
    probe.textContent = '0'
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre'
    el.appendChild(probe)
    const d = probe.getBoundingClientRect().width
    el.removeChild(probe)
    const h = el.getBoundingClientRect().height
    if (d <= 0 || h <= 0) {
      setDone()
      return
    }
    setOverlay({ d, h })
  }, [state, setDone])

  // overlay mounted: roll the strips, then hand back to plain text
  useEffect(() => {
    if (!overlay) return
    const anims: Animation[] = []
    const places = digitIdx.length
    digitIdx.forEach((ci, k) => {
      const strip = stripRefs.current[ci]
      if (!strip) return
      const dgt = Number(chars[ci])
      const rows = (extraTurnOnes && ci === lastDigit ? 10 : 0) + dgt
      const delay = (places - 1 - k) * 60
      anims.push(
        strip.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${-rows * overlay.h}px)` }], {
          duration,
          delay,
          easing: BEZIER.outExpo,
          fill: 'forwards',
        }),
      )
    })
    const id = window.setTimeout(() => {
      setOverlay(null)
      setDone()
      onDone?.()
    }, duration + (places - 1) * 60 + 80)
    return () => {
      window.clearTimeout(id)
      anims.forEach((a) => a.playState === 'running' && a.finish())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overlay])

  return (
    <span
      ref={ref}
      className={[kit.kit, kit.tnum, styles.root, className ?? ''].filter(Boolean).join(' ')}
      style={{ ...style, ['--odo-h' as string]: overlay ? `${overlay.h}px` : undefined } as CSSProperties}
      data-motion="odometer"
      data-motion-state={state}
    >
      <span className={styles.text} data-hidden={overlay ? 'true' : undefined}>
        {value}
      </span>
      {overlay && (
        <span aria-hidden="true" className={styles.overlay}>
          {chars.map((c, i) =>
            /\d/.test(c) ? (
              <span key={i} className={styles.col} style={{ width: overlay.d }}>
                <span
                  ref={(el) => {
                    stripRefs.current[i] = el
                  }}
                  className={styles.strip}
                >
                  {Array.from({ length: 20 }, (_, r) => (
                    <span key={r} className={styles.digit}>
                      {r % 10}
                    </span>
                  ))}
                </span>
              </span>
            ) : (
              <span key={i} className={styles.glyph}>
                {c}
              </span>
            ),
          )}
        </span>
      )}
    </span>
  )
}
