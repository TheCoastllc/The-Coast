import type { Metadata } from 'next'
import VisionClient from './VisionClient'
import { DEFAULT_OG_IMAGES, buildTwitter } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Vision 2026 - The Coast HQ Concept',
  description:
    'The Coast HQ: conceptual renderings of a futuristic waterfront headquarters, imagining the future of brand design. Vision 2026.',
  alternates: { canonical: 'https://coastglobal.org/vision' },
  twitter: buildTwitter({
    title: 'Vision 2026 | The Coast HQ Concept',
    description:
      'Visionary conceptual renderings of The Coast HQ - where innovation meets coastal serenity.',
  }),
  openGraph: {
    type: 'website',
    title: 'Vision 2026 | The Coast HQ Concept',
    description:
      'Visionary conceptual renderings of The Coast HQ - where innovation meets coastal serenity.',
    url: 'https://coastglobal.org/vision',
    images: DEFAULT_OG_IMAGES,
  },
}

export default function VisionPage() {
  return <VisionClient />
}
