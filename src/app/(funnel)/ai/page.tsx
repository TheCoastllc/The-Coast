import type { Metadata } from 'next'
import { fetchReviews, getReviewStats } from '@/lib/google-reviews'
import { AiFunnelClient, type FunnelProof } from './AiFunnelClient'

export const revalidate = 3600

const PAGE_URL = 'https://coastglobal.org/ai'
const TITLE = 'AI Consulting & Implementation | The Coast'
const DESCRIPTION =
  "From 'we should use AI' to real, working systems. The Coast designs, builds, and deploys AI for founders and growth-stage teams. Book an AI Strategy Session."

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'website',
    url: PAGE_URL,
    siteName: 'The Coast',
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
  try {
    const stats = getReviewStats(await fetchReviews())
    if (stats.count > 0) proof = { average: stats.averageRating, count: stats.count }
  } catch {
    /* strip renders without the rating */
  }
  return <AiFunnelClient proof={proof} />
}
