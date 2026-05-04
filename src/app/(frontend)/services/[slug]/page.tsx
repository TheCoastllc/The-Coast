import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlueprintLayout, SectionBoundary } from '@/components/blueprint-layout'
import TextReveal from '@/components/TextReveal'
import { ShineButton } from '@/components/ui/ShineButton'
import { TransitionLink } from '@/components/PageTransition'
import { FadeOnLoad, FadeOnScroll, SubtleLabel } from '../../about/AboutPageAnimations'
import { SERVICE_PAGES, SERVICE_PAGES_MAP } from '@/lib/service-pages'

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  return SERVICE_PAGES.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const service = SERVICE_PAGES_MAP[slug]
  if (!service) return {}

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: `https://coastglobal.org/services/${service.slug}` },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `https://coastglobal.org/services/${service.slug}`,
    },
  }
}

export default async function ServiceSlugPage({ params }: { params: Params }) {
  const { slug } = await params
  const service = SERVICE_PAGES_MAP[slug]
  if (!service) notFound()

  const relatedServices = service.relatedSlugs
    .map((s) => SERVICE_PAGES_MAP[s])
    .filter(Boolean)

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.heroBody,
    url: `https://coastglobal.org/services/${service.slug}`,
    provider: {
      '@type': 'Organization',
      '@id': 'https://coastglobal.org/#organization',
      name: 'The Coast',
    },
    areaServed: 'Worldwide',
    category: service.category,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coastglobal.org' },
      { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://coastglobal.org/services' },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.name,
        item: `https://coastglobal.org/services/${service.slug}`,
      },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <BlueprintLayout>
        {/* ─── Hero ──────────────────────────────────────────────── */}
        <section className="pt-32 pb-12 md:pt-40 md:pb-16">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            {/* Breadcrumb label */}
            <SubtleLabel className="text-mono text-muted-foreground/40 text-xs uppercase tracking-widest block mb-4">
              Services&nbsp;/&nbsp;{service.category}
            </SubtleLabel>

            {/* H1 */}
            <TextReveal
              as="h1"
              className="text-heading text-4xl md:text-6xl lg:text-7xl mb-5"
            >
              {service.headline}
            </TextReveal>

            {/* Tagline */}
            <p className="text-body text-muted-foreground text-lg md:text-xl max-w-2xl mb-8">
              {service.tagline}
            </p>

            {/* Direct-answer block — GEO citeable */}
            <div className="relative border-l-4 border-primary bg-primary/5 px-6 py-5 mb-10 max-w-3xl">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/60" />
              <p className="text-body text-foreground text-base leading-relaxed">
                {service.heroBody}
              </p>
            </div>

            {/* Stats strip */}
            <FadeOnLoad delay={0.3} className="flex flex-wrap items-center gap-8 pt-8 border-t border-border">
              {service.stats.map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-heading text-2xl md:text-3xl text-foreground">{value}</span>
                  <span className="text-mono text-xs text-muted-foreground/60 uppercase tracking-wider">
                    {label}
                  </span>
                </div>
              ))}
              {/* Timeline + price */}
              <div className="flex flex-col gap-0.5">
                <span className="text-heading text-2xl md:text-3xl text-foreground">
                  {service.timeline}
                </span>
                <span className="text-mono text-xs text-muted-foreground/60 uppercase tracking-wider">
                  Timeline
                </span>
              </div>
            </FadeOnLoad>
          </div>
        </section>

        <SectionBoundary />

        {/* ─── What's Included ──────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <FadeOnScroll>
              <p className="text-mono text-xs uppercase tracking-widest text-primary/60 mb-3">
                Deliverables
              </p>
              <h2 className="text-heading text-3xl md:text-4xl text-foreground mb-10">
                What&apos;s Included
              </h2>
            </FadeOnScroll>

            <div className="divide-y divide-border">
              {service.deliverables.map((item, i) => (
                <FadeOnScroll key={item} delay={i * 0.04}>
                  <div className="flex items-start gap-4 py-4">
                    {/* Gold accent square */}
                    <div className="shrink-0 w-5 h-5 border border-primary/40 flex items-center justify-center mt-0.5">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    </div>
                    <span className="text-body text-foreground text-base">{item}</span>
                  </div>
                </FadeOnScroll>
              ))}
            </div>
          </div>
        </section>

        <SectionBoundary />

        {/* ─── Our Process ──────────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <FadeOnScroll>
              <p className="text-mono text-xs uppercase tracking-widest text-primary/60 mb-3">
                How We Work
              </p>
              <h2 className="text-heading text-3xl md:text-4xl text-foreground mb-10">
                Our Process
              </h2>
            </FadeOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {service.process.map((step, i) => (
                <FadeOnScroll key={step.step} delay={i * 0.08}>
                  <div className="relative border border-border p-8 group hover:border-primary/30 transition-colors duration-300">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/60" />
                    <span className="text-mono text-xs text-primary/40 block mb-3">{step.step}</span>
                    <h3 className="text-heading text-xl md:text-2xl text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-body text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </FadeOnScroll>
              ))}
            </div>
          </div>
        </section>

        <SectionBoundary />

        {/* ─── Who This Is For ──────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <FadeOnScroll>
              <p className="text-mono text-xs uppercase tracking-widest text-primary/60 mb-3">
                Ideal For
              </p>
              <h2 className="text-heading text-3xl md:text-4xl text-foreground mb-10">
                Who This Is For
              </h2>
            </FadeOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {service.audiences.map((audience, i) => (
                <FadeOnScroll key={audience.label} delay={i * 0.06}>
                  <div className="border border-border p-6 hover:border-primary/30 transition-colors duration-300">
                    <p className="text-mono text-xs uppercase tracking-widest text-primary mb-3">
                      {audience.label}
                    </p>
                    <p className="text-body text-muted-foreground text-sm leading-relaxed">
                      {audience.description}
                    </p>
                  </div>
                </FadeOnScroll>
              ))}
            </div>
          </div>
        </section>

        <SectionBoundary />

        {/* ─── FAQs ────────────────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <FadeOnScroll>
              <p className="text-mono text-xs uppercase tracking-widest text-primary/60 mb-3">
                FAQs
              </p>
              <h2 className="text-heading text-3xl md:text-4xl text-foreground mb-10">
                Common Questions
              </h2>
            </FadeOnScroll>

            <div className="space-y-8">
              {service.faqs.map((faq, i) => (
                <FadeOnScroll key={faq.q} delay={i * 0.06}>
                  <div className="border-l-4 border-primary/40 pl-6 py-2">
                    <h3 className="text-heading text-lg md:text-xl text-foreground mb-3">
                      {faq.q}
                    </h3>
                    <p className="text-body text-muted-foreground text-sm leading-relaxed max-w-3xl">
                      {faq.a}
                    </p>
                  </div>
                </FadeOnScroll>
              ))}
            </div>
          </div>
        </section>

        <SectionBoundary />

        {/* ─── Related Services ─────────────────────────────────── */}
        {relatedServices.length > 0 && (
          <>
            <section className="py-16 md:py-24">
              <div className="max-w-6xl mx-auto px-6 md:px-12">
                <FadeOnScroll>
                  <p className="text-mono text-xs uppercase tracking-widest text-primary/60 mb-3">
                    Also Available
                  </p>
                  <h2 className="text-heading text-3xl md:text-4xl text-foreground mb-10">
                    You Might Also Need
                  </h2>
                </FadeOnScroll>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {relatedServices.map((rel, i) => (
                    <FadeOnScroll key={rel.slug} delay={i * 0.06}>
                      <TransitionLink
                        href={`/services/${rel.slug}`}
                        className="group relative border border-border p-6 flex flex-col gap-3 hover:border-primary/40 transition-colors duration-300"
                      >
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/60" />
                        <span className="text-mono text-xs text-primary/40">{rel.number}</span>
                        <span className="text-heading text-lg md:text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                          {rel.name}
                        </span>
                        <span className="text-mono text-xs text-muted-foreground/60 mt-auto">
                          View service&nbsp;→
                        </span>
                      </TransitionLink>
                    </FadeOnScroll>
                  ))}
                </div>
              </div>
            </section>

            <SectionBoundary />
          </>
        )}

        {/* ─── CTA ─────────────────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <FadeOnScroll className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <p className="text-mono text-muted-foreground/40 text-xs uppercase tracking-widest mb-2">
                  Ready to get started?
                </p>
                <p className="text-heading text-2xl md:text-4xl text-foreground max-w-md">
                  {service.name} — let&apos;s build something worth noticing.
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <span className="text-mono text-xs text-muted-foreground/60 uppercase tracking-wider">
                    Timeline: {service.timeline}
                  </span>
                  <span className="text-mono text-xs text-muted-foreground/30">·</span>
                  <span className="text-mono text-xs text-muted-foreground/60 uppercase tracking-wider">
                    {service.priceRange}
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <ShineButton href="/get-started" size="md">
                  Request a Quote
                </ShineButton>
                <ShineButton href="/services" size="md" variant="ghost">
                  All Services
                </ShineButton>
              </div>
            </FadeOnScroll>
          </div>
        </section>
      </BlueprintLayout>
    </>
  )
}
