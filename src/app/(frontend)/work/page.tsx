import type { Metadata } from 'next'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { CASE_STUDIES, CASE_STUDY_ORDER } from '@/lib/case-studies'
import { WorkShowcase, type WorkProject } from '@/components/work/WorkShowcase'
import { DEFAULT_OG_IMAGES, buildTwitter } from '@/lib/seo'

const pub = (rel: string) => existsSync(join(process.cwd(), 'public', rel))

/** Build the showcase manifest, verifying every asset on disk so the client
 *  never requests a hero/video/moment that doesn't exist (cover-only projects,
 *  zappedco's custom set, and prospry's placeholder all degrade cleanly). */
function buildProjects(): WorkProject[] {
  return CASE_STUDY_ORDER.map((id) => {
    const c = CASE_STUDIES[id]
    const heroExists = pub(`portfolio/${id}/hero.jpg`)
    const videoExists = pub(`portfolio/${id}/video.webm`)
    const moments = (c.moments ?? []).filter((m) => pub(m.image.replace(/^\//, '')))
    return {
      id,
      client: c.client ?? id,
      tagline: c.tagline,
      summary: c.summary,
      category: c.category,
      year: c.year,
      color: c.color,
      textColor: c.textColor,
      liveUrl: c.liveUrl,
      palette: c.palette,
      role: c.role,
      ready: c.ready,
      cover: `/portfolio/${id}/cover.jpg`,
      hero: heroExists ? `/portfolio/${id}/hero.jpg` : undefined,
      video: videoExists ? `/portfolio/${id}/video.webm` : undefined,
      moments,
      rich: videoExists,
    }
  })
}

export const metadata: Metadata = {
  title: 'Our Work - Brand Transformations',
  description:
    'Brand transformations, creative projects, and the stories behind them - logo design, rebrands, and full visual identities from The Coast Global.',
  alternates: { canonical: 'https://coastglobal.org/work' },
  twitter: buildTwitter({
    title: 'Our Work | Brand Transformations | The Coast Global',
    description: 'Brand transformations, creative projects, and the stories behind them.',
  }),
  openGraph: {
    type: 'website',
    title: 'Our Work | Brand Transformations | The Coast Global',
    description: 'Brand transformations, creative projects, and the stories behind them.',
    url: 'https://coastglobal.org/work',
    images: DEFAULT_OG_IMAGES,
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
  name: 'Our Work',
  description: 'Explore brand transformations, logo design projects, and creative work from The Coast Global.',
  isPartOf: { '@id': 'https://coastglobal.org/#website' },
}

// The /work showcase: full-bleed cinematic project frames. Three switchable
// directions behind ?work= (frames / flood / reel) - see WorkShowcase.
// (Detail pages at /work/[projectId] stay on their own cinematic renderer.)
export default function WorkPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(workBreadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(workCollectionSchema) }} />
      <WorkShowcase projects={buildProjects()} />
    </>
  )
}
