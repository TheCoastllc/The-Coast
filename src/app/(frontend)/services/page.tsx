import type { Metadata } from 'next'
import ServicesClient from './ServicesClient'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Custom logo design, visual identity, brand guidelines, marketing collateral, social graphics, pitch decks, video, digital marketing, and social media management.',
  alternates: { canonical: 'https://www.coastglobal.org/services' },
  openGraph: {
    title: 'Brand Design Services | The Coast',
    description:
      'From logo design to full brand transformations — everything your business needs to stand out.',
    url: 'https://www.coastglobal.org/services',
  },
}

const servicesSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'The Coast — Brand Design Services',
  url: 'https://www.coastglobal.org/services',
  itemListElement: [
    { '@type': 'ListItem', position: 1, item: { '@type': 'Service', name: 'Logo Design', provider: { '@id': 'https://www.coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 2, item: { '@type': 'Service', name: 'Visual Identity', provider: { '@id': 'https://www.coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 3, item: { '@type': 'Service', name: 'Brand Identity Guidelines', provider: { '@id': 'https://www.coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 4, item: { '@type': 'Service', name: 'Full Rebrand', provider: { '@id': 'https://www.coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 5, item: { '@type': 'Service', name: 'Website Design', provider: { '@id': 'https://www.coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 6, item: { '@type': 'Service', name: 'Social Media Graphics', provider: { '@id': 'https://www.coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 7, item: { '@type': 'Service', name: 'Marketing Collateral', provider: { '@id': 'https://www.coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 8, item: { '@type': 'Service', name: 'Pitch Decks', provider: { '@id': 'https://www.coastglobal.org/#organization' } } },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.coastglobal.org' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.coastglobal.org/services' },
  ],
}

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ServicesClient />
    </>
  )
}
