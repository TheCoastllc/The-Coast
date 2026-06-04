import type { Metadata } from 'next'
import CinematicWorkFeed from '@/components/CinematicWorkFeed'
import { DEFAULT_OG_IMAGES } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Our Work - Brand Transformations',
  description:
    'Brand transformations, creative projects, and the stories behind them - logo design, rebrands, and full visual identities from The Coast.',
  alternates: { canonical: 'https://coastglobal.org/work' },
  openGraph: {
    type: 'website',
    title: 'Our Work | Brand Transformations | The Coast',
    description: 'Brand transformations, creative projects, and the stories behind them.',
    url: 'https://coastglobal.org/work',
    images: DEFAULT_OG_IMAGES,
  },
}

const workBreadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coastglobal.org' },
    { '@type': 'ListItem', position: 2, name: 'Work', item: 'https://coastglobal.org/work' },
  ],
}

const workCollectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://coastglobal.org/work#webpage',
  url: 'https://coastglobal.org/work',
  name: 'Our Work',
  description: 'Explore brand transformations, logo design projects, and creative work from The Coast.',
  isPartOf: { '@id': 'https://coastglobal.org/#website' },
}

// The /work index is the cinematic, video-driven feed: full-bleed brand-color
// takeover sections, one per project, with hover/scroll-play scroll videos.
// (Detail pages at /work/[projectId] stay on their own cinematic renderer.)
export default function WorkPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(workBreadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(workCollectionSchema) }} />
      <CinematicWorkFeed />
    </>
  )
}
