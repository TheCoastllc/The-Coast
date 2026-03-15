import type { Metadata } from 'next'
import PricingClient from './PricingClient'

export const metadata: Metadata = {
  title: 'Pricing',
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

export default function PricingPage() {
  return <PricingClient />
}
