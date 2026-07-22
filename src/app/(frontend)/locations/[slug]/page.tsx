import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChamberShell } from '@/components/ui/ChamberShell'
import { Reveal } from '@/components/motion/Reveal'
import { variantForIndex } from '@/components/motion/revealVariants'
import { ShineButton } from '@/components/ui/ShineButton'
import { LOCATION_PAGES, LOCATION_PAGES_MAP } from '@/lib/location-pages'
import { DEFAULT_OG_IMAGES, buildTwitter } from '@/lib/seo'
import { ORG_ID, WEBSITE_ID } from '@/lib/schema'
import styles from '../../services/[slug]/serviceDetail.module.css'

type Params = Promise<{ slug: string }>

const GLOWS = ['', 'gold', 'orange'] as const

export async function generateStaticParams() {
  return LOCATION_PAGES.map((l) => ({ slug: l.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const loc = LOCATION_PAGES_MAP[slug]
  if (!loc) return {}

  return {
    title: { absolute: loc.metaTitle },
    description: loc.metaDescription,
    alternates: { canonical: `https://coastglobal.org/locations/${loc.slug}` },
    twitter: buildTwitter({ title: loc.metaTitle, description: loc.metaDescription }),
    openGraph: {
      type: 'website',
      title: loc.metaTitle,
      description: loc.metaDescription,
      url: `https://coastglobal.org/locations/${loc.slug}`,
      images: DEFAULT_OG_IMAGES,
    },
  }
}

export default async function LocationPage({ params }: { params: Params }) {
  const { slug } = await params
  const loc = LOCATION_PAGES_MAP[slug]
  if (!loc) notFound()

  // One LocalBusiness per real business (the sitewide #organization node) -
  // location pages are WebPages ABOUT that org for a specific service area.
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `https://coastglobal.org/locations/${loc.slug}#webpage`,
    url: `https://coastglobal.org/locations/${loc.slug}`,
    name: loc.metaTitle,
    description: loc.metaDescription,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    areaServed: loc.areaServed,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coastglobal.org' },
      { '@type': 'ListItem', position: 2, name: 'Locations', item: 'https://coastglobal.org/locations' },
      {
        '@type': 'ListItem',
        position: 3,
        name: loc.name,
        item: `https://coastglobal.org/locations/${loc.slug}`,
      },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: loc.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }

  const related = LOCATION_PAGES.filter((l) => l.slug !== loc.slug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
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
        index="07"
        label={`Areas / ${loc.kind === 'metro' ? 'Home base' : 'Service area'}`}
        chamber={loc.headline}
        preface={loc.preface}
      >
        {/* ─── In brief ─────────────────────────────────────────── */}
        <section className="section">
          <p className="sectionLabel">In brief</p>
          {loc.intro.map((para) => (
            <Reveal key={para.slice(0, 24)} variant="rise-blur">
              <p className={styles.answer}>{para}</p>
            </Reveal>
          ))}
        </section>

        {/* ─── What we do here ──────────────────────────────────── */}
        <section className="section">
          <p className="sectionLabel">What we do here</p>
          <h2 className="sectionTitle">Three pillars, {loc.name}.</h2>
          <div className={styles.audiences}>
            {loc.pillars.map((pillar, i) => (
              <Reveal key={pillar.name} variant={variantForIndex(i)}>
                <Link
                  href={pillar.href}
                  className={`${styles.audience} glass`}
                  data-glow={GLOWS[i % 3] || undefined}
                  data-cursor-label="Open"
                >
                  <span className={styles.audienceLabel}>{pillar.name}</span>
                  <p className={styles.audienceBody}>{pillar.localCopy}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ─── How we work with you ─────────────────────────────── */}
        <section className="section">
          <p className="sectionLabel">How we work with you</p>
          <h2 className="sectionTitle">{loc.engagementTitle}</h2>
          <Reveal variant="rise-blur">
            <p className={styles.answer}>{loc.engagement}</p>
          </Reveal>
        </section>

        {/* ─── FAQs ─────────────────────────────────────────────── */}
        <section className="section">
          <p className="sectionLabel">FAQs</p>
          <h2 className="sectionTitle">Common questions.</h2>
          <div className={styles.faqs}>
            {loc.faqs.map((faq, i) => (
              <Reveal key={faq.q} variant={variantForIndex(i)}>
                <div className={styles.faq}>
                  <h3 className={styles.faqQ}>{faq.q}</h3>
                  <p className={styles.faqA}>{faq.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ─── Other areas ──────────────────────────────────────── */}
        <section className="section">
          <p className="sectionLabel">Also serving</p>
          <h2 className="sectionTitle">Everywhere we work.</h2>
          <div className={styles.related}>
            {related.map((rel, i) => (
              <Reveal key={rel.slug} variant={variantForIndex(i)}>
                <Link
                  href={`/locations/${rel.slug}`}
                  className={`${styles.relatedCard} glass`}
                  data-glow={GLOWS[i % 3] || undefined}
                  data-cursor-label="Open"
                >
                  <span className={styles.relatedNum}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.relatedName}>{rel.name}</span>
                  <span className={styles.relatedCta}>View area →</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ─── CTA ──────────────────────────────────────────────── */}
        <section className="section">
          <p className="sectionLabel">Ready to get started?</p>
          <h2 className="sectionTitle">{loc.name} - let&apos;s build something worth noticing.</h2>
          <div className={styles.ctaRow}>
            <ShineButton href="/get-started" size="md">Start a Project</ShineButton>
            <ShineButton href="/contact" size="md" variant="ghost">Talk to Us</ShineButton>
          </div>
        </section>
      </ChamberShell>
    </>
  )
}
