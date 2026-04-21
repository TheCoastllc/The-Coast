import type { Metadata } from 'next'
import GetStartedClient from './GetStartedClient'

export const metadata: Metadata = {
  title: 'Start Your Brand Project — Free Consultation with The Coast',
  description:
    'Start your brand project with The Coast. Tell us about your business and the services you need — we will respond within 24 hours.',
  alternates: { canonical: 'https://coastglobal.org/get-started' },
  openGraph: {
    title: 'Start Your Brand Project | The Coast',
    description:
      'Tell us about yourself, your services needed, and your budget. Get a custom quote from The Coast.',
    url: 'https://coastglobal.org/get-started',
  },
}

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': 'https://coastglobal.org/get-started#webpage',
  url: 'https://coastglobal.org/get-started',
  name: 'Start Your Brand Project | The Coast',
  description: 'Tell us about your business and the services you need — we will respond within 24 hours.',
  isPartOf: { '@id': 'https://coastglobal.org/#website' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coastglobal.org' },
      { '@type': 'ListItem', position: 2, name: 'Get Started', item: 'https://coastglobal.org/get-started' },
    ],
  },
}

export default function GetStartedPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }} />

      <section className="sr-only">
        <h2>Start Your Brand Project with The Coast</h2>
        <p>
          This page is the starting point for every new engagement with The Coast — whether you are
          launching a brand from scratch, rebuilding an identity that has outgrown its original
          design, or scoping a long-term creative partnership. Tell us about your business, the
          services you need, your rough timeline, and your budget range. A member of our strategy
          team will read every submission personally and respond within one business day with next
          steps, a discovery call invite, or a preliminary quote.
        </p>
        <p>
          We work with founders, marketing leads, and creative directors across branding, visual
          identity, website design and development, motion, print collateral, and ongoing
          marketing support. No project is too small to ask about, and no brief is too ambitious to
          scope. If you are unsure what you need, the form below includes space to describe the
          problem in your own words — we will take it from there and recommend the right path.
        </p>
        <p>
          Prefer to email us directly? Reach the team at hello@coastglobal.org. We respond to
          every inquiry, and we keep your information private — we never share, sell, or subscribe
          you to anything without your consent.
        </p>
      </section>

      <GetStartedClient />
    </>
  )
}
