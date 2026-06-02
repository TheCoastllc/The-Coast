import type { Metadata } from 'next'
import { ChamberShell } from '@/components/ui/ChamberShell'
import { Reveal } from '@/components/motion/Reveal'
import { variantForIndex } from '@/components/motion/revealVariants'
import { COMPANY, CONTACT, CONTACT_STEPS } from '@/lib/content/coast'
import { DEFAULT_OG_IMAGES } from '@/lib/seo'
import styles from './contact.module.css'

export const metadata: Metadata = {
  title: 'Contact The Coast',
  description:
    'Get in touch with The Coast. Reach our brand studio by email, phone, or form — we respond to every inquiry within 24 hours on business days.',
  alternates: { canonical: 'https://coastglobal.org/contact' },
  openGraph: {
    type: 'website',
    title: 'Contact The Coast | Brand Design Studio',
    description:
      'Questions, partnerships, press, or projects — reach The Coast team directly. We reply within 24 hours.',
    url: 'https://coastglobal.org/contact',
    images: DEFAULT_OG_IMAGES,
  },
}

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': 'https://coastglobal.org/contact#webpage',
  url: 'https://coastglobal.org/contact',
  name: 'Contact The Coast',
  description:
    'Contact The Coast — a brand design studio for entrepreneurs, startups, and growing businesses. Email hello@coastglobal.org or submit the contact form.',
  isPartOf: { '@id': 'https://coastglobal.org/#website' },
  about: { '@id': 'https://coastglobal.org/#organization' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coastglobal.org' },
      { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://coastglobal.org/contact' },
    ],
  },
}

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }} />

      <ChamberShell
        index="05"
        label="Contact"
        chamber="Start"
        preface="Tell us what you are building. We reply fast and move fast."
      >
        <section className="section">
          <div className={styles.grid}>
            <a href={`mailto:${COMPANY.email}`} className={styles.primary} data-cursor-label="Email">
              <span className={styles.primaryLabel}>Email</span>
              <span className={styles.primaryValue}>{COMPANY.email}</span>
              <span className={styles.primaryArrow}>→</span>
            </a>

            <div className={styles.details}>
              <a href={`tel:${COMPANY.phone.replace(/[^\d+]/g, '')}`} className={styles.detailRow} data-cursor-label="Call">
                <span className={styles.detailLabel}>Phone</span>
                <span className={styles.detailValue}>{COMPANY.phone}</span>
              </a>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Studio</span>
                <span className={styles.detailValue}>{COMPANY.name}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Location</span>
                <span className={styles.detailValue}>{COMPANY.city}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Web</span>
                <span className={styles.detailValue}>{COMPANY.domain}</span>
              </div>
            </div>
          </div>

          <a href={`mailto:${COMPANY.email}`} className={styles.cta} data-cursor-label="Book">
            {CONTACT.cta}
            <span className={styles.ctaArrow}>→</span>
          </a>
        </section>

        <section className="section">
          <p className="sectionLabel">What happens next</p>
          <div className={styles.steps}>
            {CONTACT_STEPS.map((s, i) => (
              <Reveal key={s.n} variant={variantForIndex(i)}>
                <div className={styles.step}>
                  <span className={styles.stepNum}>{s.n}</span>
                  <h4 className={styles.stepTitle}>{s.title}</h4>
                  <p className={styles.stepBody}>{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </ChamberShell>
    </>
  )
}
