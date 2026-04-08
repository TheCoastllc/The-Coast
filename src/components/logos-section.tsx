import { DecorIcon } from '@/components/ui/decor-icon'
import { FullWidthDivider } from '@/components/ui/full-width-divider'
import { getPayloadClient } from '@/lib/payload-client'
import { LogosSectionGrid, type TrustedBrand } from '@/components/logos-section-grid'

async function getBrands(): Promise<TrustedBrand[]> {
  try {
    const payload = await getPayloadClient()
    const data = await payload.findGlobal({ slug: 'trusted-by' })
    const items = (data.items ?? []).filter((item) => item.published)

    return items.map((item, idx) => {
      const logo = typeof item.logo === 'object' && item.logo !== null ? item.logo : null
      return {
        id: String(item.id ?? idx),
        name: item.name,
        logoUrl: logo?.url ?? null,
        logoAlt: logo?.alt ?? item.name,
        url: item.url ?? null,
      }
    })
  } catch {
    return []
  }
}

export async function LogosSection() {
  const brands = await getBrands()

  if (brands.length === 0) return null

  return (
    <section className="mb-12">
      <h2 className="py-6 text-center font-medium text-lg text-muted-foreground tracking-tight md:text-xl">
        Trusted by <span className="text-foreground">industry leaders</span>
      </h2>
      <div className="relative">
        <DecorIcon className="size-4" position="top-left" />
        <DecorIcon className="size-4" position="top-right" />
        <DecorIcon className="size-4" position="bottom-left" />
        <DecorIcon className="size-4" position="bottom-right" />

        <FullWidthDivider className="-top-px" />
        <LogosSectionGrid items={brands} />
        <FullWidthDivider className="-bottom-px" />
      </div>
    </section>
  )
}
