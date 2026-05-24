import Link from 'next/link'
import { LEAVE_REVIEW_URL, type ReviewStats } from '@/lib/google-reviews'

/**
 * Compact trust badge: "5.0 ★ from N Google reviews".
 * Pure server component — no JS shipped. Hidden entirely when there are no reviews.
 */
export function RatingBadge({
  stats,
  className = '',
}: {
  stats: ReviewStats
  className?: string
}) {
  if (stats.count === 0) return null

  return (
    <Link
      href={LEAVE_REVIEW_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${stats.averageRating} out of 5 stars from ${stats.count} Google reviews — leave a review`}
      className={
        'group inline-flex items-center justify-center gap-2 px-3 py-2 rounded-sm border border-white/10 bg-transparent backdrop-blur-sm hover:border-primary/40 transition-colors ' +
        className
      }
    >
      <span className="flex items-center gap-0.5 text-primary" aria-hidden="true">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="text-[10px] font-mono font-medium text-white leading-none">
          {stats.averageRating.toFixed(1)}
        </span>
      </span>
      <span className="block h-3 border-l border-white/10" aria-hidden="true" />
      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground group-hover:text-white transition-colors leading-none">
        {stats.count} Google {stats.count === 1 ? 'Review' : 'Reviews'}
      </span>
    </Link>
  )
}
