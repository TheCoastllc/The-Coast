'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { resolveMotionMode } from './useMotionMode'
import { usePageVisible, useVisible } from './useLoopWhileVisible'
import { BEZIER } from './tween'
import kit from './kit.module.css'
import styles from './CursorTour.module.css'

export type TourStep =
  | { kind: 'move'; to: string; duration?: number }
  | { kind: 'click'; on: string; zoom?: boolean }
  | { kind: 'wait'; ms: number }
  | { kind: 'run'; fn: () => void }
  | { kind: 'zoom'; level: number | null; at?: string }

export type CursorTourProps = {
  /** the scene markup; anchors carry data-tour="id" */
  children: ReactNode
  /** the choreography; built by the scene so `run` steps can set its state */
  steps: TourStep[]
  /** sr-only summary of what the demo shows */
  description: string
  loop?: boolean
  /** ms between loops (default 2600) */
  loopDelay?: number
  /** Screen-Studio-style zoom toward the action (fine pointers only); default 1.18 */
  zoom?: number
  /** start running only after the page is idle (default true) */
  deferToIdle?: boolean
  /** called when the loop restarts, so the scene can reset */
  onLoopStart?: () => void
  className?: string
  style?: CSSProperties
}

const sleep = (ms: number, signal: { cancelled: boolean }) =>
  new Promise<void>((resolve) => {
    const id = window.setTimeout(resolve, ms)
    const check = window.setInterval(() => {
      if (signal.cancelled) {
        window.clearTimeout(id)
        window.clearInterval(check)
        resolve()
      }
    }, 60)
    window.setTimeout(() => window.clearInterval(check), ms + 70)
  })

function whenIdle(): Promise<void> {
  return new Promise((resolve) => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
    const go = () => (w.requestIdleCallback ? w.requestIdleCallback(() => resolve(), { timeout: 1800 }) : setTimeout(resolve, 600))
    if (document.readyState === 'complete') go()
    else window.addEventListener('load', go, { once: true })
  })
}

/**
 * A fake cursor demos a product without a screen recording. The scene is
 * ordinary markup with data-tour anchors; the cursor glides along gently
 * curved paths, presses targets (with a ripple), and the stage zooms toward
 * each action on fine-pointer devices. Runs only while the stage is on
 * screen, on a visible tab, after the page is idle; loops. Reduced motion:
 * the scene renders its own final state and nothing moves.
 */
