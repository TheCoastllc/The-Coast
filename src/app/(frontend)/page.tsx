import type { Metadata } from 'next'
import { HomeOcean } from '@/components/home/HomeOcean'
import { fetchReviews, getReviewStats, LEAVE_REVIEW_URL } from '@/lib/google-reviews'
import { DEFAULT_OG_IMAGES } from '@/lib/seo'
import { getPayloadClient } from '@/lib/payload-client'
import type { GalleryPreviewItem } from '@/components/home/GalleryPreview'

export const revalidate = 3600

export const metadata: Metadata = {
  title: { absolute: 'The Coast Global | Brand Design Studio' },
  description:
    'The Coast Global is a brand design studio building unforgettable visual identities for entrepreneurs, artists, and growing businesses. Logo design and brand strategy.',
  alternates: { canonical: 'https://coastglobal.org' },
  openGraph: {
    type: 'website',
    url: 'https://coastglobal.org',
    title: 'The Coast Global | Brand Design Studio',
    description:
      'Building unforgettable visual identities for entrepreneurs, artists, and growing businesses.',
    images: DEFAULT_OG_IMAGES,
  },
}

// The WebSite/Organization/ProfessionalService graph now ships sitewide via
// <OrgSchema /> in the root layouts (src/lib/schema.ts) - no homepage-only
// schema blocks, no duplicate nodes.

// A POOL of live published gallery images for the homepage teaser - the client
// shuffles a random 8 of these on each load so it rotates. Excludes the
// "Design the Future" near-duplicate set; empty array on failure (section hides).
async function fetchGalleryPreview(): Promise<GalleryPreviewItem[]> {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'gallery',
      where: { status: { equals: 'published' } },
      sort: ['order', '-publishedAt'],
      depth: 1,
      limit: 60,
    })
    const items: GalleryPreviewItem[] = []
    for (const doc of res.docs as any[]) {
      if ((doc.section ?? '').trim().toLowerCase() === 'design the future') continue
      const img = doc?.image
      const cl = img?.cloudinary
      const src: string | undefined = cl?.secure_url ?? img?.url
      if (!src) continue
      items.push({
        id: doc.id,
        src,
        width: cl?.width ?? img?.width ?? 4,
        height: cl?.height ?? img?.height ?? 5,
      })
      if (items.length >= 24) break
    }
    return items
  } catch {
    return []
  }
}

export default async function HomePage() {
  // Real Google reviews (Featurable proxy, 5h cached). Empty on failure -> HomeOcean
  // falls back to representative samples so the section never renders broken.
  const [raw, galleryPreview] = await Promise.all([fetchReviews(), fetchGalleryPreview()])
  const stats = getReviewStats(raw)
  const reviews = raw
    .filter((r) => r.comment && r.comment.trim().length > 0)
    .slice(0, 20)
    .map((r) => ({
      quote: r.comment,
      name: r.reviewer.displayName || 'Google reviewer',
      stars: Math.round(r.starRating) || 5,
      avatar: r.reviewer.profilePhotoUrl || null,
      date: r.createTime || r.updateTime || null,
    }))
  const reviewStats = { average: stats.averageRating, count: stats.count }

  return (
    <HomeOcean reviews={reviews} reviewStats={reviewStats} leaveReviewUrl={LEAVE_REVIEW_URL} galleryPreview={galleryPreview} />
  )
}
