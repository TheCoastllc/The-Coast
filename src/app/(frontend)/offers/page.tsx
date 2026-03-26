import type { Metadata } from 'next'
import { BlueprintLayout, SectionBoundary } from '@/components/blueprint-layout'
import TextReveal from '@/components/TextReveal'
import { ShineButton } from '@/components/ui/ShineButton'
import { FadeOnLoad, FadeOnScroll, SubtleLabel } from '../about/AboutPageAnimations'
import { OfferCard } from './OfferCard'

export const metadata: Metadata = {
  title: 'Free Brand Tools',
  description:
    'Free interactive brand diagnostic tools: take our brand quiz, score your brand consistency, and run the 3-second test to see what your brand is really saying.',
  alternates: { canonical: 'https://coastglobal.org/offers' },
  openGraph: {
    title: 'Free Brand Tools | The Coast',
    description:
      'Three free interactive tools to diagnose your brand strength, consistency, and first impressions.',
    url: 'https://coastglobal.org/offers',
  },
}

const offersSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'The Coast - Free Brand Tools',
  url: 'https://coastglobal.org/offers',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'WebApplication',
        name: 'Brand Quiz',
        url: 'https://offers.coastglobal.org/brand-quiz',
        applicationCategory: 'BusinessApplication',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'WebApplication',
        name: 'Brand Consistency Checklist',
        url: 'https://offers.coastglobal.org/brand-checklist',
        applicationCategory: 'BusinessApplication',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'WebApplication',
        name: 'The 3-Second Brand Test',
        url: 'https://offers.coastglobal.org/3-second-test',
        applicationCategory: 'BusinessApplication',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coastglobal.org' },
    { '@type': 'ListItem', position: 2, name: 'Offers', item: 'https://coastglobal.org/offers' },
  ],
}

const offers = [
  {
    number: '01',
    title: 'Brand Quiz',
    tagline: "What's Your Brand Actually Saying?",
    description:
      '10 questions. 60 seconds. Find out if your brand is invisible, inconsistent, or established \u2014 and get a clear action plan to fix it.',
    href: 'https://offers.coastglobal.org/brand-quiz',
    cta: 'Take the Quiz',
    stats: [
      { value: '60s', label: 'Time' },
      { value: '10', label: 'Questions' },
      { value: 'Free', label: 'Cost' },
    ],
  },
  {
    number: '02',
    title: 'Brand Consistency Checklist',
    tagline: 'Is Your Brand Leaking Trust?',
    description:
      '25 checkpoints across five brand pillars. Your score updates in real time as you check each box. See exactly where your brand is losing credibility.',
    href: 'https://offers.coastglobal.org/brand-checklist',
    cta: 'Score Your Brand',
    stats: [
      { value: '25', label: 'Items' },
      { value: '5', label: 'Categories' },
      { value: 'Free', label: 'Cost' },
    ],
  },
  {
    number: '03',
    title: 'The 3-Second Test',
    tagline: 'How Customers Judge Your Brand Before You Say a Word',
    description:
      'Learn the five things customers process in the first three seconds of seeing your brand \u2014 and run a self-test to see if you pass.',
    href: 'https://offers.coastglobal.org/3-second-test',
    cta: 'Run the Test',
    stats: [
      { value: '5', label: 'Elements' },
      { value: '3', label: 'Outcomes' },
      { value: 'Free', label: 'Cost' },
    ],
  },
]

export default function OffersPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offersSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <BlueprintLayout>
        {/* Hero */}
        <section className="pt-32 pb-12 md:pt-40 md:pb-16">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <SubtleLabel className="text-mono text-muted-foreground/40 text-xs uppercase tracking-widest block mb-4">
              Free Brand Diagnostic Tools
            </SubtleLabel>
            <TextReveal as="h1" className="text-heading text-4xl md:text-6xl lg:text-7xl mb-6">
              Know Your Brand
            </TextReveal>
            <p className="text-body text-muted-foreground text-lg md:text-xl max-w-2xl">
              Three free interactive tools to diagnose your brand strength, find consistency gaps, and test your first impressions.
            </p>

            <FadeOnLoad delay={0.3} className="flex items-center gap-8 mt-10 pt-8 border-t border-border">
              {[
                { value: '3', label: 'Tools' },
                { value: '60s', label: 'Each' },
                { value: 'Free', label: 'Always' },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-heading text-2xl md:text-3xl text-foreground">{value}</span>
                  <span className="text-mono text-xs text-muted-foreground/60 uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </FadeOnLoad>
          </div>
        </section>

        <SectionBoundary />

        {/* Offer Cards */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="flex items-center gap-4 mb-8 border-t border-border pt-4">
              <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary/60">
                Interactive Tools
              </span>
              <span className="text-mono text-[10px] text-muted-foreground/30 ml-auto">
                01 &ndash; 03
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
              {offers.map((offer, i) => (
                <OfferCard key={offer.number} offer={offer} index={i} />
              ))}
            </div>
          </div>
        </section>

        <SectionBoundary />

        {/* Educational content */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-12">
            <FadeOnScroll>
              <h2 className="text-heading text-2xl md:text-3xl text-foreground mb-4">
                Why Brand Diagnostics Matter
              </h2>
              <p className="text-body text-muted-foreground text-base leading-relaxed max-w-3xl">
                Most businesses never step back and look at their brand the way their customers do. Research shows that consumers form lasting impressions within milliseconds of encountering a brand &mdash; and those impressions directly affect whether they stay, trust, or buy. A brand diagnostic gives you a clear, honest picture of what your brand is communicating right now. It reveals blind spots in your visual identity, messaging, and overall consistency that you cannot see from the inside. These tools are designed to surface the gaps between what you think your brand says and what your audience actually experiences, so you can take targeted action instead of guessing.
              </p>
            </FadeOnScroll>
          </div>
        </section>

        <SectionBoundary />

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <FadeOnScroll className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <p className="text-mono text-muted-foreground/40 text-xs uppercase tracking-widest mb-2">Ready to go deeper?</p>
                <p className="text-heading text-2xl md:text-4xl text-foreground max-w-md">
                  Get a full brand audit from our team.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <ShineButton href="/get-started" size="md">Get Started</ShineButton>
                <ShineButton href="/pricing" size="md" variant="ghost">View Pricing</ShineButton>
              </div>
            </FadeOnScroll>
          </div>
        </section>
      </BlueprintLayout>
    </>
  )
}
