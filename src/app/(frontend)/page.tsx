import type { Metadata } from 'next'
import { Suspense } from 'react'
import About from '@/components/pages/landingPage/About'
import Services from '@/components/pages/landingPage/Services'
import ProcessSection from '@/components/pages/landingPage/ProcessSection'
import Portfolio from '@/components/pages/landingPage/Portfolio'
import Clients from '@/components/pages/landingPage/Clients'
import FAQ from '@/components/pages/landingPage/FAQ'
import BlogPreview from '@/components/pages/landingPage/BlogPreview'
import Contact from '@/components/pages/landingPage/Contact'
import { HeroSection } from '@/components/hero'
import { LogosSection } from '@/components/logos-section'
import { BlueprintLayout, SectionBoundary } from '@/components/blueprint-layout'

export const metadata: Metadata = {
  title: { absolute: 'The Coast | Brand Design Studio' },
  description:
    'The Coast is a brand design studio building unforgettable visual identities for entrepreneurs, artists, and growing businesses. Logo design, brand strategy, and more.',
  alternates: { canonical: 'https://www.coastglobal.org' },
  openGraph: {
    type: 'website',
    url: 'https://www.coastglobal.org',
    title: 'The Coast | Brand Design Studio',
    description:
      'Building unforgettable visual identities for entrepreneurs, artists, and growing businesses.',
  },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.coastglobal.org/#website',
  url: 'https://www.coastglobal.org',
  name: 'The Coast',
  description: 'Brand design studio building unforgettable visual identities.',
  publisher: { '@id': 'https://www.coastglobal.org/#organization' },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.coastglobal.org/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://www.coastglobal.org/#organization',
  name: 'The Coast',
  alternateName: 'Coast Global',
  url: 'https://www.coastglobal.org',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.coastglobal.org/full-logo.png',
    width: 200,
    height: 60,
  },
  email: 'hello@coastglobal.org',
  telephone: '+16827020374',
  foundingDate: '2024',
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
  '@id': 'https://www.coastglobal.org/#professional-service',
  name: 'The Coast',
  alternateName: 'Coast Global',
  url: 'https://www.coastglobal.org',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.coastglobal.org/full-logo.png',
    width: 200,
    height: 60,
  },
  image: { '@type': 'ImageObject', url: 'https://www.coastglobal.org/preview.jpg' },
  description:
    'Strategic brand design for entrepreneurs, artists, and growing businesses. Logo design, visual identity, brand strategy, and marketing assets.',
  email: 'hello@coastglobal.org',
  telephone: '+16827020374',
  priceRange: '$$',
  areaServed: 'World',
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
      <FAQ />
      <SectionBoundary />
      <Suspense>
        <BlogPreview />
      </Suspense>
      <SectionBoundary />
      <Contact />
    </BlueprintLayout>
  )
}
