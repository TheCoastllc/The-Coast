import type { Metadata } from 'next'
import PricingClient from './PricingClient'

export const metadata: Metadata = {
  title: 'Brand Design Pricing & Monthly Retainer Packages — The Coast',
  description:
    'Monthly retainer branding packages and à la carte design services. Transparent pricing for entrepreneurs and growing businesses.',
  alternates: { canonical: 'https://coastglobal.org/pricing' },
  openGraph: {
    title: 'Pricing & Packages | The Coast',
    description:
      'Monthly retainer packages and one-time design services. Invest in your brand.',
    url: 'https://coastglobal.org/pricing',
  },
}

const pricingSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'The Coast — Brand Design Pricing Plans',
  url: 'https://coastglobal.org/pricing',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Offer',
        name: 'Creator',
        description: 'Ideal for freelance designers and creative beginners.',
        price: '0',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: 0,
          priceCurrency: 'USD',
          unitText: 'MONTH',
        },
        offeredBy: { '@id': 'https://coastglobal.org/#organization' },
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Offer',
        name: 'Studio',
        description: 'Advanced toolkit for agencies and growing creative teams.',
        price: '25',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: 25,
          priceCurrency: 'USD',
          unitText: 'MONTH',
        },
        offeredBy: { '@id': 'https://coastglobal.org/#organization' },
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'Offer',
        name: 'Agency Pro',
        description: 'Full-scale creative infrastructure for large design teams.',
        price: '250',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: 250,
          priceCurrency: 'USD',
          unitText: 'MONTH',
        },
        offeredBy: { '@id': 'https://coastglobal.org/#organization' },
      },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coastglobal.org' },
    { '@type': 'ListItem', position: 2, name: 'Pricing', item: 'https://coastglobal.org/pricing' },
  ],
}

export default function PricingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="sr-only">
        <h2>Transparent Pricing for Brand Design & Creative Services</h2>
        <p>
          The Coast offers two ways to invest in your brand: monthly retainer packages for
          founders and teams that want ongoing creative partnership, and à la carte project
          pricing for one-time deliverables. Every package is priced transparently, with no
          hidden fees, no surprise revision costs, and no long-term contracts. You can upgrade,
          downgrade, or pause at any time.
        </p>
        <p>
          The Creator tier is free and gives independent designers and early-stage founders
          access to our brand resource library, templates, and community. The Studio tier is
          designed for agencies and small creative teams who want professional tools and
          collaborative features. The Enterprise tier covers custom retainer scopes for
          established businesses that need a dedicated creative partner across identity,
          marketing, content, and motion. Pricing details for each tier are listed below.
        </p>
        <p>
          Not sure which package is right? Every plan includes a free 30-minute discovery call
          where a strategist will review your current brand, your goals, and your growth stage,
          then recommend the right engagement model. À la carte projects — logo systems,
          websites, motion reels, pitch decks — are quoted individually and can be bundled with
          any retainer.
        </p>
      </section>

      <PricingClient />
    </>
  )
}
