import type { Metadata } from 'next'
import { ChamberShell } from '@/components/ui/ChamberShell'
import { ContactGlass } from '@/components/contact/ContactGlass'
import { DEFAULT_OG_IMAGES, buildTwitter } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Contact The Coast',
  description:
    'Get in touch with The Coast. Reach our brand studio by email, phone, or form - we respond to every inquiry within 24 hours on business days.',
  alternates: { canonical: 'https://coastglobal.org/contact' },
  twitter: buildTwitter({
    title: 'Contact The Coast | Brand Design Studio',
    description:
      'Questions, partnerships, press, or projects - reach The Coast team directly. We reply within 24 hours.',
  }),
  openGraph: {
    type: 'website',
    title: 'Contact The Coast | Brand Design Studio',
    description:
      'Questions, partnerships, press, or projects - reach The Coast team directly. We reply within 24 hours.',
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
    'Contact The Coast - a brand design studio for entrepreneurs, startups, and growing businesses. Email hello@coastglobal.org or submit the contact form.',
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
      {/* Warm the Calendly connection so the scheduler loads fast (kills the buffering). */}
      <link rel="preconnect" href="https://calendly.com" crossOrigin="" />
      <link rel="preconnect" href="https://assets.calendly.com" crossOrigin="" />

      <ChamberShell
        index="05"
        label="Contact"
        chamber="Start"
        preface="Tell us what you are building. We reply fast and move fast."
      >
        <ContactGlass />
      </ChamberShell>
    </>
  )
}
