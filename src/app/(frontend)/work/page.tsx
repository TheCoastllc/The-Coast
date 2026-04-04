import { BlueprintLayout } from '@/components/blueprint-layout'
import WorkPageContent from '@/components/pages/workPage/WorkPageContent'

export const metadata: import('next').Metadata = {
  title: 'Our Work — Brand Transformations',
  description:
    'Explore brand transformations, logo design projects, and creative work from The Coast. Real results for real businesses.',
  alternates: { canonical: 'https://coastglobal.org/work' },
  openGraph: {
    title: 'Our Work | Brand Transformations | The Coast',
    description: 'Brand transformations, creative projects, and the stories behind them.',
    url: 'https://coastglobal.org/work',
  },
}

const workBreadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coastglobal.org' },
    { '@type': 'ListItem', position: 2, name: 'Work', item: 'https://coastglobal.org/work' },
  ],
}

const workCollectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://coastglobal.org/work#webpage',
  url: 'https://coastglobal.org/work',
  name: 'Our Work — Brand Transformations',
  description: 'Explore brand transformations, logo design projects, and creative work from The Coast.',
  isPartOf: { '@id': 'https://coastglobal.org/#website' },
}

export default function WorkPage() {
  return (
    <BlueprintLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(workBreadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(workCollectionSchema) }} />
      <WorkPageContent />
    </BlueprintLayout>
  )
}
