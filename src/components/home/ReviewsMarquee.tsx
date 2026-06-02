'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import styles from './ReviewsMarquee.module.css'

export type MarqueeReview = {
  quote: string
  name: string
  stars: number
  avatar?: string | null
  date?: string | null
}

const DURATION = 90 // seconds per full loop

function Stars({ count }: { count: number }) {
  return (
    <span className={styles.stars} role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" width="13" height="13" fill={i < count ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={i < count ? 0 : 1.2} aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  )
}

function fmtDate(iso?: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function initials(name: string): string {
  return name.split(' ').map((n) => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'G'
}

function ReviewCard({ r }: { r: MarqueeReview }) {
  const date = fmtDate(r.date)
  return (
    <article className={`${styles.card} glass`}>
      <div className={styles.cardTop}>
        <Stars count={r.stars} />
        <span className={styles.googleTag}>Google</span>
      </div>
      <p className={styles.quote}>{r.quote}</p>
      <div className={styles.person}>
        {r.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={r.avatar} alt="" className={styles.avatar} width={36} height={36} loading="lazy" decoding="async" referrerPolicy="no-referrer" />
        ) : (
          <span className={styles.avatarFallback} aria-hidden="true">{initials(r.name)}</span>
        )}
        <span className={styles.personMeta}>
          <span className={styles.name}>{r.name}</span>
          {date && <span className={styles.date}>{date}</span>}
        </span>
      </div>
    </article>
  )
}

export function ReviewsMarquee({
  reviews,
  rating,
  leaveReviewUrl,
}: {
  reviews: MarqueeReview[]
  rating: { average: number; count: number }
  leaveReviewUrl: string
}) {
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const enter = () => setPaused(true)
    const leave = () => setPaused(false)
    el.addEventListener('mouseenter', enter)
    el.addEventListener('mouseleave', leave)
    el.addEventListener('focusin', enter)
    el.addEventListener('focusout', leave)
    return () => {
      el.removeEventListener('mouseenter', enter)
      el.removeEventListener('mouseleave', leave)
      el.removeEventListener('focusin', enter)
      el.removeEventListener('focusout', leave)
    }
  }, [])

  if (!reviews.length) return null
  // Duplicate so the -50% loop is seamless
  const reel = [...reviews, ...reviews]

  return (
    <>
      <p className={styles.eyebrow}>What clients say</p>
      <p className={styles.rating}>
        <span className={styles.ratingStars} aria-hidden="true">★</span>
        {rating.average.toFixed(1)}
        <span className={styles.ratingFrom}>from {rating.count} Google reviews</span>
      </p>

      <div ref={ref} className={styles.viewport}>
        <motion.div
          className={styles.track}
          animate={reduced || paused ? { x: 0 } : { x: ['0%', '-50%'] }}
          transition={reduced || paused ? { duration: 0 } : { x: { repeat: Infinity, ease: 'linear', duration: DURATION } }}
        >
          {reel.map((r, i) => (
            <ReviewCard key={`${r.name}-${i}`} r={r} />
          ))}
        </motion.div>
      </div>

      <a className={styles.readAll} href={leaveReviewUrl} target="_blank" rel="noopener noreferrer" data-cursor-label="Google">
        Read all reviews on Google →
      </a>
    </>
  )
}
