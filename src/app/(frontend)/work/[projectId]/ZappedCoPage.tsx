'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { SectionBoundary } from '@/components/blueprint-layout'
import { ShineButton } from '@/components/ui/ShineButton'
import { DecorIcon } from '@/components/ui/decor-icon'
import { FullWidthDivider } from '@/components/ui/full-width-divider'
import TextReveal from '@/components/TextReveal'
import { usePageTransition } from '@/components/PageTransition'

const stats = [
  { value: '100%', label: 'Full Rebrand' },
  { value: '15+', label: 'Deliverables' },
  { value: '∞', label: 'Multi-Platform' },
]

const deliverables = [
  {
    number: '01',
    title: 'Logo & Mark System',
    items: ['Primary Logo', 'Z Mark Icon', 'Circular Badge', 'Wordmark', 'Pattern System'],
  },
  {
    number: '02',
    title: 'Marketing Collateral',
    items: ['5 Branded Flyers', 'Campaign Advertisement', 'Social Media Kit'],
  },
  {
    number: '03',
    title: 'Branded Merchandise',
    items: ['T-Shirt Design', 'Cap Design', 'Branded Lanyards'],
  },
  {
    number: '04',
    title: 'Real-World Applications',
    items: ['Billboard Design', '3D Billboard', 'Wall Signage', 'A-Frame Sign'],
  },
  {
    number: '05',
    title: 'Digital & Motion',
    items: ['3D Logo Animation', 'Website Redesign', 'E-Commerce Overhaul'],
  },
]

