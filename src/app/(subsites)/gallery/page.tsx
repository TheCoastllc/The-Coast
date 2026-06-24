import { getPayloadClient } from '@/lib/payload-client'
import { resolveGalleryLinks } from '@/lib/gallery-links'
import { GalleryExperience } from '@/components/gallery/GalleryExperience'
import { GALLERY_PLACEHOLDERS } from '@/components/gallery/placeholders'
import { displayTitle, type GalleryItem, type GallerySection } from '@/components/gallery/types'

const SITE_URL = 'https://gallery.coastglobal.org'

// Content page: ISR + the collection's afterChange hook revalidates /gallery.
export const revalidate = 300

function toItem(doc: any): GalleryItem | null {
  const img = doc?.image
  const cl = img?.cloudinary
  const src: string | undefined = cl?.secure_url ?? img?.url
  if (!src) return null
  return {
    id: doc.id,
    title: 'Artwork', // never shown (displayTitle suppresses it); keep the filename out of props/SEO
    caption: doc.caption ?? null,
    src,
    width: cl?.width ?? img?.width ?? 4,
    height: cl?.height ?? img?.height ?? 5,
    alt: 'Artwork - The Coast',
    category: doc.category ?? null,
    section: doc.section ?? null,
    shopUrl: doc.shopUrl ?? null,
    pinUrl: doc.pinUrl ?? null,
    featured: !!doc.featured,
  }
}

/** Strip a numeric ordering prefix ("01 ", "1 - ", "1. ") for the display name. */
function sectionDisplayName(raw: string): string {
  if (!raw) return 'Gallery'
  return raw.replace(/^\s*\d{1,3}\s*[-._)]?\s+/, '').trim() || raw
}

const sectionSlug = (text: string): string =>
  'sec-' +
  ((text || 'gallery')
    .toLowerCase()
    .replace(/['‘’"“”]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'gallery')

/** Group items into sections (one Drive subfolder = one section). */
function buildSections(items: GalleryItem[]): GallerySection[] {
  const map = new Map<string, GalleryItem[]>()
  for (const it of items) {
    const key = it.section ?? ''
    const arr = map.get(key)
    if (arr) arr.push(it)
    else map.set(key, [it])
  }
  const sections: GallerySection[] = [...map.entries()].map(([key, sectionItems]) => ({
    key,
    slug: sectionSlug(key),
    name: sectionDisplayName(key),
    items: sectionItems,
  }))
  // Named sections first, ordered by raw value (so "01 ", "02 " prefixes sort
  // numerically); the ungrouped bucket ('') goes last.
  sections.sort((a, b) => {
    if (a.key === b.key) return 0
    if (a.key === '') return 1
    if (b.key === '') return -1
    return a.key.localeCompare(b.key, undefined, { numeric: true })
  })
  return sections
}

export default async function GalleryPage() {
  let items: GalleryItem[] = []
  let links = resolveGalleryLinks(null)

  try {
    const payload = await getPayloadClient()
    const [res, settings] = await Promise.all([
      payload.find({
        collection: 'gallery',
        where: { status: { equals: 'published' } },
        sort: ['order', '-publishedAt'],
        depth: 1,
        limit: 200,
      }),
      payload.findGlobal({ slug: 'gallery-settings' }).catch(() => null),
    ])
    items = res.docs.map(toItem).filter((c): c is GalleryItem => c !== null)
    links = resolveGalleryLinks(settings as any)
  } catch {
    // DB unreachable - fall through to the placeholder wall below.
  }

  // Until real artwork is published in /admin -> Gallery, show the placeholder
  // wall so the subdomain never looks empty. Auto-clears once an item is published.
  if (items.length === 0) items = GALLERY_PLACEHOLDERS

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/#gallery`,
    url: SITE_URL,
    name: 'The Coast Gallery',
    description:
      'A curated gallery of artwork, imagery, and original creatives from The Coast.',
    isPartOf: { '@id': 'https://coastglobal.org/#website' },
    about: { '@id': 'https://coastglobal.org/#organization' },
    mainEntity: {
      '@type': 'ImageGallery',
      name: 'The Coast Gallery',
      image: items.slice(0, 50).map((c) => {
        const name = displayTitle(c.title)
        return {
          '@type': 'ImageObject',
          contentUrl: c.src,
          ...(name ? { name } : {}),
          ...(c.caption ? { caption: c.caption } : {}),
        }
      }),
    },
  }

  const sections = buildSections(items)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GalleryExperience sections={sections} links={links} />
    </>
  )
}