export function CursorTour({ children, steps, description, loop = true, loopDelay = 2600, zoom = 1.18, deferToIdle = true, onLoopStart, className, style }: CursorTourProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const zoomRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const onScreen = useVisible(stageRef, '0px')
  const pageVisible = usePageVisible()
  const [active, setActive] = useState(false)
  const pos = useRef({ x: 40, y: 40 })
  const stepsRef = useRef(steps)
  stepsRef.current = steps
  const loopStartRef = useRef(onLoopStart)
  loopStartRef.current = onLoopStart

  // arm after idle
  useEffect(() => {
    if (resolveMotionMode() !== 'full') return
    let cancelled = false
    ;(deferToIdle ? whenIdle() : Promise.resolve()).then(() => !cancelled && setActive(true))
    return () => {
      cancelled = true
    }
  }, [deferToIdle])

  useEffect(() => {
    const stage = stageRef.current
    const cursor = cursorRef.current
    const zoomEl = zoomRef.current
    if (!active || !onScreen || !pageVisible || !stage || !cursor || !zoomEl) return
    const signal = { cancelled: false }
    const fine = window.matchMedia('(pointer: fine)').matches

    const center = (id: string) => {
      const el = stage.querySelector<HTMLElement>(`[data-tour="${id}"]`)
      if (!el) return null
      const r = el.getBoundingClientRect()
      const s = stage.getBoundingClientRect()
      // in the un-zoomed stage coordinate space
      const z = currentZoom.current
      const ox = originPx.current.x
      const oy = originPx.current.y
      const cx = (r.left + r.width / 2 - s.left - ox) / z + ox
      const cy = (r.top + r.height / 2 - s.top - oy) / z + oy
      return { x: cx, y: cy, el }
    }
    const placeCursor = (x: number, y: number) => {
      pos.current = { x, y }
      cursor.style.transform = `translate(${x}px, ${y}px)`
    }
    const moveTo = async (x: number, y: number, duration = 720) => {
      const from = { ...pos.current }
      // gentle curve: control point offset perpendicular to the path
      const mx = (from.x + x) / 2 + (y - from.y) * 0.18
      const my = (from.y + y) / 2 - (x - from.x) * 0.18
      const frames = Array.from({ length: 13 }, (_, i) => {
        const t = i / 12
        const bx = (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * mx + t * t * x
        const by = (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * my + t * t * y
        return { transform: `translate(${bx}px, ${by}px)` }
      })
      const a = cursor.animate(frames, { duration, easing: BEZIER.inOutCubic, fill: 'forwards' })
      await a.finished.catch(() => {})
      a.cancel()
      placeCursor(x, y)
    }
    const setZoom = (level: number | null, at?: { x: number; y: number }) => {
      if (!fine) return
      const lvl = level ?? 1
      if (at) {
        originPx.current = at
        zoomEl.style.transformOrigin = `${at.x}px ${at.y}px`
      }
      currentZoom.current = lvl
      zoomEl.style.transform = lvl === 1 ? '' : `scale(${lvl})`
    }
    const press = async (id: string, doZoom: boolean) => {
      const c = center(id)
      if (!c) return
      await moveTo(c.x, c.y)
      if (signal.cancelled) return
      if (doZoom) setZoom(zoom, { x: c.x, y: c.y })
      c.el.setAttribute('data-tour-pressed', '')
      const ripple = document.createElement('span')
      ripple.className = styles.ripple
      ripple.style.left = `${c.x}px`
      ripple.style.top = `${c.y}px`
      zoomEl.appendChild(ripple)
      const ra = ripple.animate([{ transform: 'scale(0.3)', opacity: 0.9 }, { transform: 'scale(1.6)', opacity: 0 }], { duration: 460, easing: BEZIER.outCubic })
      ra.onfinish = () => ripple.remove()
      const ca = cursor.animate([{ transform: `translate(${c.x}px, ${c.y}px) scale(1)` }, { transform: `translate(${c.x}px, ${c.y}px) scale(0.86)`, offset: 0.4 }, { transform: `translate(${c.x}px, ${c.y}px) scale(1)` }], { duration: 220, easing: BEZIER.outCubic })
      await ca.finished.catch(() => {})
      ca.cancel()
      placeCursor(c.x, c.y)
      window.setTimeout(() => c.el.removeAttribute('data-tour-pressed'), 160)
    }

    const run = async () => {
      cursor.dataset.show = 'true'
      const s = stage.getBoundingClientRect()
      placeCursor(s.width * 0.72, s.height * 0.86)
      while (!signal.cancelled) {
        loopStartRef.current?.()
        for (const step of stepsRef.current) {
          if (signal.cancelled) return
          if (step.kind === 'wait') await sleep(step.ms, signal)
          else if (step.kind === 'move') {
            const c = center(step.to)
            if (c) await moveTo(c.x, c.y, step.duration)
          } else if (step.kind === 'click') await press(step.on, step.zoom ?? true)
          else if (step.kind === 'run') step.fn()
          else if (step.kind === 'zoom') {
            const at = step.at ? center(step.at) : null
            setZoom(step.level, at ? { x: at.x, y: at.y } : undefined)
          }
        }
        if (!loop) break
        await sleep(loopDelay, signal)
        setZoom(null)
        await sleep(700, signal)
      }
    }
    run()
    return () => {
      signal.cancelled = true
      cursor.dataset.show = 'false'
      cursor.getAnimations().forEach((a) => a.cancel())
      setZoom(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, onScreen, pageVisible, loop, loopDelay, zoom])

  const currentZoom = useRef(1)
  const originPx = useRef({ x: 0, y: 0 })

  return (
    <div
      ref={stageRef}
      className={[kit.kit, styles.stage, className ?? ''].filter(Boolean).join(' ')}
      style={style}
      data-motion="cursor-tour"
      data-motion-state={active ? 'done' : 'static'}
      data-motion-trigger="interaction"
    >
      <span className={kit.srOnly}>{description}</span>
      <div ref={zoomRef} className={styles.zoom} aria-hidden="true">
        {children}
        <div ref={cursorRef} className={styles.cursor} data-show="false" data-decor="">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 3l14 8.5-6.2 1.4L9.6 20z" fill="#fff" stroke="#0a0c12" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}
