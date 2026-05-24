import { getPayloadClient } from '@/lib/payload-client'
import { TrustedLedger, type LedgerBrand } from '@/components/TrustedLedger'
import { TRUSTED_BRANDS_FALLBACK } from '@/lib/trusted-brands-fallback'

/**
 * Fetches the Payload `trusted-by` global. Returns the hardcoded fallback
 * list when Payload is empty (fresh installs, local dev) so the section
 * always has something to render.
 */
async function getBrands(): Promise<LedgerBrand[]> {
  try {
    const payload = await getPayloadClient()
    const data = await payload.findGlobal({ slug: 'trusted-by' })
    const items = (data.items ?? []).filter((item) => item.published)

    if (items.length === 0) return TRUSTED_BRANDS_FALLBACK

    return items.map((item, idx): LedgerBrand => ({
      id: String(item.id ?? idx),
      name: item.name,
      wordmark: (item as any).wordmark ?? undefined,
      category: (item as any).category ?? undefined,
      year: (item as any).year ?? undefined,
      caseStudySlug: (item as any).caseStudySlug ?? undefined,
      url: item.url ?? undefined,
    }))
  } catch {
    // Payload not ready / not connected — show the fallback rather than nothing.
    return TRUSTED_BRANDS_FALLBACK
  }
}

export async function LogosSection() {
  const brands = await getBrands()
  return <TrustedLedger brands={brands} />
}
