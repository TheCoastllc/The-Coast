import type { Metadata } from 'next'
import { fetchReviews, getReviewStats } from '@/lib/google-reviews'
import { AiFunnelClient, type FunnelProof } from './AiFunnelClient'
import type { MarqueeReview } from '@/lib/review-types'
import type { PulseItem } from '@/components/motion/kit'
import { CASE_STUDIES, CASE_STUDY_ORDER } from '@/lib/case-studies'
import { getPayloadClient } from '@/lib/payload-client'
import { GOOGLE_LISTING_URL } from '@/lib/schema'

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

  // "Recently from the studio": only real, dated items. Any source that fails
  // is simply omitted; the feed renders nothing with fewer than two items.
  const pulse: PulseItem[] = []
  try {
    if (deck[0]?.date) {
      pulse.push({
        kind: 'review',
        title: `${deck[0].stars}-star review from ${deck[0].name}`,
        meta: deck[0].quote.length > 90 ? `${deck[0].quote.slice(0, 88).trimEnd()}…` : deck[0].quote,
        date: deck[0].date,
        href: GOOGLE_LISTING_URL,
      })
    }
  } catch {}
  try {
    const newest = CASE_STUDY_ORDER.map((id) => ({ id, c: CASE_STUDIES[id] }))
      .filter(({ c }) => c?.ready && c.year)
      .sort((a, b) => (b.c.year ?? 0) - (a.c.year ?? 0))[0]
    if (newest) {
      pulse.push({
        kind: 'case',
        title: `Case study: ${newest.c.client ?? newest.id}`,
        meta: newest.c.tagline ?? newest.c.category ?? 'Published',
        date: String(newest.c.year),
        href: `https://coastglobal.org/work/${newest.id}`,
      })
    }
  } catch {}
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const post = res.docs[0] as { title?: string; slug?: string; publishedAt?: string | null; excerpt?: string | null } | undefined
    if (post?.title && post.publishedAt) {
      pulse.push({
        kind: 'post',
        title: post.title,
        meta: post.excerpt ? (post.excerpt.length > 90 ? `${post.excerpt.slice(0, 88).trimEnd()}…` : post.excerpt) : 'From the journal',
        date: post.publishedAt,
        href: post.slug ? `https://coastglobal.org/blog/${post.slug}` : undefined,
      })
    }
  } catch {}
  pulse.sort((a, b) => new Date(b.date.length === 4 ? `${b.date}-01-01` : b.date).getTime() - new Date(a.date.length === 4 ? `${a.date}-01-01` : a.date).getTime())

  return <AiFunnelClient proof={proof} reviews={deck} pulse={pulse} />
}
