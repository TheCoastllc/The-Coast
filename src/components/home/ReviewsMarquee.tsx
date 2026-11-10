'use client'

import { ReviewDeck } from '@/components/motion/kit'
import type { MarqueeReview } from '@/lib/review-types'
import styles from './ReviewsMarquee.module.css'

export type { MarqueeReview } from '@/lib/review-types'

/**
 * "What clients say": the live Google reviews (insiders already filtered
 * upstream in fetchReviews) dealt as a card stack - ReviewDeck - under the
 * rating line. The eyebrow, rating line and "Read all reviews" link are the
 * section's own; the deck only owns the cards. (This used to be a 90s
 * motion/react marquee; the deck is lighter and readable one quote at a time.)
 */
export function ReviewsMarquee({
  reviews,
  rating,
  leaveReviewUrl,
}: {
  reviews: MarqueeReview[]
  rating: { average: number; count: number } | null
  leaveReviewUrl: string
}) {
  if (!reviews.length) return null

  return (
    <>
      <p className={styles.eyebrow} data-mo="eyebrow">What clients say</p>
      {rating && rating.count > 0 && (
      <p className={styles.rating} data-mo="lead">
        <span className={styles.ratingStars} aria-hidden="true">★</span>
        {rating.average.toFixed(1)}
        <span className={styles.ratingFrom}>from {rating.count} Google reviews</span>
      </p>
      )}

      <div className={styles.deck}>
        <ReviewDeck reviews={reviews} cardClassName="glass" label="Google reviews from clients" />
      </div>

      <a className={styles.readAll} href={leaveReviewUrl} target="_blank" rel="noopener noreferrer" data-cursor-label="Google">
        Read all reviews on Google →
      </a>
    </>
  )
}
