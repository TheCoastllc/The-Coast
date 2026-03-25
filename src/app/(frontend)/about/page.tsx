import type { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'About The Coast',
  description:
    'The Coast was built to level the playing field — giving entrepreneurs, startups, and small businesses the branding power that makes people stop, look, and remember.',
  alternates: { canonical: 'https://www.coastglobal.org/about' },
  openGraph: {
    title: 'About The Coast | Brand Design Studio',
    description:
      'Founded by David Coast, we turn visions into empires. Professional branding for entrepreneurs, artists, and growing businesses.',
    url: 'https://www.coastglobal.org/about',
  },
}

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': 'https://www.coastglobal.org/about#webpage',
  url: 'https://www.coastglobal.org/about',
  name: 'About The Coast',
  description:
    'Founded by David Coast, The Coast is a brand design studio building unforgettable visual identities for entrepreneurs, artists, and growing businesses.',
  isPartOf: { '@id': 'https://www.coastglobal.org/#website' },
  about: { '@id': 'https://www.coastglobal.org/#organization' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.coastglobal.org' },
      { '@type': 'ListItem', position: 2, name: 'About', item: 'https://www.coastglobal.org/about' },
    ],
  },
}

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />
      <AboutClient />
    </>
  )
}