/* ─── Parallax image block ─── */
function ParallaxImage({
  src,
  alt,
  aspect = 'aspect-[16/9]',
}: {
  src: string
  alt: string
  aspect?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, clipPath: 'inset(6% 6% 6% 6%)' }}
      whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden border border-border/30 ${aspect}`}
    >
      <motion.img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-[110%] object-cover"
        style={{ y }}
        loading="lazy"
        draggable={false}
      />
    </motion.div>
  )
}

/* ─── Before / After comparison ─── */
function BeforeAfter() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
      <div>
        <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/30 block mb-3">
          Before
        </span>
        <ParallaxImage src="/portfolio/zappedco/before.jpg" alt="Zapped Co — before rebrand" aspect="aspect-[4/3]" />
      </div>
      <div>
        <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary/50 block mb-3">
          After
        </span>
        <ParallaxImage src="/portfolio/zappedco/final.jpg" alt="Zapped Co — after rebrand" aspect="aspect-[4/3]" />
      </div>
    </div>
  )
}

/* ─── Page ─── */
export default function ZappedCoPage() {
  const { navigateTo } = usePageTransition()

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          {/* Back link */}
          <motion.button
            onClick={() => navigateTo('/work')}
            className="flex items-center gap-2 text-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-primary transition-colors duration-300 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            All Projects
          </motion.button>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-mono">01</span>
            <div className="w-12 h-px bg-white/20" />
            <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase">
              Branding
            </span>
            <span className="text-muted-foreground/30 text-xs tracking-wider ml-auto font-mono">
              2025
            </span>
          </div>

          <TextReveal
            className="text-4xl md:text-5xl lg:text-7xl font-display uppercase tracking-tighter"
            highlight={['Zapped']}
          >
            Zapped Co
          </TextReveal>

          <motion.p
            className="text-body text-muted-foreground/50 text-base md:text-lg max-w-2xl mt-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            From a DIY lightning bolt to an industry-leading identity system. A complete brand
            transformation across 15+ deliverables — strategy, identity, collateral, merchandise,
            and digital.
          </motion.p>

          {/* Tags */}
          <motion.div
            className="flex flex-wrap gap-2 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {['Visual Identity', 'Strategy', 'Collateral', 'Web Design', 'Motion'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 border border-border/40 text-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/40"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex items-center gap-10 mt-10 pt-8 border-t border-border/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            {stats.map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-heading text-2xl md:text-3xl text-foreground">{value}</span>
                <span className="text-mono text-[10px] text-muted-foreground/40 uppercase tracking-wider">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <SectionBoundary />

      {/* Cover image */}
      <section className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <ParallaxImage
            src="/portfolio/zappedco/cover.jpg"
            alt="Zapped Co brand identity"
          />
        </div>
      </section>

      <SectionBoundary />

      {/* The Story */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-16">
            {/* Label */}
            <div className="md:col-span-2">
              <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary/50 block mb-3">
                The Challenge
              </span>
              <h2 className="text-heading text-2xl md:text-3xl text-foreground">
                A brand that needed to match its ambition.
              </h2>
            </div>

            {/* Body */}
            <div className="md:col-span-3">
              <p className="text-body text-muted-foreground/60 text-sm md:text-base leading-relaxed mb-6">
                Zapped Co came to us ready for a change. Their existing brand felt dated and
                disconnected from their ambitious vision — a DIY lightning bolt on a wrinkled
                banner, no logo variations, no color palette, no branded materials. They needed more
                than a logo refresh. They needed a complete identity overhaul.
              </p>
              <p className="text-body text-muted-foreground/60 text-sm md:text-base leading-relaxed">
                We rebuilt Zapped Co from the ground up. A dynamic new logo design that captures
                energy and innovation. A sophisticated color palette with vibrant accents. A complete
                visual system that works across every touchpoint. The result? A brand that commands
                attention and stays in memory.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SectionBoundary />

      {/* Before / After */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary/50 block mb-8">
            Transformation
          </span>
          <BeforeAfter />
        </div>
      </section>

      <SectionBoundary />

      {/* Process image */}
      <section className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <div>
              <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/30 block mb-3">
                Process
              </span>
              <ParallaxImage src="/portfolio/zappedco/sketch.jpg" alt="Logo concept sketches" aspect="aspect-[4/3]" />
            </div>
            <div>
              <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/30 block mb-3">
                Development
              </span>
              <ParallaxImage src="/portfolio/zappedco/dev.jpg" alt="Brand development" aspect="aspect-[4/3]" />
            </div>
          </div>
        </div>
      </section>

      <SectionBoundary />

      {/* Deliverables */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary/50 block mb-3">
            Deliverables
          </span>
          <h2 className="text-heading text-2xl md:text-3xl text-foreground mb-10">
            What we created.
          </h2>

          <div className="relative">
            <DecorIcon className="size-4" position="top-left" />
            <DecorIcon className="size-4" position="top-right" />
            <DecorIcon className="size-4" position="bottom-left" />
            <DecorIcon className="size-4" position="bottom-right" />
            <FullWidthDivider className="-top-px" />

            <div className="border">
              {deliverables.map((group, i) => (
                <motion.div
                  key={group.number}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className={`group flex flex-col md:flex-row md:items-start gap-4 md:gap-8 p-6 md:p-8 ${
                    i < deliverables.length - 1 ? 'border-b' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 md:w-48 shrink-0">
                    <span className="text-mono text-xs text-primary/40 tabular-nums">
                      {group.number}
                    </span>
                    <h3 className="text-heading text-base md:text-lg text-foreground">
                      {group.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1 border border-border/30 text-[10px] md:text-[11px] text-muted-foreground/50 uppercase tracking-wider"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <FullWidthDivider className="-bottom-px" />
          </div>
        </div>
      </section>

      <SectionBoundary />

      {/* Website video */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary/50 block mb-3">
            Website Redesign
          </span>
          <h2 className="text-heading text-2xl md:text-3xl text-foreground mb-4">
            From basic Shopify to premium e-commerce.
          </h2>
          <p className="text-body text-muted-foreground/50 text-sm md:text-base max-w-2xl mb-8 leading-relaxed">
            We transformed a pastel, generic Shopify theme into a dark, premium e-commerce
            experience with bold typography, clear visual hierarchy, and cohesive branding across
            every page.
          </p>

          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(4% 4% 4% 4%)' }}
            whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden border border-border/30 aspect-video"
          >
            <video
              src="/portfolio/zappedco/website-before-after.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      <SectionBoundary />

      {/* Impact quote */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary/50 block mb-6">
                The Result
              </span>
              <blockquote className="text-heading text-xl md:text-3xl lg:text-4xl text-foreground leading-tight mb-6">
                A brand that commands attention and stays in memory.
              </blockquote>
              <p className="text-body text-muted-foreground/40 text-sm md:text-base leading-relaxed">
                Our designs didn&apos;t stay in Figma. We guided Zapped Co through real-world
                implementation across billboards, retail signage, packaging, and digital platforms.
                Every execution was faithful to the system while adapting to each medium&apos;s
                unique demands.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <SectionBoundary />

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
          >
            <div>
              <p className="text-mono text-muted-foreground/30 text-[10px] uppercase tracking-[0.2em] mb-3">
                Ready for your transformation?
              </p>
              <p className="text-heading text-2xl md:text-4xl text-foreground max-w-md">
                Let&apos;s create something unforgettable.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <ShineButton href="/get-started" size="md">
                Start a Project
              </ShineButton>
              <ShineButton href="/work" size="md" variant="ghost">
                View All Work
              </ShineButton>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
