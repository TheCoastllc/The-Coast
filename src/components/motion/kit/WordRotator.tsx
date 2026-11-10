'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { resolveMotionMode } from './useMotionMode'
import { usePageVisible, useVisible } from './useLoopWhileVisible'
import { SPRING } from './spring'
import type { BaseMotionProps } from './types'
import kit from './kit.module.css'
import styles from './WordRotator.module.css'

export type WordRotatorProps = Omit<BaseMotionProps, 'threshold' | 'onDone'> & {
  words: string[]
  /** ms per word (default 2200) */
  interval?: number
  /** the word rendered on the server / under reduced motion (default 0) */
  staticIndex?: number
  /** full sentence for screen readers, e.g. "We design brands that convert." */
  sentence?: string
}

/**
 * One headline, several promises. The accent word slides up one slot like a
 * slot machine on a spring, the container's width eases to fit the new word
 * so the sentence never jumps, and off-centre words sit at 15%. Loops only
 * while on screen and on a visible tab; pauses on hover/focus. SSR and
 * reduced motion render a single word.
 */
export function WordRotator({ words, interval = 2200, staticIndex = 0, sentence, className, style, static: isStatic }: WordRotatorProps) {
  const N = words.length
  const ref = useRef<HTMLSpanElement>(null)
  const colRef = useRef<HTMLSpanElement>(null)
  const [live, setLive] = useState(false)
  const [metrics, setMetrics] = useState<{ widths: number[]; h: number } | null>(null)
  const [index, setIndex] = useState(Math.min(staticIndex, Math.max(0, N - 1)))
  const [paused, setPaused] = useState(false)
  const busy = useRef(false)
  const onScreen = useVisible(ref, '0px')
  const pageVisible = usePageVisible()

  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return null
    const cs = getComputedStyle(el)
    const probe = document.createElement('span')
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;left:-9999px'
    el.appendChild(probe)
    const widths = words.map((w) => {
      probe.textContent = w
      return Math.ceil(probe.getBoundingClientRect().width)
    })
    el.removeChild(probe)
    const lh = parseFloat(cs.lineHeight)
    const h = Number.isFinite(lh) && lh > 0 ? lh : el.getBoundingClientRect().height
    return { widths, h }
  }, [words])

  // go live after fonts are ready (widths depend on the real face)
  useEffect(() => {
    if (isStatic || N < 2 || resolveMotionMode() !== 'full') return
    let cancelled = false
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve()
    Promise.race([fonts, new Promise((r) => setTimeout(r, 400))]).then(() => {
      if (cancelled) return
      const m = measure()
      if (!m) return
      setMetrics(m)
      setLive(true)
    })
    const onResize = () => {
      const m = measure()
      if (m) setMetrics(m)
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelled = true
      window.removeEventListener('resize', onResize)
    }
  }, [isStatic, N, measure])

  const advance = useCallback(() => {
    const col = colRef.current
    if (!col || busy.current || !metrics) return
    busy.current = true
    const a = col.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${-metrics.h}px)` }], {
      duration: 520,
      easing: SPRING.SNAP,
      fill: 'forwards',
    })
    a.onfinish = () => {
      setIndex((i) => (i + 1) % N)
      a.cancel()
      busy.current = false
    }
  }, [metrics, N])

  useEffect(() => {
    if (!live || !onScreen || !pageVisible || paused || N < 2) return
    const id = window.setTimeout(advance, interval)
    return () => window.clearTimeout(id)
  }, [live, onScreen, pageVisible, paused, N, interval, advance, index])

  const current = words[index] ?? ''
  const prev = words[(index - 1 + N) % N] ?? ''
  const next = words[(index + 1) % N] ?? ''
  const rootStyle: CSSProperties = {
    ...style,
    ...(live && metrics ? { width: metrics.widths[index], height: metrics.h } : null),
  }

  return (
    <span
      ref={ref}
      className={[kit.kit, styles.root, className ?? ''].filter(Boolean).join(' ')}
      style={rootStyle}
      data-motion="word-rotator"
      data-motion-state={live ? 'done' : isStatic ? 'static' : 'static'}
      data-motion-trigger="interaction"
      data-motion-resizes=""
      data-live={live}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {live && metrics && <span className={kit.srOnly}>{sentence ?? words[Math.min(staticIndex, N - 1)]}</span>}
      {live && metrics ? (
        <span aria-hidden="true" className={styles.col} ref={colRef} style={{ transform: `translateY(0)` }}>
          <span className={styles.row} style={{ height: metrics.h, marginTop: -metrics.h }}>
            {prev}
          </span>
          <span className={styles.row} data-current="true" style={{ height: metrics.h }}>
            {current}
          </span>
          <span className={styles.row} style={{ height: metrics.h }}>
            {next}
          </span>
        </span>
      ) : (
        <span>{current}</span>
      )}
    </span>
  )
}
