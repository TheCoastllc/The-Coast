// To publish a new case study: add an entry to src/lib/case-studies.ts and set ready: true.
// That single change automatically: adds the page to the sitemap, makes it indexable,
// includes it in generateStaticParams, and removes the noindex flag from metadata.
//
// Three render bodies (all wrapped by ChamberShell in the ocean design):
//   - ready: false      → UnderConstructionPage (fallback notice)
//   - style: 'cinematic' → CinematicBody (palette / moments / motion / stats / stack / live)
//   - style: 'custom'    → hand-built body (ZappedCoPage)
import { notFound } from 'next/navigation'
import { ChamberShell } from '@/components/ui/ChamberShell'
import ZappedCoPage from './ZappedCoPage'
import UnderConstructionPage from './UnderConstructionPage'
import CinematicBody from './CinematicBody'
import { CASE_STUDIES as projectMeta } from '@/lib/case-studies'
import { DEFAULT_OG_IMAGES } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const meta = projectMeta[projectId]
  if (!meta) return {}

  // Cinematic case studies have their own hero image; use it as OG so shared
  // links unfurl with the project's actual visual instead of the default mark.
  const isCinematic = meta.style === 'cinematic' && meta.ready
  const projectHero = `https://coastglobal.org/portfolio/${projectId}/hero.jpg`
  const ogImages = isCinematic
    ? [
        {
          url: projectHero,
          width: 1920,
          height: 1080,
          alt: `${meta.client ?? meta.title} — ${meta.category ?? 'Case study'}`,
          type: 'image/jpeg',
        },
      ]
    : DEFAULT_OG_IMAGES

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `https://coastglobal.org/work/${projectId}` },
    openGraph: {
      type: 'website',
      title: meta.title,
      description: meta.description,
      url: `https://coastglobal.org/work/${projectId}`,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: isCinematic ? [projectHero] : ['/preview.jpg'],
    },
    ...(!meta.ready && { robots: { index: false, follow: true } }),
  }
}

export function generateStaticParams() {
  return Object.keys(projectMeta).map((projectId) => ({ projectId }))
}

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const meta = projectMeta[projectId]

  if (!meta) notFound()

  // Display name for the chamber title — strip the " — …" marketing suffix.
  const displayName = meta.client ?? meta.title.split(' — ')[0]

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coastglobal.org' },
      { '@type': 'ListItem', position: 2, name: 'Work', item: 'https://coastglobal.org/work' },
      { '@type': 'ListItem', position: 3, name: meta.title.split(' — ')[0] },
    ],
  }

  const creativeWorkSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: meta.title.split(' — ')[0],
    description: meta.description,
    url: `https://coastglobal.org/work/${projectId}`,
    creator: {
      '@type': 'Organization',
      name: 'The Coast',
      url: 'https://coastglobal.org',
    },
  }

  // Enrich the schema for cinematic case studies with their rich metadata
  if (meta.style === 'cinematic' && meta.ready) {
    creativeWorkSchema.image = `https://coastglobal.org/portfolio/${projectId}/hero.jpg`
    creativeWorkSchema.thumbnailUrl = `https://coastglobal.org/portfolio/${projectId}/cover.jpg`
    if (meta.year) {
      creativeWorkSchema.dateCreated = String(meta.year)
      creativeWorkSchema.datePublished = String(meta.year)
    }
    if (meta.client) creativeWorkSchema.about = meta.client
    if (meta.category) creativeWorkSchema.genre = meta.category
    if (meta.role && meta.role.length > 0) creativeWorkSchema.keywords = meta.role.join(', ')
    if (meta.liveUrl) {
      creativeWorkSchema.mainEntityOfPage = {
        '@type': 'WebSite',
        url: meta.liveUrl,
        name: meta.client,
      }
    }
    if (meta.stack && meta.stack.length > 0) {
      creativeWorkSchema.workExample = {
        '@type': 'SoftwareApplication',
        applicationCategory: 'WebApplication',
        operatingSystem: 'Web',
        softwareRequirements: meta.stack.join(', '),
      }
    }
  }

  // Pick the body renderer based on style / ready state.
  const renderBody = () => {
    if (!meta.ready) return <UnderConstructionPage />
    if (meta.style === 'cinematic') return <CinematicBody projectId={projectId} />
    // Default / 'custom' style — hand-built bodies
    if (projectId === 'zappedco') return <ZappedCoPage />
    return <UnderConstructionPage />
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }} />
      <ChamberShell
        index="02"
        label="Work"
        chamber={displayName}
        preface={meta.tagline ?? meta.description}
      >
        {renderBody()}
      </ChamberShell>
    </>
  )
}
