'use client'

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { usePlayOnce } from './usePlayOnce'
import { resolveMotionMode } from './useMotionMode'
import { drawPath, drawAll, preparePath } from './drawPath'
import { BEZIER } from './tween'
import type { BaseMotionProps } from './types'
import kit from './kit.module.css'
import styles from './ProcessLine.module.css'

export type ProcessStep = { n: string; title: string; body?: string; icon?: ReactNode }

export type ProcessLineProps = BaseMotionProps & {
  steps: ProcessStep[]
  /** ms for the line to travel the whole path (default 3000) */
  drawDuration?: number
  /** end marker text; null hides it (default "Launched") */
  finalLabel?: string | null
  /** node + "01 Title" only, no cards */
  compact?: boolean
  /** render your own card inside each step (client components only - functions cannot cross the server boundary) */
  renderCard?: (step: ProcessStep, index: number, reached: boolean) => ReactNode
  /** pre-rendered card per step - the server-component way to keep a page's own card markup */
  cards?: ReactNode[]
  listClassName?: string
}

const W = 1000
const H = 150

function geometry(n: number) {
  const xs = Array.from({ length: n }, (_, i) => (W * (i + 0.5)) / n)
  const ys = Array.from({ length: n }, (_, i) => (i % 2 === 0 ? 50 : 100))
  if (n <= 1) return { xs, ys, d: `M ${xs[0] ?? W / 2} ${ys[0] ?? 75} h 0.01` }
  let d = `M ${xs[0]} ${ys[0]}`
  for (let i = 1; i < n; i++) {
    const x0 = xs[i - 1]
    const y0 = ys[i - 1]
    const x1 = xs[i]
    const y1 = ys[i]
    const cx = (x1 - x0) * 0.5
    d += ` C ${x0 + cx} ${y0}, ${x1 - cx} ${y1}, ${x1} ${y1}`
  }
  return { xs, ys, d }
}

/** time fraction at which an ease-out-cubic draw reaches path fraction p */
const inverseOutCubic = (p: number) => 1 - Math.cbrt(1 - p)

function DefaultCard({ step, compact }: { step: ProcessStep; compact: boolean }) {
  return (
    <>
      {step.icon && !compact && (
        <span className={styles.icon} aria-hidden="true">
          {step.icon}
        </span>
      )}
      <span className={styles.num}>{step.n}</span>
      <p className={styles.title}>{step.title}</p>
      {!compact && step.body && <p className={styles.body}>{step.body}</p>}
    </>
  )
}

/**
 * "How it works" as a line that draws through every step. Desktop: an S-curved
 * SVG rail above the cards, a gold line drawing over a dashed track with a teal
 * tip (SMIL motion, no per-frame JS); each node fills and its check draws as
 * the line reaches it and that step's card rises. Under 800px the same DOM
 * becomes a vertical rail built from CSS pseudo-elements. SSR / reduced motion
 * render everything reached and drawn.
 */
