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

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://coastglobal.org/#website',
  url: 'https://coastglobal.org',
  name: 'The Coast',
  description: 'Brand design studio building unforgettable visual identities.',
  publisher: { '@id': 'https://coastglobal.org/#organization' },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://coastglobal.org/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is your typical project timeline?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our engagements typically range from 2 to 6 weeks, depending on the scope and complexity of the project. A standalone logo design with three concepts and two revision rounds usually takes 2 to 3 weeks from kickoff to final delivery. A full brand identity system - including logo, color palette, typography, brand guidelines, and initial marketing collateral - typically runs 4 to 6 weeks. Every project follows our four-step process: Discover, Design, Develop, and Launch. The Discover phase (3–5 days) involves a deep-dive session into your business, audience, and competitors. Design (1–2 weeks) produces initial concepts. Develop (1–2 weeks) refines the chosen direction through revisions. Launch delivers production-ready assets in all required formats. We believe in moving fast without compromising on quality, and we provide clear milestone dates at the start of every engagement so you always know what to expect.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you work with startups or established businesses?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Both. The Coast was built specifically to make professional branding accessible to businesses at every stage. We partner with solo founders, early-stage startups, small businesses, and growing companies who are ready to level up their brand presence. Many of our clients are entrepreneurs launching their first business and need a complete brand identity from scratch - logo, visual system, website, and marketing materials. Others are established businesses going through a rebrand because their current identity no longer reflects who they are or where they are headed. We have delivered projects across industries including tech, healthcare, e-commerce, entertainment, food and beverage, and professional services. What unites our clients is ambition: they want a visual identity that commands attention, builds trust with their audience, and positions them as leaders in their space - regardless of whether they are a team of one or a team of fifty.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is your pricing structure?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Coast offers two pricing models to fit different business needs. For project-based work, pricing is determined by scope and value rather than hourly rates - a logo design package starts at a different price point than a full rebrand with brand guidelines, website design, and marketing collateral. Every project begins with a free discovery session where we assess your needs, timeline, and budget to create a custom proposal with no surprises. For ongoing support, we offer three monthly retainer tiers: the Starter plan (free) for freelancers and creative beginners includes up to 5 design projects and basic brand kit tools; the Professional plan ($25/month) provides unlimited projects, complete brand management, and team collaboration; and the Enterprise plan ($250/month) adds a dedicated creative strategist, white-label design system, and priority support. Most single projects range from 2 to 6 weeks from kickoff to delivery.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer ongoing support after launch?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes - we view our client relationships as long-term partnerships, not one-off transactions. After your brand launches, your business will continue to evolve, and your brand needs to evolve with it. Our retainer packages provide continuous access to design, development, and strategic support so you never have to scramble for creative resources. Retainer clients receive priority turnaround on new requests, whether that is social media graphics for a campaign, updated pitch decks for investor meetings, new marketing collateral for a product launch, or seasonal refreshes to keep your brand feeling current. We also provide brand governance support - ensuring every new piece of content, every new hire\'s email signature, and every new touchpoint stays consistent with your established brand guidelines. Many of our clients started with a single project and transitioned to a retainer because they experienced how much easier it is to have a dedicated creative partner on call.',
      },
    },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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
