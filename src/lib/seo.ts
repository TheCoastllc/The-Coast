import type { Metadata } from 'next'

export const DEFAULT_OG_IMAGES: NonNullable<NonNullable<Metadata['openGraph']>['images']> = [
  {
    url: '/preview.jpg',
    width: 1600,
    height: 900,
    alt: 'The Coast Global - Brand Design Studio',
    type: 'image/jpeg',
  },
]

export const DEFAULT_TWITTER_IMAGES: NonNullable<NonNullable<Metadata['twitter']>['images']> = [
  '/preview.jpg',
]

/**
 * Build a page-specific Twitter/X card. Next.js does NOT derive twitter from a
 * per-page openGraph block, so static pages that set only openGraph fall back to
 * the layout's generic homepage twitter title/description. Pass the page's own
 * title + description so the X card matches the page.
 */
export function buildTwitter(opts: {
  title: string
  description: string
}): NonNullable<Metadata['twitter']> {
  return {
    card: 'summary_large_image',
    title: opts.title,
    description: opts.description,
    images: DEFAULT_TWITTER_IMAGES,
  }
}
