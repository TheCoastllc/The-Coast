// Shared Google Reviews data layer.
//
// One server-side fetch backs:
//  - The hero rating badge (component: <RatingBadge />)
//  - The homepage reviews section (component: <GoogleReviewsClient />)
//  - The Organization JSON-LD aggregateRating
//
// Data source: Featurable widget proxy of Google Place reviews.
// Cached 5h (18000s) via Next.js fetch revalidate to stay under quota.

const FEATURABLE_WIDGET_ID = '0678c24f-9212-4556-9ffa-baa00fe37ddb'
const API_URL = `https://featurable.com/api/v1/widgets/${FEATURABLE_WIDGET_ID}`

// Mirrors the `react-google-reviews` GoogleReview shape so values from the
// fallback client widget are assignable to ours without a type cast.
export interface GoogleReview {
  reviewId: string | null
  reviewer: {
    profilePhotoUrl: string
    displayName: string
    isAnonymous: boolean
  }
  starRating: number
  comment: string
  createTime: string | null
  updateTime: string | null
}

export interface ReviewStats {
  count: number
  /** Average rating across all reviews, rounded to one decimal. 0 if no reviews. */
  averageRating: number
}

/**
 * Fetch Google reviews via Featurable. Returns [] on any failure — callers must
 * handle the empty case gracefully (don't render a broken section).
 */
export async function fetchReviews(): Promise<GoogleReview[]> {
  try {
    const res = await fetch(API_URL, { next: { revalidate: 18000 } })
    if (!res.ok) return []
    const data = await res.json()
    return (data.reviews ?? []).map(
      (r: any): GoogleReview => ({
        reviewId: r.reviewId ?? null,
        reviewer: {
          profilePhotoUrl: r.reviewer?.profilePhotoUrl ?? '',
          displayName: r.reviewer?.displayName ?? 'Anonymous',
          isAnonymous: false,
        },
        starRating: Number(r.starRating ?? 0),
        comment: r.comment ?? '',
        createTime: r.createTime ?? null,
        updateTime: r.updateTime ?? null,
      })
    )
  } catch {
    return []
  }
}

/** Derived stats for badges + schema. Safe to call with any review list. */
export function getReviewStats(reviews: GoogleReview[]): ReviewStats {
  if (reviews.length === 0) return { count: 0, averageRating: 0 }
  const sum = reviews.reduce((acc, r) => acc + (r.starRating || 0), 0)
  return {
    count: reviews.length,
    averageRating: Math.round((sum / reviews.length) * 10) / 10,
  }
}

/**
 * One-shot helper for components that just need the stats (e.g. hero badge).
 * Shares the same revalidate cache as fetchReviews().
 */
export async function fetchReviewStats(): Promise<ReviewStats> {
  return getReviewStats(await fetchReviews())
}

export const REVIEW_PLACE_ID = 'ChIJ_fjV-mLpAo4Riif8WzjsV70'
export const LEAVE_REVIEW_URL = `https://search.google.com/local/writereview?placeid=${REVIEW_PLACE_ID}`
