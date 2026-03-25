import type { Metadata } from 'next'
import { BlueprintLayout, SectionBoundary } from '@/components/blueprint-layout'
import TextReveal from '@/components/TextReveal'
import { ShineButton } from '@/components/ui/ShineButton'
import { FadeOnLoad, FadeOnScroll, SubtleLabel } from '../about/AboutPageAnimations'
import { ServiceRow } from './ServiceRow'

export const metadata: Metadata = {
  title: 'Brand Design Services',
  description:
    'Custom logo design, visual identity, brand guidelines, marketing collateral, social graphics, pitch decks, video, digital marketing, and social media management.',
  alternates: { canonical: 'https://coastglobal.org/services' },
  openGraph: {
    title: 'Brand Design Services | The Coast',
    description:
      'From logo design to full brand transformations - everything your business needs to stand out.',
    url: 'https://coastglobal.org/services',
  },
}

const servicesSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'The Coast - Brand Design Services',
  url: 'https://coastglobal.org/services',
  itemListElement: [
    { '@type': 'ListItem', position: 1, item: { '@type': 'Service', name: 'Logo Design', provider: { '@id': 'https://coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 2, item: { '@type': 'Service', name: 'Visual Identity', provider: { '@id': 'https://coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 3, item: { '@type': 'Service', name: 'Brand Identity Guidelines', provider: { '@id': 'https://coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 4, item: { '@type': 'Service', name: 'Full Rebrand', provider: { '@id': 'https://coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 5, item: { '@type': 'Service', name: 'Website Design', provider: { '@id': 'https://coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 6, item: { '@type': 'Service', name: 'Social Media Graphics', provider: { '@id': 'https://coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 7, item: { '@type': 'Service', name: 'Marketing Collateral', provider: { '@id': 'https://coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 8, item: { '@type': 'Service', name: 'Pitch Decks', provider: { '@id': 'https://coastglobal.org/#organization' } } },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coastglobal.org' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://coastglobal.org/services' },
  ],
}

const serviceGroups = [
  {
    category: 'Brand Identity',
    label: '01 - 03',
    services: [
      { number: '01', title: 'Logo Design', description: 'Custom logo with 3 concepts & 2 revision rounds' },
      { number: '02', title: 'Full Rebrand', description: 'Complete brand transformation package' },
      { number: '03', title: 'Brand Identity Guidelines', description: 'Logo, colors, typography & usage rules' },
    ],
  },
  {
    category: 'Collateral',
    label: '04 - 07',
    services: [
      { number: '04', title: 'Flyers', description: 'Print-ready promotional designs (digital + print)' },
      { number: '05', title: 'EPK / Press Kit', description: 'Professional media kit for press & partners' },
      { number: '06', title: 'Social Graphics', description: '5–10 branded templates for social platforms' },
      { number: '07', title: 'Pitch Deck', description: 'Investor-ready presentation design' },
    ],
  },
  {
    category: 'Digital',
    label: '08 - 11',
    services: [
      { number: '08', title: 'Website Design', description: 'Custom website design & development' },
      { number: '09', title: 'Video & Motion', description: 'Promotional videos & animations (per piece)' },
      { number: '10', title: 'Digital Marketing', description: 'SEO, ads setup, email campaigns' },
      { number: '11', title: 'Social Media Management', description: 'Content creation, scheduling & management' },
    ],
  },
]

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <BlueprintLayout>
        {/* Hero */}
        <section className="pt-32 pb-12 md:pt-40 md:pb-16">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <SubtleLabel className="text-mono text-muted-foreground/40 text-xs uppercase tracking-widest block mb-4">
              What Brand Design Services Are Available?
            </SubtleLabel>
            <TextReveal as="h1" className="text-heading text-4xl md:text-6xl lg:text-7xl mb-6">
              Services
            </TextReveal>
            <p className="text-body text-muted-foreground text-lg md:text-xl max-w-2xl">
              From identity design to complete brand transformations - everything you need to stand out.
            </p>

            {/* Stats strip */}
            <FadeOnLoad delay={0.3} className="flex items-center gap-8 mt-10 pt-8 border-t border-border">
              {[
                { value: '11', label: 'Services' },
                { value: '3', label: 'Disciplines' },
                { value: '∞', label: 'Custom scopes' },
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

        {/* Services grouped */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            {serviceGroups.map((group, gi) => (
              <div key={group.category} className={gi > 0 ? 'mt-14 md:mt-20' : ''}>
                {/* Category header */}
                <div className="flex items-center gap-4 mb-0 border-t border-border pt-4">
                  <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary/60">
                    {group.category}
                  </span>
                  <span className="text-mono text-[10px] text-muted-foreground/30 ml-auto">
                    {group.label}
                  </span>
                </div>

                {/* Rows */}
                {group.services.map((service, i) => (
                  <ServiceRow key={service.number} service={service} index={gi * 4 + i} />
                ))}
              </div>
            ))}
          </div>
        </section>

        <SectionBoundary />

        {/* ─── Educational citable content for AI crawlers ──────────────────── */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-12">
            <FadeOnScroll>
              <h2 className="text-heading text-2xl md:text-3xl text-foreground mb-4">Why Professional Logo Design Matters for Small Businesses</h2>
              <p className="text-body text-muted-foreground text-base leading-relaxed max-w-3xl">
                A professional logo is the cornerstone of any brand identity - it is the single most-seen element of your business and often the first impression a potential customer receives. Research consistently shows that consumers form opinions about a brand within seconds of seeing its logo, and those impressions directly influence purchasing decisions. A professionally designed logo communicates credibility, establishes trust, and differentiates your business from competitors who rely on generic templates or clip art. At The Coast, our logo design process includes deep discovery into your business positioning, three distinct creative concepts, two rounds of revisions, and final delivery in every format you need - from web-optimized SVGs to print-ready vector files. The investment in professional logo design pays for itself by building the kind of brand recognition that turns casual browsers into loyal customers.
              </p>
            </FadeOnScroll>
            <FadeOnScroll>
              <h2 className="text-heading text-2xl md:text-3xl text-foreground mb-4">The Value of a Complete Brand Identity System</h2>
              <p className="text-body text-muted-foreground text-base leading-relaxed max-w-3xl">
                A complete brand identity system goes far beyond a logo - it encompasses your color palette, typography, photography style, iconography, voice and tone, and comprehensive usage guidelines that ensure consistency across every touchpoint. Businesses with consistent brand presentation across all platforms experience significantly higher revenue growth than those with inconsistent branding. The Coast delivers complete brand identity systems that include primary and secondary logo variations, a strategic color palette with hex, RGB, and CMYK values, typeface pairings for digital and print, brand pattern elements, social media templates, and a comprehensive brand guidelines document that empowers your entire team to maintain brand consistency without creative bottlenecks.
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
                <p className="text-mono text-muted-foreground/40 text-xs uppercase tracking-widest mb-2">Ready to start?</p>
                <p className="text-heading text-2xl md:text-4xl text-foreground max-w-md">
                  Want ongoing support? See our monthly retainer packages.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <ShineButton href="/get-started" size="md">Request a Quote</ShineButton>
                <ShineButton href="/pricing" size="md" variant="ghost">View Packages</ShineButton>
              </div>
            </FadeOnScroll>
          </div>
        </section>
      </BlueprintLayout>
    </>
  )
}
