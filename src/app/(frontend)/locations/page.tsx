import type { Metadata } from 'next'
import Link from 'next/link'
import { ChamberShell } from '@/components/ui/ChamberShell'
import { Reveal } from '@/components/motion/Reveal'
import { variantForIndex } from '@/components/motion/revealVariants'
import { ShineButton } from '@/components/ui/ShineButton'
import { LOCATION_PAGES } from '@/lib/location-pages'
import { COMPANY } from '@/lib/content/coast'
import { DEFAULT_OG_IMAGES, buildTwitter } from '@/lib/seo'
import { ORG_ID, WEBSITE_ID } from '@/lib/schema'
import styles from '../services/[slug]/serviceDetail.module.css'

const GLOWS = ['', 'gold', 'orange'] as const

const DESCRIPTION =
  'The Coast Global works from Dallas-Fort Worth and serves clients across Texas, Florida, and Alabama - branding, digital growth, and AI consulting.'

export const metadata: Metadata = {
  title: 'Areas We Serve',
  description: DESCRIPTION,
  alternates: { canonical: 'https://coastglobal.org/locations' },
  twitter: buildTwitter({ title: 'Areas We Serve | The Coast Global', description: DESCRIPTION }),
  openGraph: {
    type: 'website',
    title: 'Areas We Serve | The Coast Global',
    description: DESCRIPTION,
    url: 'https://coastglobal.org/locations',
    images: DEFAULT_OG_IMAGES,
  },
}

const hubSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://coastglobal.org/locations#webpage',
  url: 'https://coastglobal.org/locations',
  name: 'Areas We Serve | The Coast Global',
  description: DESCRIPTION,
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': ORG_ID },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coastglobal.org' },
    { '@type': 'ListItem', position: 2, name: 'Locations', item: 'https://coastglobal.org/locations' },
  ],
}

export default function LocationsHubPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hubSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ChamberShell
        index="07"
        label="Service areas"
        chamber="Where we work."
        preface="Home base in Dallas-Fort Worth. Serving the southeast."
      >
        {/* ─── The model ────────────────────────────────────────── */}
        <section className="section">
          <p className="sectionLabel">In brief</p>
          <Reveal variant="rise-blur">
            <p className={styles.answer}>
              The Coast Global is a service-area studio: headquartered in Dallas-Fort Worth
              with in-person availability across the Metroplex, and named service areas in
              Texas, Florida, and Alabama running on a remote-first process. Same team, same
              fixed scopes, same premium standard everywhere we work.
            </p>
          </Reveal>
        </section>

        {/* ─── The areas ────────────────────────────────────────── */}
        <section className="section">
          <p className="sectionLabel">The areas</p>
          <h2 className="sectionTitle">One studio, four waters.</h2>
          <div className={styles.related}>
            {LOCATION_PAGES.map((loc, i) => (
              <Reveal key={loc.slug} variant={variantForIndex(i)}>
                <Link
                  href={`/locations/${loc.slug}`}
                  className={`${styles.relatedCard} glass`}
                  data-glow={GLOWS[i % 3] || undefined}
                  data-cursor-label="Open"
                >
                  <span className={styles.relatedNum}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.relatedName}>{loc.name}</span>
                  <span className={styles.relatedCta}>
                    {loc.kind === 'metro' ? 'Home base →' : 'Service area →'}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ─── NAP ──────────────────────────────────────────────── */}
        <section className="section">
          <p className="sectionLabel">Reach us</p>
          <h2 className="sectionTitle">{COMPANY.city}</h2>
          <div className={styles.ctaMeta}>
            <a href={`tel:${COMPANY.phone.replace(/[^\d+]/g, '')}`}>{COMPANY.phone}</a>
            <span className={styles.ctaMetaDot} aria-hidden="true">/</span>
            <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
          </div>
          <div className={styles.ctaRow}>
            <ShineButton href="/get-started" size="md">Start a Project</ShineButton>
            <ShineButton href="/contact" size="md" variant="ghost">Contact</ShineButton>
          </div>
        </section>
      </ChamberShell>
    </>
  )
}
