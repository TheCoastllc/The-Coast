import type { Metadata } from 'next'
import Link from 'next/link'
import { ChamberShell } from '@/components/ui/ChamberShell'
import { Reveal } from '@/components/motion/Reveal'
import { variantForIndex } from '@/components/motion/revealVariants'
import { PaletteStack } from '@/components/ui/PaletteStack'
import { STUDIO, STATS, COMPANY, PALETTE } from '@/lib/content/coast'
import { CardIcon } from '@/components/ui/CardIcon'
import styles from './about.module.css'

export const metadata: Metadata = {
  title: 'About The Coast - Brand Design Studio for Visionaries',
  description:
    'The Coast was built to level the playing field - giving entrepreneurs, startups, and small businesses the branding power that makes people stop, look, and remember.',
  alternates: { canonical: 'https://coastglobal.org/about' },
  openGraph: {
    type: 'website',
    title: 'About The Coast | Brand Design Studio',
    description:
      'Founded by David Coast, we turn visions into empires. Professional branding for entrepreneurs, artists, and growing businesses.',
    url: 'https://coastglobal.org/about',
  },
}

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': 'https://coastglobal.org/about#webpage',
  url: 'https://coastglobal.org/about',
  name: 'About The Coast',
  description:
    'Founded by David Coast, The Coast is a brand design studio building unforgettable visual identities for entrepreneurs, artists, and growing businesses.',
  isPartOf: { '@id': 'https://coastglobal.org/#website' },
  about: { '@id': 'https://coastglobal.org/#organization' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coastglobal.org' },
      { '@type': 'ListItem', position: 2, name: 'About', item: 'https://coastglobal.org/about' },
    ],
  },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://coastglobal.org/about#david-coast',
  name: 'David Coast',
  jobTitle: 'Founder & Creative Director',
  url: 'https://coastglobal.org/about',
  worksFor: { '@id': 'https://coastglobal.org/#organization' },
}

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />

      <ChamberShell
        index="04"
        label="About"
        chamber="The Studio"
        preface={STUDIO.intro}
      >
        <section className="section">
          <div className={styles.stats}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <p className="sectionLabel">What we believe</p>
          <div className={styles.beliefs}>
            {STUDIO.beliefs.map((b, i) => (
              <Reveal key={b.n} variant={variantForIndex(i)}>
                <article className={`${styles.belief} glass`} data-glow={['', 'gold', 'orange'][i % 3] || undefined}>
                  <CardIcon name={b.icon} className="cardIcon" />
                  <span className={styles.beliefNum}>{b.n}</span>
                  <h3 className={styles.beliefTitle}>{b.title}</h3>
                  <p className={styles.beliefBody}>{b.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="pill takeaway">Strategy first. Craft always.</p>
        </section>

        <section className="section">
          <h2 className={styles.founderTitle}>Founder</h2>
          <div className={styles.founder}>
            <Reveal variant="mask-wipe">
              <figure
                className={styles.founderPortrait}
                role="img"
                aria-label={`${STUDIO.founder.name}, ${STUDIO.founder.role} of The Coast`}
              />
            </Reveal>
            <div className={styles.founderStory}>
              <p className={styles.founderTag}>{STUDIO.founder.tag}</p>
              <h2 className={styles.founderHeadline}>{STUDIO.founder.headline}</h2>
              {STUDIO.founder.story.map((p, i) => (
                <p key={i} className={styles.founderBody}>
                  {p}
                </p>
              ))}
              <div className={styles.founderSign}>
                <span className={styles.founderName}>{STUDIO.founder.name}</span>
                <span className={styles.founderRole}>{STUDIO.founder.role}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <p className="sectionLabel">The palette</p>
          <h2 className={styles.where}>The house colors.</h2>
          <p className={styles.whereBody}>
            The system behind the studio. Ink, deep blue, graphite, steel, and a
            single signal orange that earns every appearance.
          </p>
          <PaletteStack swatches={PALETTE} layout="row" />
        </section>

        <section className="section">
          <p className="sectionLabel">Where</p>
          <h2 className={styles.where}>{COMPANY.city}</h2>
          <p className={styles.whereBody}>
            Working globally. Wherever the vision is, we meet it.
          </p>
        </section>

        <section className="section">
          <h2 className={styles.where}>Let us build your brand.</h2>
          <Link href="/contact" className={styles.cta} data-cursor-label="Start">
            Start a project
            <span className={styles.ctaArrow}>→</span>
          </Link>
        </section>
      </ChamberShell>
    </>
  )
}
