import type { Metadata } from 'next'
import PricingClient from './PricingClient'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Monthly retainer branding packages and à la carte design services. Transparent pricing for entrepreneurs and growing businesses.',
  alternates: { canonical: 'https://www.coastglobal.org/pricing' },
  openGraph: {
    title: 'Pricing & Packages | The Coast',
    description:
      'Monthly retainer packages and one-time design services. Invest in your brand.',
    url: 'https://www.coastglobal.org/pricing',
  },
}

const pricingSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'The Coast — Brand Design Pricing Plans',
  url: 'https://www.coastglobal.org/pricing',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Offer',
        name: 'Starter',
        description: 'Get started with essential brand design tools.',
        price: '0',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: 0,
          priceCurrency: 'USD',
          unitText: 'MONTH',
        },
        offeredBy: { '@id': 'https://www.coastglobal.org/#organization' },
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Offer',
        name: 'Professional',
        description: 'Monthly retainer for growing businesses that need consistent brand support.',
        price: '25',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: 25,
          priceCurrency: 'USD',
          unitText: 'MONTH',
        },
        offeredBy: { '@id': 'https://www.coastglobal.org/#organization' },
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'Offer',
        name: 'Enterprise',
        description: 'Full-scale brand design support for established businesses.',
        price: '250',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: 250,
          priceCurrency: 'USD',
          unitText: 'MONTH',
        },
        offeredBy: { '@id': 'https://www.coastglobal.org/#organization' },
      },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.coastglobal.org' },
    { '@type': 'ListItem', position: 2, name: 'Pricing', item: 'https://www.coastglobal.org/pricing' },
  ],
}

export default function PricingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <PricingClient />
    </>
  )
}
