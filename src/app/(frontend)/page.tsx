import type { Metadata } from 'next'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { HeroSection } from '@/components/hero'
import { LogosSection } from '@/components/logos-section'
import { BlueprintLayout, SectionBoundary } from '@/components/blueprint-layout'

const About = dynamic(() => import('@/components/pages/landingPage/About'))
const Services = dynamic(() => import('@/components/pages/landingPage/Services'))
const ProcessSection = dynamic(() => import('@/components/pages/landingPage/ProcessSection'))
const Portfolio = dynamic(() => import('@/components/pages/landingPage/Portfolio'))
const Clients = dynamic(() => import('@/components/pages/landingPage/Clients'))
const GoogleReviews = dynamic(() => import('@/components/pages/landingPage/GoogleReviews'))
import FAQ from '@/components/pages/landingPage/FAQ'
const BlogPreview = dynamic(() => import('@/components/pages/landingPage/BlogPreview'))
const Contact = dynamic(() => import('@/components/pages/landingPage/Contact'))

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
  description: 'Brand design studio building unforgettable visual identities for entrepreneurs, artists, and growing businesses.',
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
    <BlueprintLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }} />
      {/* Hero area */}
      <div className="relative flex min-h-screen flex-col overflow-hidden px-4 supports-[overflow:clip]:overflow-clip">
        <div className="relative max-w-6xl mx-auto grow">
          <HeroSection />
          <LogosSection />
        </div>
      </div>

      <SectionBoundary />
      <About />
      <SectionBoundary />
      <Services />
      <SectionBoundary />
      <ProcessSection />
      <SectionBoundary />
      <Portfolio />
      <SectionBoundary />
      <div className='w-full overflow-hidden'>
        <Clients />
      </div>
      <SectionBoundary />
      <GoogleReviews />
      <SectionBoundary />
      <Suspense fallback={<div className="py-32 bg-black px-4"><div className="max-w-6xl mx-auto h-96 animate-pulse" /></div>}>
        <FAQ />
      </Suspense>
      <SectionBoundary />
      <Suspense fallback={
        <div className="py-32 bg-black px-4">
          <div className="max-w-6xl mx-auto px-2 sm:px-4">
            <div className="h-6 w-32 bg-white/5 rounded mb-20 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 border border-white/10">
              {[0, 1, 2].map((i) => (
                <div key={i} className="aspect-square p-8 md:p-10 border-b md:border-b-0 md:border-r last:border-r-0 border-white/10 animate-pulse">
                  <div className="h-3 w-20 bg-white/5 rounded mb-auto" />
                  <div className="mt-auto space-y-2">
                    <div className="h-6 w-3/4 bg-white/5 rounded" />
                    <div className="h-6 w-1/2 bg-white/5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }>
        <BlogPreview />
      </Suspense>
      <SectionBoundary />
      <Contact />
    </BlueprintLayout>
  )
}
