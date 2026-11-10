'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { usePlayOnce } from './usePlayOnce'
import { resolveMotionMode } from './useMotionMode'
import { SPRING } from './spring'
import type { BaseMotionProps } from './types'
import kit from './kit.module.css'
import styles from './PulseFeed.module.css'

export type PulseItem = {
  kind: 'review' | 'case' | 'post'
  title: string
  meta: string
  /** ISO date or a year; shown as-is when not parseable */
  date: string
  href?: string
}

export type PulseFeedProps = BaseMotionProps & {
  items: PulseItem[]
  heading?: string
  /** ms between items dropping in (default 260) */
  stagger?: number
}

function fmt(d: string): string {
  if (/^\d{4}$/.test(d)) return d
  const t = new Date(d)
  if (isNaN(t.getTime())) return d
  return t.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

function Icon({ kind }: { kind: PulseItem['kind'] }) {
  if (kind === 'review')
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" />
      </svg>
    )
  if (kind === 'case')
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 4h11l3 3v13H5z" />
      <path d="M8 12h8M8 16h8M8 8h4" />
    </svg>
  )
}

/**
 * The honest version of a "sale pings" feed: a short list of REAL dated
 * things from the studio (newest Google review, newest published case
 * study, latest article). When it scrolls into view the items drop in one
 * after another on a spring, newest first. No counters, no sparkline, no
 * "live" badge; it renders nothing with fewer than two items.
 */
export function PulseFeed({ items, heading = 'Recently from the studio', stagger = 260, className, style, threshold, onDone, static: isStatic }: PulseFeedProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { state, setDone } = usePlayOnce(ref, { threshold, disabled: isStatic || items.length < 2 })

  useLayoutEffect(() => {
    const root = ref.current
    if (!root || isStatic || items.length < 2 || resolveMotionMode() !== 'full') return
    root.querySelectorAll<HTMLElement>('li').forEach((li) => {
      li.style.opacity = '0'
      li.style.transform = 'translateY(-14px)'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const root = ref.current
    if (state !== 'playing' || !root) return
    const lis = Array.from(root.querySelectorAll<HTMLElement>('li'))
    const anims = lis.map((li, i) => {
      const a = li.animate([{ opacity: 0, transform: 'translateY(-14px)' }, { opacity: 1, transform: 'translateY(0)' }], {
        duration: 560,
        delay: i * stagger,
        easing: SPRING.SNAP,
        fill: 'forwards',
      })
      a.onfinish = () => {
        li.style.opacity = ''
        li.style.transform = ''
        a.cancel()
      }
      return a
    })
    const id = window.setTimeout(() => {
      setDone()
      onDone?.()
    }, (lis.length - 1) * stagger + 620)
    return () => {
      window.clearTimeout(id)
      anims.forEach((a) => a.playState === 'running' && a.finish())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  if (items.length < 2) return null

  return (
    <div ref={ref} className={[kit.kit, styles.root, className ?? ''].filter(Boolean).join(' ')} style={style} data-motion="pulse-feed" data-motion-state={state}>
      <p className={styles.heading}>{heading}</p>
      <ul className={styles.list}>
        {items.map((it, i) => {
          const inner = (
            <>
              <span className={styles.kind} aria-hidden="true">
                <Icon kind={it.kind} />
              </span>
              <span className={styles.body}>
                <span className={styles.title}>{it.title}</span>
                <span className={styles.meta}>{it.meta}</span>
              </span>
              <span className={styles.date}>{fmt(it.date)}</span>
            </>
          )
          return (
            <li key={`${it.kind}-${i}`}>
              {it.href ? (
                <a className={styles.item} href={it.href}>
                  {inner}
                </a>
              ) : (
                <span className={styles.item}>{inner}</span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
