import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { BRAND, COMPANY, PILLARS, PRODUCTS, STUDIO } from '@/lib/content/coast'
import { SERVICE_PAGES } from '@/lib/service-pages'
import { LOCATION_PAGES } from '@/lib/location-pages'
import { CASE_STUDIES } from '@/lib/case-studies'

// llms-full.txt - the llms.txt spec's optional companion: full page content
// concatenated so an LLM can ingest the whole marketing corpus in one fetch
// instead of crawling. Sourced from the same TS content modules that render
// the pages, so it can never drift from the live site.
export const revalidate = 3600

const BASE_URL = 'https://coastglobal.org'

export async function GET() {
  let posts: Array<{ title: string; slug: string; excerpt?: string; directAnswer?: string }> = []
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      limit: 1000,
      sort: '-publishedAt',
      depth: 0,
      select: { title: true, slug: true, excerpt: true, directAnswer: true } as any,
    })
    posts = docs as any[]
  } catch {
    // DB unavailable - serve without posts
  }

  const services = SERVICE_PAGES.map((s) =>
    [
      `### ${s.name}`,
      `URL: ${BASE_URL}/services/${s.slug}`,
      s.heroBody,
      `Timeline: ${s.timeline}. Pricing: ${s.priceRange}.`,
      `Deliverables: ${s.deliverables.join('; ')}.`,
      ...s.faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`),
    ].join('\n\n')
  ).join('\n\n---\n\n')

  const locations = LOCATION_PAGES.map((l) =>
    [
      `### ${l.name} (${l.kind === 'metro' ? 'home base' : 'service area'})`,
      `URL: ${BASE_URL}/locations/${l.slug}`,
      ...l.intro,
      l.engagement,
      ...l.faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`),
    ].join('\n\n')
  ).join('\n\n---\n\n')

  const work = Object.entries(CASE_STUDIES)
    .filter(([, m]) => m.ready)
    .map(([id, m]) => `- ${m.title.split(' - ')[0]} (${BASE_URL}/work/${id}): ${m.description}`)
    .join('\n')

  const blog = posts
    .map((p) => {
      const answer = p.directAnswer ? `\nDirect answer: ${p.directAnswer}` : ''
      return `- ${p.title} (${BASE_URL}/blog/${p.slug})${p.excerpt ? `: ${p.excerpt}` : ''}${answer}`
    })
    .join('\n')

  const content = `# ${BRAND} - Full Content

> Generated: ${new Date().toISOString().split('T')[0]}. Companion to ${BASE_URL}/llms.txt.

## Company

${BRAND} (legal: ${COMPANY.name}) is a branding, digital growth, and AI agency founded by ${COMPANY.founder}. Home base: ${COMPANY.city}. Service areas: Texas, Florida (Miami, Orlando, Tampa), Alabama (Birmingham, Huntsville); remote engagements worldwide. Phone: ${COMPANY.phone}. Email: ${COMPANY.email}. Tagline: "${COMPANY.tagline}". Promise: "${COMPANY.promise}".

${STUDIO.intro}

## The Three Pillars

${PILLARS.map((p) => `### ${p.name}\n\n${p.promise}\n\nServices: ${p.services.join(', ')}.`).join('\n\n')}

## Products

${PRODUCTS.map((p) => `- ${p.name} (${p.statusLabel.toLowerCase()}${p.url ? `, ${p.url}` : ''}): ${p.line}`).join('\n')}

---

## Services (full detail)

${services}

---

## Locations & Service Areas (full detail)

${locations}

---

## Case Studies

${work || '- Case studies coming soon.'}

## Journal (all published posts)

${blog || '- No posts published yet.'}
`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
