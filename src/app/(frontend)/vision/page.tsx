import type { Metadata } from 'next'
import VisionClient from './VisionClient'

export const metadata: Metadata = {
  title: 'Vision 2026 — The Coast HQ Concept & Future of Brand Design',
  description:
    'The Coast HQ: conceptual renderings of a futuristic waterfront headquarters, imagining the future of brand design. Vision 2026.',
  alternates: { canonical: 'https://coastglobal.org/vision' },
  openGraph: {
    title: 'Vision 2026 | The Coast HQ Concept',
    description:
      'Visionary conceptual renderings of The Coast HQ — where innovation meets coastal serenity.',
    url: 'https://coastglobal.org/vision',
  },
}

export default function VisionPage() {
  return <VisionClient />
}
