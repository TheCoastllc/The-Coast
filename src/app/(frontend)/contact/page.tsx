import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/ContactForm'
import { ContactChannels } from '@/components/contact/ContactChannels'
import { fetchReviewStats } from '@/lib/google-reviews'
import { DEFAULT_OG_IMAGES, buildTwitter } from '@/lib/seo'
import styles from '@/components/contact/contact-page.module.css'

// Static + ISR: the only live data is the Google rating, which shares the
// review cache with the homepage.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Contact The Coast Global',
  description:
    'Start a project with The Coast Global. Send a message, call +1 (682) 702-0374, or email hello@coastglobal.org. Dallas-Fort Worth, serving Texas, Florida, Alabama. We reply within 24 hours.',
  alternates: { canonical: 'https://coastglobal.org/contact' },
  twitter: buildTwitter({
    title: 'Contact The Coast Global | Brand Design Studio',
    description:
      'Questions, partnerships, press, or projects - reach The Coast Global team directly. We reply within 24 hours.',
  }),
  openGraph: {
    type: 'website',
    title: 'Contact The Coast Global | Brand Design Studio',
    description:
      'Questions, partnerships, press, or projects - reach The Coast Global team directly. We reply within 24 hours.',
    url: 'https://coastglobal.org/contact',
    images: DEFAULT_OG_IMAGES,
  },
}

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': 'https://coastglobal.org/contact#webpage',
  url: 'https://coastglobal.org/contact',
  name: 'Contact The Coast Global',
  description:
    'Contact The Coast Global - a brand design studio for entrepreneurs, startups, and growing businesses. Email hello@coastglobal.org or submit the contact form.',
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

/**
 * /contact - form first, no hero. Deliberately NOT on ChamberShell: that shell
 * pulls the WebGL ChamberBackdrop, the orbit/coordinate hero FX, and the
 * ScrollTrigger RevealGroup, none of which a contact page needs. The page
 * paints as plain HTML + one CSS module; Calendly loads only on intent.
 */
export default async function ContactPage() {
  const stats = await fetchReviewStats()
  const rating = stats.count > 0 ? { average: stats.averageRating, count: stats.count } : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }} />
      {/* Warm the Calendly connection so the scheduler opens fast when asked for. */}
      <link rel="preconnect" href="https://calendly.com" crossOrigin="" />
      <link rel="preconnect" href="https://assets.calendly.com" crossOrigin="" />

      <main className={styles.page}>
        <header className={styles.head}>
          <h1 className={`${styles.title} no-marble`}>Contact</h1>
          <p className={styles.lead}>
            Tell us what you&rsquo;re building. A strategist reads every message and replies within 24 hours.
          </p>
        </header>

        <div className={styles.cols}>
          <section className={styles.formCol} aria-labelledby="contact-form-title">
            <h2 id="contact-form-title" className="sr-only">
              Send a message
            </h2>
            <ContactForm />
          </section>
          <aside className={styles.sideCol} aria-label="Other ways to reach us">
            <ContactChannels rating={rating} />
          </aside>
        </div>
      </main>
    </>
  )
}
