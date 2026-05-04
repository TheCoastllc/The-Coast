import { AnimatedSectionLabel, AnimatedSectionHeading, StaggerContainer } from './AnimationWrappers'
import BentoGrid1 from '@/components/mvpblocks/bento-grid-1'
import Link from 'next/link'

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

        {/* SSR-visible service links for crawlers and accessibility */}
        <nav aria-label="Services" className="sr-only">
          <Link href="/services/brand-identity">Brand Identity Design Services</Link>
          <p>Custom branding and logo design — your visual identity, refined and unforgettable. From mood boards to comprehensive brand guidelines, we engineer identities that demand attention.</p>
          <Link href="/services/logo-design">Logo Design for Small Business</Link>
          <p>Custom logo with 3 concepts and 2 revision rounds. Delivered in every format your business needs.</p>
          <Link href="/services/website-design">Website Design for Startups</Link>
          <p>Websites and digital products designed for impact, usability, and conversion.</p>
          <Link href="/services/brand-guidelines">Brand Guidelines Design Service</Link>
          <p>Data-driven creative strategy to position your brand as a market leader.</p>
          <Link href="/services/social-graphics">Social Media Graphics Design Service</Link>
          <p>Flyers, social graphics, pitch decks, and digital assets that convert.</p>
          <Link href="/services/pitch-deck">Pitch Deck Design Service</Link>
          <p>Investor-ready presentation design that gets meetings.</p>
          <Link href="/services/epk-design">EPK Design Service for Artists</Link>
          <p>Professional electronic press kits for musicians, artists, and entertainers.</p>
          <Link href="/services">View All Services</Link>
        </nav>

        {/* Animated Bento Grid (client component) */}
        <StaggerContainer>
          <BentoGrid1 />
        </StaggerContainer>
      </div>
    </section>
  )
}
