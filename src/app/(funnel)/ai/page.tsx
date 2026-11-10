import type { Metadata } from 'next'
import { fetchReviews, getReviewStats } from '@/lib/google-reviews'
import { AiFunnelClient, type FunnelProof } from './AiFunnelClient'
import type { MarqueeReview } from '@/lib/review-types'

export const revalidate = 3600

const PAGE_URL = 'https://coastglobal.org/ai'
const TITLE = 'AI Consulting & Implementation | The Coast Global'
const DESCRIPTION =
  "From 'we should use AI' to real, working systems. The Coast Global designs, builds, and deploys AI for founders and growth-stage teams. Book an AI Strategy Session."

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'website',
    url: PAGE_URL,
    siteName: 'The Coast Global',
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@TheCoastHQ',
    creator: '@TheCoastHQ',
    title: TITLE,
    description: DESCRIPTION,
  },
}

export default async function AiFunnelPage() {
  // Live Google rating for the hero proof strip (same source as the homepage).
  // Null on failure - the strip gracefully renders the STATS-only entries.
  let proof: FunnelProof = null
  let deck: MarqueeReview[] = []
  try {
    const all = await fetchReviews()
    const stats = getReviewStats(all)
    if (stats.count > 0) proof = { average: stats.averageRating, count: stats.count }
    // the #why deck: substantive 4-5 star quotes, newest first, four cards
    deck = all
      .filter((r) => r.starRating >= 4 && (r.comment ?? '').trim().length > 60)
      .sort((a, b) => new Date(b.createTime ?? 0).getTime() - new Date(a.createTime ?? 0).getTime())
      .slice(0, 4)
      .map((r) => ({
        quote: r.comment,
        name: r.reviewer.displayName || 'Google reviewer',
        stars: Math.round(r.starRating) || 5,
        avatar: r.reviewer.profilePhotoUrl || null,
        date: r.createTime || r.updateTime || null,
      }))
  } catch {
    /* strip renders without the rating; the deck simply does not render */
  }
  return <AiFunnelClient proof={proof} reviews={deck} />
}
