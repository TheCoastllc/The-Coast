import type { Metadata } from 'next'
import { HomeOcean } from '@/components/home/HomeOcean'
import { DEFAULT_OG_IMAGES } from '@/lib/seo'

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
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: 7,
    bestRating: '5',
    worstRating: '1',
  },
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

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }} />
      <HomeOcean />
    </>
  )
}
