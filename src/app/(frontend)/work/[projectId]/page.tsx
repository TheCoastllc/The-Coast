// To publish a new case study: add an entry to src/lib/case-studies.ts and set ready: true.
// That single change automatically: adds the page to the sitemap, makes it indexable,
// includes it in generateStaticParams, and removes the noindex flag from metadata.
import { notFound } from 'next/navigation'
import { BlueprintLayout } from '@/components/blueprint-layout'
import ZappedCoPage from './ZappedCoPage'
import UnderConstructionPage from './UnderConstructionPage'
import { CASE_STUDIES as projectMeta } from '@/lib/case-studies'

export async function generateMetadata({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const meta = projectMeta[projectId]
  if (!meta) return {}

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `https://coastglobal.org/work/${projectId}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://coastglobal.org/work/${projectId}`,
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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coastglobal.org' },
      { '@type': 'ListItem', position: 2, name: 'Work', item: 'https://coastglobal.org/work' },
      { '@type': 'ListItem', position: 3, name: meta.title.split(' — ')[0] },
    ],
  }

  const creativeWorkSchema = {
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

  return (
    <BlueprintLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }} />
      {meta.ready ? (
        <ZappedCoPage />
      ) : (
        <UnderConstructionPage projectId={projectId} />
      )}
    </BlueprintLayout>
  )
}
