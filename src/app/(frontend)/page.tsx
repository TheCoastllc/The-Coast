import type { Metadata } from 'next'
import { HomeOcean } from '@/components/home/HomeOcean'
import { fetchReviews, getReviewStats, LEAVE_REVIEW_URL } from '@/lib/google-reviews'
import { DEFAULT_OG_IMAGES } from '@/lib/seo'
import { getPayloadClient } from '@/lib/payload-client'
import type { GalleryPreviewItem } from '@/components/home/GalleryPreview'

export const revalidate = 3600

export const metadata: Metadata = {
  title: { absolute: 'The Coast | Brand Design Studio' },
  description:
    'The Coast is a brand design studio building unforgettable visual identities for entrepreneurs, artists, and growing businesses. Logo design, brand strategy, and more.',
  alternates: { canonical: 'https://coastglobal.org' },
  openGraph: {
    type: 'website',
    url: 'https://coastglobal.org',
    title: 'The Coast | Brand Design Studio',
    description:
      'Building unforgettable visual identities for entrepreneurs, artists, and growing businesses.',
    images: DEFAULT_OG_IMAGES,
  },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://coastglobal.org/#website',
  url: 'https://coastglobal.org',
  name: 'The Coast',
  description: 'Brand design studio building unforgettable visual identities.',
  publisher: { '@id': 'https://coastglobal.org/#organization' },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://coastglobal.org/#organization',
  name: 'The Coast',
  alternateName: 'Coast Global',
  url: 'https://coastglobal.org',
  logo: {
    '@type': 'ImageObject',
    url: 'https://coastglobal.org/full-logo.png',
    width: 200,
    height: 60,
  },
  description:
    'Brand design studio building unforgettable visual identities for entrepreneurs, artists, and growing businesses.',
  email: 'hello@coastglobal.org',
  telephone: '+16827020374',
  foundingDate: '2023-02',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    telephone: '+16827020374',
    email: 'hello@coastglobal.org',
    availableLanguage: 'English',
  },
  // NOTE: No aggregateRating here. Google's structured-data policy forbids
  // self-serving ratings (reviews about the business, collected on its own site)
  // on Organization/LocalBusiness - they are ineligible for star rich results and
  // can trigger a manual action. Real Google reviews still render on-page via
  // ReviewsMarquee. To re-add a rating legitimately, mark up individual Review
  // items sourced from a third party (e.g. Google) and attach them here.
  sameAs: [
    'https://www.instagram.com/coastglobal',
    'https://www.facebook.com/coastglobal',
    'https://www.linkedin.com/company/thecoastcompanylimited/',
    'https://x.com/TheCoastHQ',
  ],
}

const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://coastglobal.org/#professional-service',
  name: 'The Coast',
  alternateName: 'Coast Global',
  url: 'https://coastglobal.org',
  logo: {
    '@type': 'ImageObject',
    url: 'https://coastglobal.org/full-logo.png',
    width: 200,
    height: 60,
  },
  image: { '@type': 'ImageObject', url: 'https://coastglobal.org/preview.jpg' },
  description:
    'Strategic brand design for entrepreneurs, artists, and growing businesses. Logo design, visual identity, brand strategy, and marketing assets.',
  email: 'hello@coastglobal.org',
  telephone: '+16827020374',
  priceRange: '$$',
  areaServed: { '@type': 'Place', name: 'World' },
  address: { '@type': 'PostalAddress', addressCountry: 'US' },
  sameAs: [
    'https://www.instagram.com/coastglobal',
    'https://www.facebook.com/coastglobal',
    'https://www.linkedin.com/company/thecoastcompanylimited/',
    'https://x.com/TheCoastHQ',
  ],
}

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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }} />
      <HomeOcean reviews={reviews} reviewStats={reviewStats} leaveReviewUrl={LEAVE_REVIEW_URL} galleryPreview={galleryPreview} />
    </>
  )
}
