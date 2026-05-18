import type { Metadata } from 'next'

export const DEFAULT_OG_IMAGES: NonNullable<NonNullable<Metadata['openGraph']>['images']> = [
  {
    url: '/preview.jpg',
    width: 1600,
    height: 900,
    alt: 'The Coast — Brand Design Studio',
    type: 'image/jpeg',
  },
]

export const DEFAULT_TWITTER_IMAGES: NonNullable<NonNullable<Metadata['twitter']>['images']> = [
  '/preview.jpg',
]
