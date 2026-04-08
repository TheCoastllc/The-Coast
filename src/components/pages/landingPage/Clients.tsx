import { getPayloadClient } from '@/lib/payload-client'
import { AnimatedSectionLabel, AnimatedSectionHeading } from './AnimationWrappers'
import { ClientMarquee, type MarqueeBrand } from './ClientMarquee'

async function getClients(): Promise<MarqueeBrand[]> {
  try {
    const payload = await getPayloadClient()
    const data = await payload.findGlobal({ slug: 'trusted-by' })
    return (data.items ?? [])
      .filter((item) => item.published)
      .map((item) => {
        const logo = typeof item.logo === 'object' && item.logo !== null ? item.logo : null
        return {
          name: item.name,
          logoUrl: logo?.url ?? null,
          logoAlt: logo?.alt ?? item.name,
        }
      })
  } catch {
    return []
  }
}

export default async function Clients() {
  const clients = await getClients()

  if (clients.length === 0) return null

  return (
    <section className="py-32 bg-black overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <AnimatedSectionLabel>
          <span className="text-primary text-xs tracking-[0.3em] uppercase font-mono">06</span>
          <div className="w-12 h-px bg-white/20" />
          <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase">Partners</span>
        </AnimatedSectionLabel>
        <AnimatedSectionHeading
          text="Trusted By"
          highlight={["By"]}
          className="text-4xl md:text-5xl lg:text-6xl font-display uppercase tracking-tighter"
        />
      </div>

      {/* Client names rendered server-side, marquee animation is client-side */}
      <ClientMarquee clients={clients} />
    </section>
  )
}
