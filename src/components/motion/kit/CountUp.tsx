'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { usePlayOnce } from './usePlayOnce'
import { resolveMotionMode } from './useMotionMode'
import { tween, EASES, BEZIER, clamp01 } from './tween'
import type { BaseMotionProps } from './types'
import kit from './kit.module.css'
import styles from './CountUp.module.css'

export type CountUpProps = BaseMotionProps & {
  /** "9", "12", "100%", "15+", "$1,500", 4.9, "2-6 wk" (ranges render static) */
  value: string | number
  prefix?: string
  suffix?: string
  decimals?: number
  /** ms, default 1800 */
  duration?: number
  ease?: 'outExpo' | 'outCubic'
  /** gold flash when the count lands (the homepage stats keep this on) */
  flash?: boolean
  /** draw a ring to a percentage beside the number */
  ring?: { percent: number; size?: number; stroke?: number }
  /** grow a thin bar to a percentage under the number */
  bar?: { percent: number }
  as?: 'span' | 'div'
  /** targets below this read as a stutter, not a count - rendered static (default 3) */
  minTarget?: number
}

type Parsed = { prefix: string; target: number; decimals: number; suffix: string; grouped: boolean }

/** Pull the leading number out of a stat string. null = nothing worth counting. */
export function parseCountValue(
  value: string | number,
  opts: { prefix?: string; suffix?: string; decimals?: number; minTarget: number },
): Parsed | null {
  const raw = String(value).trim()
  const m = raw.match(/^([^\d]*?)(\d[\d,]*)(\.\d+)?([\s\S]*)$/)
  if (!m) return null
  const [, pre, int, dec = '', suf] = m
  // "2-6 wk" / "3-5 days": a range is a label, not a quantity
  if (/^\s*[-–]\s*\d/.test(suf)) return null
  const target = parseFloat(int.replace(/,/g, '') + dec)
  if (!Number.isFinite(target) || target < opts.minTarget) return null
  return {
    prefix: opts.prefix ?? pre,
    target,
    decimals: opts.decimals ?? Math.max(0, dec.length - 1),
    suffix: opts.suffix ?? suf,
    grouped: int.includes(','),
  }
}

function format(n: number, p: Parsed): string {
  const num = p.grouped
    ? n.toLocaleString('en-US', { minimumFractionDigits: p.decimals, maximumFractionDigits: p.decimals })
    : n.toFixed(p.decimals)
  return `${p.prefix}${num}${p.suffix}`
}

const R = 46
const C = 2 * Math.PI * R

/**
 * Counts the leading number of a stat up from zero when it scrolls into view
 * (ease-out-expo, tabular digits, width reserved so nothing shifts). Optional
 * ring / bar draw to a percentage. SSR, reduced motion and non-numeric values
 * all render the final text. Replaces the GSAP/ScrollTrigger CountUp.
 */
export function CountUp({
  value,
  prefix,
  suffix,
  decimals,
  duration = 1800,
  ease = 'outExpo',
  flash = false,
  ring,
  bar,
  as: Tag = 'span',
  minTarget = 3,
  className,
  style,
  threshold,
  onDone,
  static: isStatic,
}: CountUpProps) {
  const ref = useRef<HTMLElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)
  const ringRef = useRef<SVGCircleElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const parsed = parseCountValue(value, { prefix, suffix, decimals, minTarget })
  const animatable = parsed !== null || !!ring || !!bar
  const { state, setDone } = usePlayOnce(ref, { threshold, disabled: isStatic || !animatable })
  const finalText = String(value)
  const ringPct = ring ? clamp01(ring.percent / 100) : 0
  const barPct = bar ? clamp01(bar.percent / 100) : 0

  // Snap to the start state before first paint (full motion only).
  useLayoutEffect(() => {
    if (isStatic || !animatable || resolveMotionMode() !== 'full') return
    const num = numRef.current
    if (num && parsed) {
      const w = num.getBoundingClientRect().width
      if (w > 0) {
        num.style.display = 'inline-block'
        num.style.minWidth = `${Math.ceil(w)}px`
      }
      num.textContent = format(0, parsed)
    }
    if (ringRef.current) ringRef.current.style.strokeDashoffset = `${C}`
    if (barRef.current) barRef.current.style.transform = 'scaleX(0)'
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (state !== 'playing') return
    const num = numRef.current
    const easeFn = ease === 'outCubic' ? EASES.outCubic : EASES.outExpo
    const running: Array<{ cancel: () => void }> = []

    if (num && parsed) {
      const p = parsed
      running.push(
        tween({
          from: 0,
          to: p.target,
          duration,
          ease: easeFn,
          onUpdate: (n) => {
            num.textContent = format(n, p)
          },
          onComplete: () => {
            num.textContent = finalText
            if (flash) {
              const base = getComputedStyle(num).color
              const a = num.animate(
                [
                  { color: '#e6b24d', textShadow: '0 0 22px rgba(230,178,77,0.55)' },
                  { color: base, textShadow: '0 0 0 rgba(230,178,77,0)' },
                ],
                { duration: 900, easing: BEZIER.outCubic },
              )
              a.onfinish = () => a.cancel()
            }
          },
        }),
      )
    }
    if (ringRef.current && ring) {
      const el = ringRef.current
      const a = el.animate([{ strokeDashoffset: C }, { strokeDashoffset: C * (1 - ringPct) }], {
        duration,
        easing: BEZIER.outExpo,
        fill: 'forwards',
      })
      a.onfinish = () => {
        el.style.strokeDashoffset = `${C * (1 - ringPct)}`
        a.cancel()
      }
      running.push(a)
    }
    if (barRef.current && bar) {
      const el = barRef.current
      const a = el.animate([{ transform: 'scaleX(0)' }, { transform: `scaleX(${barPct})` }], {
        duration,
        easing: BEZIER.outExpo,
        fill: 'forwards',
      })
      a.onfinish = () => {
        el.style.transform = `scaleX(${barPct})`
        a.cancel()
      }
      running.push(a)
    }
    const id = window.setTimeout(() => {
      setDone()
      onDone?.()
    }, duration + 60)
    return () => {
      window.clearTimeout(id)
      running.forEach((r) => r.cancel())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const cls = [kit.kit, styles.root, ring ? styles.withRing : '', className ?? ''].filter(Boolean).join(' ')

  return (
    <Tag ref={ref as never} className={cls} style={style} data-motion="countup" data-motion-state={state}>
      {ring && (
        <svg
          className={styles.ring}
          viewBox="0 0 100 100"
          width={ring.size ?? 72}
          height={ring.size ?? 72}
          aria-hidden="true"
        >
          <circle className={styles.ringTrack} cx="50" cy="50" r={R} strokeWidth={ring.stroke ?? 5} />
          <circle
            ref={ringRef}
            className={styles.ringFill}
            cx="50"
            cy="50"
            r={R}
            strokeWidth={ring.stroke ?? 5}
            style={{ strokeDasharray: C, strokeDashoffset: C * (1 - ringPct) }}
          />
        </svg>
      )}
      <span ref={numRef} className={kit.tnum}>
        {finalText}
      </span>
      {bar && (
        <span className={styles.bar} aria-hidden="true">
          <span ref={barRef} className={styles.barFill} style={{ transform: `scaleX(${barPct})` }} />
        </span>
      )}
    </Tag>
  )
}
