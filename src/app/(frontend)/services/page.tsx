import type { Metadata } from 'next'
import ServicesClient from './ServicesClient'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Custom logo design, visual identity, brand guidelines, marketing collateral, social graphics, pitch decks, video, digital marketing, and social media management.',
  alternates: { canonical: 'https://coastglobal.org/services' },
  openGraph: {
    title: 'Brand Design Services | The Coast',
    description:
      'From logo design to full brand transformations — everything your business needs to stand out.',
    url: 'https://coastglobal.org/services',
  },
}

export default function ServicesPage() {
  return <ServicesClient />
}
