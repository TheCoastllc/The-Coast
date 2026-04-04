import { notFound } from 'next/navigation'
import { BlueprintLayout } from '@/components/blueprint-layout'
import ZappedCoPage from './ZappedCoPage'
import UnderConstructionPage from './UnderConstructionPage'

const projectMeta: Record<string, { title: string; description: string; ready: boolean }> = {
  zappedco: {
    title: 'Zapped Co — Brand Transformation | The Coast',
    description:
      'Complete brand identity transformation for Zapped Co — from DIY lightning bolt to a dynamic, modern visual system across 15+ deliverables.',
    ready: true,
  },
  'amg-records': {
    title: 'AMG Records — Brand Identity | The Coast',
    description:
      'A bold visual identity for a record label pushing boundaries in sound and culture.',
    ready: false,
  },
  ogaticket: {
    title: 'OgaTicket — Web Development | The Coast',
    description:
      "End-to-end digital platform for Africa's next-gen event ticketing experience.",
    ready: false,
  },
  'hatch-startup-nation': {
    title: 'Hatch Startup Nation — Brand Identity | The Coast',
    description:
      'Crafting the identity for an incubator nurturing the next wave of founders.',
    ready: false,
  },
  prospry: {
    title: 'Prospry — Brand Identity | The Coast',
    description:
      'A clean, prosperous visual system for a fintech brand built on trust.',
    ready: false,
  },
}

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
