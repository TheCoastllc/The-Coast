import type { Metadata } from 'next'
import { Footer } from '@/components/footer'
import './gallery-theme.css'

const SITE_URL = 'https://gallery.coastglobal.org'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: 'The Coast Global Gallery - Artwork & Creatives',
    template: '%s | The Coast Global Gallery',
  },

  description:
    'A curated, ever-growing gallery of artwork, imagery, and original creatives from The Coast Global. Follow on Pinterest or shop the collection.',

  keywords: [
    'art gallery',
    'creative artwork',
    'design prints',
    'brand art',
    'The Coast Global',
  ],

  authors: [{ name: 'The Coast Global', url: 'https://coastglobal.org' }],
  creator: 'The Coast Global',
  publisher: 'The Coast Global',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'The Coast Global Gallery',
    title: 'The Coast Global Gallery - Artwork & Creatives',
    description:
      'A curated gallery of artwork, imagery, and original creatives from The Coast Global.',
    images: [
      {
        url: '/preview.jpg',
        width: 1600,
        height: 900,
        alt: 'The Coast Global Gallery',
        type: 'image/jpeg',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@TheCoastHQ',
    creator: '@TheCoastHQ',
    title: 'The Coast Global Gallery - Artwork & Creatives',
    description: 'A curated gallery of artwork, imagery, and original creatives from The Coast Global.',
    images: ['/preview.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: SITE_URL,
  },
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer variant="minimal" />
    </>
  )
}
