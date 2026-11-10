'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { resolveMotionMode, useMotionMode } from './useMotionMode'
import { usePageVisible, useVisible } from './useLoopWhileVisible'
import { SPRING } from './spring'
import { BEZIER } from './tween'
import type { BaseMotionProps } from './types'
import kit from './kit.module.css'
import styles from './ReviewDeck.module.css'

export type DeckReview = {
  quote: string
  name: string
  stars: number
  avatar?: string | null
  date?: string | null
}

export type ReviewDeckProps = BaseMotionProps & {
  reviews: DeckReview[]
  /** ms between auto-advances (default 4500) */
  interval?: number
  /** cards visible in the stack (default 4) */
  visible?: number
  label?: string
  /** e.g. "Google" - shown top-right of each card; empty string hides it */
  sourceLabel?: string
  /** extra class on each card (the homepage passes its glass treatment) */
  cardClassName?: string
  renderCard?: (r: DeckReview, index: number, isFront: boolean) => ReactNode
  onAdvance?: (index: number) => void
}

function fmtDate(iso?: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
}
const initials = (name: string) =>
  name.split(' ').map((n) => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'G'

function Star({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? 0 : 1.2} aria-hidden="true" data-star="">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

function DefaultCard({ r, sourceLabel, className }: { r: DeckReview; sourceLabel: string; className?: string }) {
  const date = fmtDate(r.date)
  return (
    <article className={[styles.card, className ?? ''].filter(Boolean).join(' ')}>
      <div className={styles.top}>
        <span className={styles.stars} role="img" aria-label={`${r.stars} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} filled={i < r.stars} />
          ))}
        </span>
        {sourceLabel && <span className={styles.source}>{sourceLabel}</span>}
      </div>
      <p className={styles.quote}>{r.quote}</p>
      <div className={styles.person}>
        {r.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={r.avatar} alt="" className={styles.avatar} width={34} height={34} loading="lazy" decoding="async" referrerPolicy="no-referrer" />
        ) : (
          <span className={styles.initials} aria-hidden="true">
            {initials(r.name)}
          </span>
        )}
        <span className={styles.meta}>
          <span className={styles.name}>{r.name}</span>
          {date && (
            <span className={styles.date} suppressHydrationWarning>
              {date}
            </span>
          )}
        </span>
      </div>
    </article>
  )
}

/**
 * Testimonials that deal themselves. Real reviews sit in a stack (each card
 * behind is higher, smaller, dimmer). The front card's stars fill one by one;
 * every `interval` it swipes off to the left and the stack eases forward,
 * the old card returning at the back. Pauses on hover/focus, sleeps off
 * screen, and is fully driveable (buttons, arrow keys, swipe). Fixed height,
 * so nothing around it shifts. SSR / reduced motion: the stack, static.
 */
export function ReviewDeck({
  reviews,
  interval = 4500,
  visible = 4,
  label = 'Client reviews',
  sourceLabel = 'Google',
  cardClassName,
  renderCard,
  onAdvance,
  className,
  style,
  static: isStatic,
}: ReviewDeckProps) {
  const N = reviews.length
  const V = Math.max(1, Math.min(visible, N))
  const mode = useMotionMode()
  const full = mode === 'full' && !isStatic
  const ref = useRef<HTMLDivElement>(null)
  const slotRefs = useRef<Array<HTMLDivElement | null>>([])
  const onScreen = useVisible(ref, '0px')
  const pageVisible = usePageVisible()
  const [front, setFront] = useState(0)
  const [paused, setPaused] = useState(false)
  const busy = useRef(false)
  const started = useRef(false)

  const fillStars = useCallback((idx: number) => {
    if (resolveMotionMode() !== 'full') return
    const slot = slotRefs.current[idx]
    if (!slot) return
    slot.querySelectorAll<SVGElement>('[data-star]').forEach((s, i) => {
      const a = s.animate(
        [{ transform: 'scale(0.4)', opacity: 0.2 }, { transform: 'scale(1.18)', opacity: 1, offset: 0.7 }, { transform: 'scale(1)', opacity: 1 }],
        { duration: 360, delay: 140 + i * 70, easing: BEZIER.outCubic, fill: 'backwards' },
      )
      a.onfinish = () => a.cancel()
    })
  }, [])

  const advance = useCallback(
    (dir: 1 | -1 = 1) => {
      if (N < 2 || busy.current) return
      const next = (front + dir + N) % N
      if (resolveMotionMode() !== 'full' || isStatic) {
        setFront(next)
        onAdvance?.(next)
        return
      }
      busy.current = true
      if (dir === 1) {
        const slot = slotRefs.current[front]
        const a = slot?.animate(
          [
            { transform: getComputedStyle(slot).transform === 'none' ? 'none' : getComputedStyle(slot).transform, opacity: 1 },
            { transform: 'translateX(-112%) rotate(-5deg)', opacity: 0 },
          ],
          { duration: 420, easing: BEZIER.inOutCubic, fill: 'forwards' },
        )
        const finish = () => {
          a?.cancel()
          setFront(next)
          onAdvance?.(next)
          // the card that left comes back in at the rear
          requestAnimationFrame(() => {
            const back = slotRefs.current[front]
            if (back) {
              const fade = back.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, easing: 'ease-out' })
              fade.onfinish = () => fade.cancel()
            }
            fillStars(next)
            busy.current = false
          })
        }
        if (a) a.onfinish = finish
        else finish()
      } else {
        // previous: the new front slides in from the left
        setFront(next)
        onAdvance?.(next)
        requestAnimationFrame(() => {
          const slot = slotRefs.current[next]
          const a = slot?.animate(
            [
              { transform: 'translateX(-112%) rotate(-5deg)', opacity: 0 },
              { transform: 'translateX(0) rotate(0)', opacity: 1 },
            ],
            { duration: 420, easing: BEZIER.outCubic },
          )
          const done = () => {
            a?.cancel()
            fillStars(next)
            busy.current = false
          }
          if (a) a.onfinish = done
          else done()
        })
      }
    },
    [N, front, isStatic, onAdvance, fillStars],
  )

  // spring easing is resolved client-side (feature-detected), so it is set after mount
  useEffect(() => {
    ref.current?.style.setProperty('--deck-ease', SPRING.SETTLE)
  }, [])

  // first star fill when the deck comes on screen
  useEffect(() => {
    if (!full || !onScreen || started.current) return
    started.current = true
    fillStars(front)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [full, onScreen])

  // auto-advance while visible, on a visible tab, not hovered / focused
  useEffect(() => {
    if (!full || !onScreen || !pageVisible || paused || N < 2) return
    const id = window.setTimeout(() => advance(1), interval)
    return () => window.clearTimeout(id)
  }, [full, onScreen, pageVisible, paused, N, interval, advance, front])

  // swipe
  const px = useRef<number | null>(null)
  const onPointerDown = (e: React.PointerEvent) => {
    px.current = e.clientX
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (px.current === null) return
    const dx = e.clientX - px.current
    px.current = null
    if (Math.abs(dx) > 40) advance(dx < 0 ? 1 : -1)
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      advance(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      advance(-1)
    }
  }

  if (N === 0) return null
  const state = isStatic || mode !== 'full' ? 'static' : 'done'
  const deckStyle = { ...style, ['--v' as string]: String(V) } as CSSProperties

  return (
    <div
      ref={ref}
      className={[kit.kit, styles.root, className ?? ''].filter(Boolean).join(' ')}
      style={deckStyle}
      data-motion="review-deck"
      data-motion-state={state}
      data-motion-trigger="interaction"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={onKeyDown}
    >
      <div className={styles.deck} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => (px.current = null)}>
        {reviews.map((r, i) => {
          const k = (i - front + N) % N
          const hidden = k >= V
          return (
            <div
              key={`${r.name}-${i}`}
              ref={(el) => {
                slotRefs.current[i] = el
              }}
              className={styles.slot}
              style={{ ['--k' as string]: Math.min(k, V - 1) } as CSSProperties}
              data-hidden={hidden}
              data-front={k === 0}
              aria-hidden={k !== 0}
              aria-current={k === 0 ? 'true' : undefined}
            >
              {renderCard ? renderCard(r, i, k === 0) : <DefaultCard r={r} sourceLabel={sourceLabel} className={cardClassName} />}
            </div>
          )
        })}
      </div>
      {N > 1 && (
        <div className={styles.controls}>
          <span className={styles.count} aria-live="polite">
            {String(front + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
          </span>
          <button type="button" className={styles.ctrl} onClick={() => advance(-1)} aria-label="Previous review">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button type="button" className={styles.ctrl} onClick={() => advance(1)} aria-label="Next review">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
