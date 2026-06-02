import type { Metadata } from 'next'
import { DEFAULT_OG_IMAGES } from '@/lib/seo'
import { OffersBrandLab } from './OffersLab'

export const metadata: Metadata = {
  title: 'The Brand Lab - Free Brand Diagnostics & The Coast Brand Index',
  description:
    'The Coast Brand Lab: measure your Wave Rating with The Coast Brand Index, then run three free diagnostics - the brand quiz, the consistency checklist, and the 3-second test.',
  alternates: { canonical: 'https://coastglobal.org/offers' },
  openGraph: {
    type: 'website',
    title: 'The Brand Lab - Free Brand Diagnostics | The Coast',
    description:
      'Measure your Wave Rating with The Coast Brand Index and run three free tools to diagnose your brand strength, consistency, and first impressions.',
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
    { '@type': 'ListItem', position: 1, item: { '@type': 'WebApplication', name: 'The Coast Brand Index', url: 'https://coastglobal.org/cbi', applicationCategory: 'BusinessApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } } },
    { '@type': 'ListItem', position: 2, item: { '@type': 'WebApplication', name: 'Brand Quiz', url: 'https://offers.coastglobal.org/brand-quiz', applicationCategory: 'BusinessApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } } },
    { '@type': 'ListItem', position: 3, item: { '@type': 'WebApplication', name: 'Brand Consistency Checklist', url: 'https://offers.coastglobal.org/brand-checklist', applicationCategory: 'BusinessApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } } },
    { '@type': 'ListItem', position: 4, item: { '@type': 'WebApplication', name: 'The 3-Second Brand Test', url: 'https://offers.coastglobal.org/3-second-test', applicationCategory: 'BusinessApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } } },
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

export default function OffersPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offersSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <OffersBrandLab />
    </>
  )
}
