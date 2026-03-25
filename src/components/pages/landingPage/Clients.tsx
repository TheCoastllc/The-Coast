import { AnimatedSectionLabel, AnimatedSectionHeading } from './AnimationWrappers'
import { ClientMarquee } from './ClientMarquee'

const clients = [
  'AMG Records', 'Zapped Co', 'OgaTicket', 'Coast Global', 'Brand Builders', 'Empire Studios', 'Vision Labs', 'Nova Creative'
]

export default function Clients() {
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
