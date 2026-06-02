import type { Metadata } from 'next'
import { ChamberShell } from '@/components/ui/ChamberShell'
import { Reveal } from '@/components/motion/Reveal'
import { variantForIndex } from '@/components/motion/revealVariants'
import { ShineButton } from '@/components/ui/ShineButton'
import { DEFAULT_OG_IMAGES } from '@/lib/seo'
import styles from './offers.module.css'

export const metadata: Metadata = {
  title: 'Free Brand Diagnostic Tools — Quiz, Audit & 3-Second Test',
  description:
    'Free interactive brand diagnostic tools from The Coast: take the 10-question brand quiz, score your consistency across 25 checkpoints, and run the 3-second test to see what your brand is really saying.',
  alternates: { canonical: 'https://coastglobal.org/offers' },
  openGraph: {
    type: 'website',
    title: 'Free Brand Diagnostic Tools — Quiz, Audit & 3-Second Test | The Coast',
    description: 'Three free interactive tools to diagnose your brand strength, consistency, and first impressions.',
    url: 'https://coastglobal.org/offers',
    images: DEFAULT_OG_IMAGES,
  },
}

const offersSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'The Coast - Free Brand Tools',
  url: 'https://coastglobal.org/offers',
  itemListElement: [
    { '@type': 'ListItem', position: 1, item: { '@type': 'WebApplication', name: 'Brand Quiz', url: 'https://offers.coastglobal.org/brand-quiz', applicationCategory: 'BusinessApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } } },
    { '@type': 'ListItem', position: 2, item: { '@type': 'WebApplication', name: 'Brand Consistency Checklist', url: 'https://offers.coastglobal.org/brand-checklist', applicationCategory: 'BusinessApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } } },
    { '@type': 'ListItem', position: 3, item: { '@type': 'WebApplication', name: 'The 3-Second Brand Test', url: 'https://offers.coastglobal.org/3-second-test', applicationCategory: 'BusinessApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } } },
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
    number: '01', title: 'Brand Quiz', tagline: "What's Your Brand Actually Saying?",
    description: '10 questions. 60 seconds. Find out if your brand is invisible, inconsistent, or established - and get a clear action plan to fix it.',
    href: 'https://offers.coastglobal.org/brand-quiz', cta: 'Take the Quiz',
    stats: [{ value: '60s', label: 'Time' }, { value: '10', label: 'Questions' }, { value: 'Free', label: 'Cost' }],
  },
  {
    number: '02', title: 'Brand Consistency Checklist', tagline: 'Is Your Brand Leaking Trust?',
    description: '25 checkpoints across five brand pillars. Your score updates in real time as you check each box. See exactly where your brand is losing credibility.',
    href: 'https://offers.coastglobal.org/brand-checklist', cta: 'Score Your Brand',
    stats: [{ value: '25', label: 'Items' }, { value: '5', label: 'Categories' }, { value: 'Free', label: 'Cost' }],
  },
  {
    number: '03', title: 'The 3-Second Test', tagline: 'How Customers Judge Your Brand Before You Say a Word',
    description: 'Learn the five things customers process in the first three seconds of seeing your brand - and run a self-test to see if you pass.',
    href: 'https://offers.coastglobal.org/3-second-test', cta: 'Run the Test',
    stats: [{ value: '5', label: 'Elements' }, { value: '3', label: 'Outcomes' }, { value: 'Free', label: 'Cost' }],
  },
]

const GLOWS = ['', 'gold', 'orange'] as const

export default function OffersPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offersSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ChamberShell
        index="07"
        label="Offers"
        chamber="Know Your Brand"
        preface="Three free interactive tools to diagnose your brand's strength, find consistency gaps, and test your first impressions."
      >
        <section className="section">
          <p className="sectionLabel">Interactive tools</p>
          <div className={styles.tools}>
            {offers.map((o, i) => (
              <Reveal key={o.number} variant={variantForIndex(i)}>
                <a href={o.href} className={`${styles.tool} glass`} data-glow={GLOWS[i % 3] || undefined} data-cursor-label="Open">
                  <span className={styles.toolNum}>{o.number}</span>
                  <h3 className={styles.toolTitle}>{o.title}</h3>
                  <p className={styles.toolTagline}>{o.tagline}</p>
                  <p className={styles.toolDesc}>{o.description}</p>
                  <div className={styles.toolStats}>
                    {o.stats.map((s) => (
                      <div key={s.label} className={styles.toolStat}>
                        <span className={styles.toolStatValue}>{s.value}</span>
                        <span className={styles.toolStatLabel}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                  <span className={styles.toolCta}>{o.cta} →</span>
                </a>
              </Reveal>
            ))}
          </div>
          <p className="pill takeaway">Three free tools. Sixty seconds each.</p>
        </section>

        <section className="section">
          <p className="sectionLabel">Why it matters</p>
          <h2 className="sectionTitle">Why brand diagnostics matter.</h2>
          <p className="prose">
            Most businesses never step back and look at their brand the way their customers do. Consumers form lasting
            impressions within milliseconds of encountering a brand - and those impressions directly affect whether they
            stay, trust, or buy. A brand diagnostic gives you a clear, honest picture of what your brand is communicating
            right now. It reveals blind spots in your visual identity, messaging, and overall consistency that you cannot
            see from the inside - so you can take targeted action instead of guessing.
          </p>
        </section>

        <section className="section">
          <p className="sectionLabel">Ready to go deeper?</p>
          <h2 className="sectionTitle">Get a full brand audit from our team.</h2>
          <div className={styles.ctaRow}>
            <ShineButton href="/get-started" size="md">Get Started</ShineButton>
          </div>
        </section>
      </ChamberShell>
    </>
  )
}