export function ProcessLine({
  steps,
  drawDuration = 3000,
  finalLabel = 'Launched',
  compact = false,
  renderCard,
  cards,
  listClassName,
  className,
  style,
  threshold,
  onDone,
  static: isStatic,
}: ProcessLineProps) {
  const n = steps.length
  const ref = useRef<HTMLDivElement>(null)
  const drawRef = useRef<SVGPathElement>(null)
  const motionRef = useRef<SVGAnimateMotionElement>(null)
  const checkRefs = useRef<Array<SVGPathElement | null>>([])
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])
  const { state, setDone } = usePlayOnce(ref, { threshold, disabled: isStatic || n === 0 })
  // SSR + static: every step reached, end marker shown
  const [reached, setReached] = useState<number>(n - 1)
  const [finalShown, setFinalShown] = useState(true)
  const geo = useMemo(() => geometry(n), [n])
  const pathId = 'pl-' + useId().replace(/[^a-zA-Z0-9_-]/g, '')

  // Snap to the start state before first paint (full motion only).
  useLayoutEffect(() => {
    if (isStatic || n === 0 || resolveMotionMode() !== 'full') return
    setReached(-1)
    setFinalShown(false)
    if (drawRef.current) preparePath(drawRef.current)
    checkRefs.current.forEach((c) => c && preparePath(c))
    cardRefs.current.forEach((c) => {
      if (!c) return
      c.style.opacity = '0'
      c.style.transform = 'translateY(14px)'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (state !== 'playing') return
    const D = drawDuration
    const timers: number[] = []
    const anims: Animation[] = []
    if (drawRef.current) anims.push(drawPath(drawRef.current, { duration: D, easing: BEZIER.outCubic }))
    try {
      motionRef.current?.beginElement()
    } catch {}

    steps.forEach((_, i) => {
      const at = n <= 1 ? 0 : D * inverseOutCubic(i / (n - 1))
      timers.push(
        window.setTimeout(() => {
          setReached(i)
          const check = checkRefs.current[i]
          if (check) anims.push(drawPath(check, { duration: 260, easing: BEZIER.outCubic }))
          const card = cardRefs.current[i]
          if (card) {
            const a = card.animate(
              [
                { opacity: 0, transform: 'translateY(14px)' },
                { opacity: 1, transform: 'translateY(0)' },
              ],
              { duration: 480, easing: BEZIER.outCubic, fill: 'forwards' },
            )
            a.onfinish = () => {
              card.style.opacity = ''
              card.style.transform = ''
              a.cancel()
            }
            anims.push(a)
            anims.push(...drawAll(card.querySelector('svg'), { duration: 420, delay: 120 }))
          }
        }, at),
      )
    })
    // the last card's rise (480ms) must finish before the state flips to done
    timers.push(
      window.setTimeout(() => {
        setFinalShown(true)
        setDone()
        onDone?.()
      }, D + 560),
    )
    return () => {
      timers.forEach((t) => window.clearTimeout(t))
      // jump any live animation to its end so its onfinish commits the final styles
      anims.forEach((a) => {
        if (a.playState === 'running') a.finish()
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  if (n === 0) return null

  const cls = [kit.kit, styles.root, compact ? styles.compact : '', n >= 5 ? styles.dense : '', className ?? ''].filter(Boolean).join(' ')

  return (
    <div
      ref={ref}
      className={cls}
      style={{ ...style, ['--n' as string]: n } as React.CSSProperties}
      data-motion="process"
      data-motion-state={state}
    >
      <svg className={styles.rail} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
        <path d={geo.d} className={styles.track} />
        <path id={pathId} ref={drawRef} d={geo.d} className={styles.draw} />
        {geo.xs.map((x, i) => (
          <g key={i} className={styles.node} data-reached={i <= reached} transform={`translate(${x} ${geo.ys[i]})`}>
            <circle r="11" className={styles.nodeCircle} />
            <path
              ref={(el) => {
                checkRefs.current[i] = el
              }}
              d="M -5 0.5 L -1.5 4 L 5.5 -4"
              className={styles.check}
            />
          </g>
        ))}
        <circle r="5" className={styles.tip} data-show={state === 'playing'} data-decor="">
          <animateMotion
            ref={motionRef}
            dur={`${drawDuration}ms`}
            begin="indefinite"
            fill="freeze"
            calcMode="spline"
            keyTimes="0;1"
            keySplines="0.33 1 0.68 1"
          >
            <mpath href={`#${pathId}`} />
          </animateMotion>
        </circle>
      </svg>

      <ol className={[styles.steps, listClassName ?? ''].filter(Boolean).join(' ')}>
        {steps.map((s, i) => (
          <li key={`${s.n}-${i}`} className={styles.step} data-reached={i <= reached}>
            <div
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              className={styles.card}
            >
              {cards?.[i] ?? (renderCard ? renderCard(s, i, i <= reached) : <DefaultCard step={s} compact={compact} />)}
            </div>
          </li>
        ))}
      </ol>

      {finalLabel && (
        <p className={styles.final} data-show={finalShown}>
          <span className={styles.finalDot} aria-hidden="true" />
          {finalLabel}
        </p>
      )}
    </div>
  )
}
