/** A single gallery cell, shaped server-side from a published Gallery doc. */
export type GalleryItem = {
  id: string | number
  title: string
  caption: string | null
  src: string
  width: number
  height: number
  alt: string
  category: string | null
  section?: string | null
  shopUrl: string | null
  pinUrl: string | null
  featured: boolean
}

/** A named group of gallery items (one Drive subfolder = one section). */
export type GallerySection = {
  key: string // raw section value ('' = ungrouped)
  slug: string // anchor id
  name: string // display name (numeric ordering prefix stripped)
  items: GalleryItem[]
}

const CATEGORY_LABELS: Record<string, string> = {
  artwork: 'Artwork',
  illustration: 'Illustration',
  photography: 'Photography',
  brand: 'Brand',
  product: 'Product',
  other: 'Other',
}

export const categoryLabel = (value: string | null): string =>
  (value && CATEGORY_LABELS[value]) || (value ? value : 'Other')

// David wants NO names shown on the gallery (filenames like "ChatGPT Image ..."
// or "IMG 4153" were leaking through). Suppress every title. Kept as a helper so
// headings can be re-enabled later by restoring the pattern check.
export const displayTitle = (_title: string): string | null => null
