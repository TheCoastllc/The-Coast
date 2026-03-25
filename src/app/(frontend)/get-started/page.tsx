import type { Metadata } from 'next'
import GetStartedClient from './GetStartedClient'

export const metadata: Metadata = {
  title: 'Get Started',
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
      <GetStartedClient />
    </>
  )
}
