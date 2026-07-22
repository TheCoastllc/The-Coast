import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChamberShell } from '@/components/ui/ChamberShell'
import { Reveal } from '@/components/motion/Reveal'
import { variantForIndex } from '@/components/motion/revealVariants'
import { ShineButton } from '@/components/ui/ShineButton'
import { SERVICE_PAGES, SERVICE_PAGES_MAP } from '@/lib/service-pages'
import { DEFAULT_OG_IMAGES } from '@/lib/seo'
import styles from './serviceDetail.module.css'

type Params = Promise<{ slug: string }>

const GLOWS = ['', 'gold', 'orange'] as const

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
      type: 'website',
      title: service.metaTitle,
      description: service.metaDescription,
      url: `https://coastglobal.org/services/${service.slug}`,
      images: DEFAULT_OG_IMAGES,
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
      name: 'The Coast Global',
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

      <ChamberShell
        index="03"
        label={`Services / ${service.category}`}
        chamber={service.headline}
        preface={service.tagline}
      >
        {/* ─── Direct answer + stats ────────────────────────────── */}
        <section className="section">
          <p className="sectionLabel">In brief</p>
          <Reveal variant="rise-blur">
            <p className={styles.answer}>{service.heroBody}</p>
          </Reveal>
          <div className={styles.stats}>
            {service.stats.map(({ value, label }) => (
              <div key={label} className={styles.stat}>
                <span className={styles.statValue}>{value}</span>
                <span className={styles.statLabel}>{label}</span>
              </div>
            ))}
            <div className={styles.stat}>
              <span className={styles.statValue}>{service.timeline}</span>
              <span className={styles.statLabel}>Timeline</span>
            </div>
          </div>
        </section>

        {/* ─── Deliverables ─────────────────────────────────────── */}
        <section className="section">
          <p className="sectionLabel">Deliverables</p>
          <h2 className="sectionTitle">What&apos;s included.</h2>
          <div className={styles.deliverables}>
            {service.deliverables.map((item) => (
              <div key={item} className={styles.deliverable}>
                <span className={styles.deliverableMark} aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Process ──────────────────────────────────────────── */}
        <section className="section">
          <p className="sectionLabel">How we work</p>
          <h2 className="sectionTitle">Our process.</h2>
          <div className={styles.process}>
            {service.process.map((step, i) => (
              <Reveal key={step.step} variant={variantForIndex(i)}>
                <div className={`${styles.step} glass`} data-glow={GLOWS[i % 3] || undefined}>
                  <span className={styles.stepNum}>{step.step}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepBody}>{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ─── Who this is for ──────────────────────────────────── */}
        <section className="section">
          <p className="sectionLabel">Ideal for</p>
          <h2 className="sectionTitle">Who this is for.</h2>
          <div className={styles.audiences}>
            {service.audiences.map((audience, i) => (
              <Reveal key={audience.label} variant={variantForIndex(i)}>
                <div className={`${styles.audience} glass`} data-glow={GLOWS[i % 3] || undefined}>
                  <span className={styles.audienceLabel}>{audience.label}</span>
                  <p className={styles.audienceBody}>{audience.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ─── FAQs ─────────────────────────────────────────────── */}
        <section className="section">
          <p className="sectionLabel">FAQs</p>
          <h2 className="sectionTitle">Common questions.</h2>
          <div className={styles.faqs}>
            {service.faqs.map((faq, i) => (
              <Reveal key={faq.q} variant={variantForIndex(i)}>
                <div className={styles.faq}>
                  <h3 className={styles.faqQ}>{faq.q}</h3>
                  <p className={styles.faqA}>{faq.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ─── Related services ─────────────────────────────────── */}
        {relatedServices.length > 0 && (
          <section className="section">
            <p className="sectionLabel">Also available</p>
            <h2 className="sectionTitle">You might also need.</h2>
            <div className={styles.related}>
              {relatedServices.map((rel, i) => (
                <Reveal key={rel.slug} variant={variantForIndex(i)}>
                  <Link
                    href={`/services/${rel.slug}`}
                    className={`${styles.relatedCard} glass`}
                    data-glow={GLOWS[i % 3] || undefined}
                    data-cursor-label="Open"
                  >
                    <span className={styles.relatedNum}>{rel.number}</span>
                    <span className={styles.relatedName}>{rel.name}</span>
                    <span className={styles.relatedCta}>View service →</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* ─── CTA ──────────────────────────────────────────────── */}
        <section className="section">
          <p className="sectionLabel">Ready to get started?</p>
          <h2 className="sectionTitle">{service.name} - let&apos;s build something worth noticing.</h2>
          <div className={styles.ctaMeta}>
            <span>Timeline: {service.timeline}</span>
            <span className={styles.ctaMetaDot} aria-hidden="true">/</span>
            <span>{service.priceRange}</span>
          </div>
          <div className={styles.ctaRow}>
            <ShineButton href="/get-started" size="md">Request a Quote</ShineButton>
            <ShineButton href="/services" size="md" variant="ghost">All Services</ShineButton>
          </div>
        </section>
      </ChamberShell>
    </>
  )
}
