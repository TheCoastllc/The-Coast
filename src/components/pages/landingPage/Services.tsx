import { AnimatedSectionLabel, AnimatedSectionHeading, StaggerContainer } from './AnimationWrappers'
import BentoGrid1 from '@/components/mvpblocks/bento-grid-1'

export default function Services() {
  return (
    <section className="py-24 bg-black relative" id="services">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <AnimatedSectionLabel>
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-mono">03</span>
            <div className="w-12 h-px bg-white/20" />
            <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase">Capabilities</span>
          </AnimatedSectionLabel>
          <AnimatedSectionHeading
            text="What Brand Design Services Does The Coast Offer?"
            highlight={['Coast', 'Offer']}
            className="text-4xl md:text-5xl lg:text-6xl font-display uppercase tracking-tighter"
          />
        </div>

        {/* SSR-visible service descriptions for AI crawlers */}
        <div className="sr-only">
          <h3>Brand Identity</h3>
          <p>Custom branding and logo design - your visual identity, refined and unforgettable. From mood boards to comprehensive brand guidelines, we engineer identities that demand attention.</p>
          <h3>Digital Experience</h3>
          <p>Websites, apps, and digital products designed for impact, usability, and conversion. We blend cutting-edge technology with uncompromising aesthetics.</p>
          <h3>Creative Strategy</h3>
          <p>Data-driven insights combined with bold creativity to position your brand as a market leader.</p>
          <h3>Marketing Assets</h3>
          <p>Flyers, social graphics, pitch decks, and digital assets that convert - campaigns that capture attention and drive measurable results.</p>
        </div>

        {/* Animated Bento Grid (client component) */}
        <StaggerContainer>
          <BentoGrid1 />
        </StaggerContainer>
      </div>
    </section>
  )
}
