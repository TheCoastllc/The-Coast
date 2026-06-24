/**
 * Resolves the gallery's outbound links (Pinterest + Shopify).
 *
 * Priority: the admin-editable `gallery-settings` Payload global, then the
 * NEXT_PUBLIC_GALLERY_* env vars, then a sensible default (David's existing
 * Pinterest link). Shopify has no default - if it is unset the Shop link hides.
 */
export type GalleryLinks = { pinterest: string; shopify: string }

const ENV_FALLBACK: GalleryLinks = {
  pinterest: process.env.NEXT_PUBLIC_GALLERY_PINTEREST_URL || 'https://pin.it/nW5MRvKEz',
  shopify: process.env.NEXT_PUBLIC_GALLERY_SHOPIFY_URL || '',
}

export function resolveGalleryLinks(
  settings?: { pinterestUrl?: string | null; shopifyUrl?: string | null } | null,
): GalleryLinks {
  return {
    pinterest: settings?.pinterestUrl?.trim() || ENV_FALLBACK.pinterest,
    shopify: settings?.shopifyUrl?.trim() || ENV_FALLBACK.shopify,
  }
}
