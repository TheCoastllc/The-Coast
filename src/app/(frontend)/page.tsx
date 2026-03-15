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
  alternates: { canonical: 'https://coastglobal.org' },
  openGraph: {
    type: 'website',
    url: 'https://coastglobal.org',
    title: 'The Coast | Brand Design Studio',
    description:
      'Building unforgettable visual identities for entrepreneurs, artists, and growing businesses.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://coastglobal.org/#organization',
  name: 'The Coast',
  alternateName: 'Coast Global',
  url: 'https://coastglobal.org',
  logo: 'https://coastglobal.org/full-logo.png',
  image: 'https://coastglobal.org/preview.jpg',
  description:
    'Strategic brand design for entrepreneurs, artists, and growing businesses. Logo design, visual identity, brand strategy, and marketing assets.',
  email: 'hello@coastglobal.org',
  sameAs: [
    'https://www.instagram.com/coastglobal',
    'https://www.facebook.com/coastglobal',
    'https://www.linkedin.com/company/thecoastcompanylimited/',
    'https://x.com/TheCoastHQ',
  ],
  serviceType: [
    'Logo Design',
    'Visual Identity',
    'Brand Strategy',
    'Marketing Assets',
    'Website Design',
    'Social Media Graphics',
  ],
  areaServed: 'Worldwide',
  knowsAbout: [
    'Brand Design',
    'Visual Identity',
    'Logo Design',
    'Brand Strategy',
    'Marketing',
  ],
}

export default function HomePage() {
  return (
    <BlueprintLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
