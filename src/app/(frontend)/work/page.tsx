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

      <section className="sr-only">
        <h2>Brand Transformation Case Studies from The Coast</h2>
        <p>
          The Coast portfolio is a running archive of the brand transformations we have led for
          founders, operators, and creative leads across sectors. Each case study documents the
          starting point, the strategic thinking, the design decisions, and the measurable
          outcomes — from initial positioning and visual identity through collateral, digital,
          and motion deliverables. We publish full case studies only for engagements where the
          client has agreed to share the work publicly and where the scope included more than a
          single deliverable.
        </p>
        <p>
          The work spans industries and stages: consumer brands, fintech and SaaS, record labels
          and entertainment, ticketing and events, startup incubators, and founder-led service
          businesses. Most projects include a complete logo and mark system, a defined color and
          typography system, collateral like business cards, pitch decks and social kits, and —
          where relevant — a rebuilt website, packaging, or motion and 3D extensions. Click any
          project below to see the full process, the before-and-after comparisons, and the
          deliverables that shipped.
        </p>
        <p>
          Projects marked as in-progress are currently being documented and will be published
          when the case study is complete. If you are interested in a similar engagement for your
          own brand, visit /get-started or /pricing to see how we work and what the investment
          looks like.
        </p>
      </section>

      <WorkPageContent />
    </BlueprintLayout>
  )
}
