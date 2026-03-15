import type { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'About',
  description:
    'The Coast was built to level the playing field — giving entrepreneurs, startups, and small businesses the branding power that makes people stop, look, and remember.',
  alternates: { canonical: 'https://coastglobal.org/about' },
  openGraph: {
    title: 'About The Coast | Brand Design Studio',
    description:
      'Founded by David Coast, we turn visions into empires. Professional branding for entrepreneurs, artists, and growing businesses.',
    url: 'https://coastglobal.org/about',
  },
}

export default function AboutPage() {
  return <AboutClient />
}
