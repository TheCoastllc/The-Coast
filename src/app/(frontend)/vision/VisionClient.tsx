'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { BlueprintLayout, SectionBoundary } from '@/components/blueprint-layout'
import TextReveal from '@/components/TextReveal'
import { ShineButton } from '@/components/ui/ShineButton'
import { FadeOnLoad, FadeOnScroll, SubtleLabel } from '../about/AboutPageAnimations'

const conceptImages = [
  {
    id: 'night',
    number: '01',
    src: '/vision/night.jpeg',
    alt: 'Conceptual rendering of The Coast HQ at night — futuristic waterfront architecture with starry sky (visionary concept only, not an actual building).',
    title: 'Night View',
    tagline: 'A beacon against the dark.',
    description:
      'A nighttime rendering of The Coast HQ rising against a coastal sky. Imagined as a signal — a place where creative minds gather and light stays on after the world has gone quiet.',
  },
  {
    id: 'day',
    number: '02',
    src: '/vision/day.png',
    alt: 'Conceptual rendering of The Coast HQ by day — futuristic waterfront architecture with blue sky and palm trees (visionary concept only, not an actual building).',
    title: 'Day View',
    tagline: 'Smooth sailing, made literal.',
    description:
      'Bathed in natural coastal light, the HQ sits at the waterline. The setting reflects the promise of the name: clarity and creativity where most businesses find choppy water.',
  },
  {
    id: 'blueprint',
    number: '03',
    src: '/vision/blueprint.jpeg',
    alt: 'Blueprint rendering of The Coast HQ — architectural blueprint with dimension lines and palm trees (visionary concept only, not an actual building).',
    title: 'Blueprint',
    tagline: 'Structure behind the vision.',
    description:
      'Every dimension line is intentional. The blueprint is the part of the dream we care about most — turning creative ambition into something buildable, measurable, and real.',
  },
]

export default function VisionClient() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [Autoplay({ delay: 6000, stopOnInteraction: false })],
  )
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
    <BlueprintLayout>
      {/* ─── Hero ──────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <SubtleLabel className="text-mono text-muted-foreground/40 text-xs uppercase tracking-widest block mb-4">
            Vision 2026
          </SubtleLabel>
          <TextReveal as="h1" className="text-heading text-4xl md:text-6xl lg:text-7xl mb-6">
            A Headquarters That Doesn&apos;t Exist Yet.
          </TextReveal>
          <p className="text-body text-muted-foreground text-lg md:text-xl max-w-2xl">
            Conceptual renderings of The Coast HQ — imagining the studio we&apos;re building toward.
            <span className="text-foreground"> Not real buildings. </span>
            A place in our head, rendered so we — and you — can see it.
          </p>

          <FadeOnLoad delay={0.3} className="flex flex-wrap items-center gap-6 md:gap-8 mt-10 pt-8 border-t border-border">
            {[
              { value: '2026', label: 'Vision Year' },
              { value: '03', label: 'Renderings' },
              { value: 'Concept', label: 'Status' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-heading text-2xl md:text-3xl text-foreground">{value}</span>
                <span className="text-mono text-xs text-muted-foreground/60 uppercase tracking-wider">{label}</span>
              </div>
            ))}
            <div className="ml-auto hidden sm:flex items-center gap-2 text-mono text-[10px] uppercase tracking-[0.2em] text-primary/70 px-3 py-1.5 border border-primary/30 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Conceptual Only
            </div>
          </FadeOnLoad>
        </div>
      </section>

      <SectionBoundary />

      {/* ─── Carousel ──────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <FadeOnScroll className="flex items-end justify-between mb-8 md:mb-10 gap-6">
            <div>
              <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary block mb-3">The Renderings</span>
              <p className="text-heading text-3xl md:text-4xl text-foreground max-w-xl">
                Three views. One imagined future.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <button
                onClick={() => emblaApi?.scrollPrev()}
                aria-label="Previous image"
                className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => emblaApi?.scrollNext()}
                aria-label="Next image"
                className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </FadeOnScroll>
        </div>

        <FadeOnScroll delay={0.1}>
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="relative border border-border bg-card overflow-hidden">
              <div ref={emblaRef} className="overflow-hidden">
                <div className="flex">
                  {conceptImages.map((image) => (
                    <div key={image.id} className="flex-[0_0_100%] min-w-0 relative">
                      <div className="aspect-video md:aspect-21/9 relative bg-muted">
                        <img
                          src={image.src}
                          alt={image.alt}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            ; (e.target as HTMLImageElement).src = '/placeholder.svg'
                          }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-background/70 via-transparent to-transparent" />

                        <div className="absolute top-4 left-4 flex items-center gap-2 text-mono text-[10px] uppercase tracking-[0.2em] text-primary/90 px-3 py-1.5 border border-primary/40 bg-background/60 backdrop-blur-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Concept — Not an Actual Building
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between gap-4">
                          <div>
                            <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary/80 block mb-1">
                              {image.number} / {String(conceptImages.length).padStart(2, '0')}
                            </span>
                            <h2 className="text-heading text-2xl md:text-4xl text-foreground">{image.title}</h2>
                          </div>
                          <p className="text-body text-muted-foreground text-sm max-w-xs hidden md:block">
                            {image.tagline}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Indicators */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {conceptImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  aria-label={`Go to rendering ${index + 1}`}
                  className={`h-[2px] transition-all duration-300 ${selectedIndex === index ? 'w-10 bg-primary' : 'w-5 bg-border hover:bg-muted-foreground'
                    }`}
                />
              ))}
            </div>
          </div>
        </FadeOnScroll>
      </section>

      <SectionBoundary />

      {/* ─── Concept Details ───────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="flex items-center gap-4 border-t border-border pt-4 mb-0">
            <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary">The Concepts</span>
          </div>

          {conceptImages.map((image, i) => (
            <FadeOnScroll key={image.id} delay={i * 0.05}>
              <div className="group relative border-b border-border">
                <div className="absolute left-0 top-0 h-full w-[2px] bg-primary origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                <div className="flex items-center gap-4 md:gap-8 py-5 md:py-7 pl-5 md:pl-8 pr-4">
                  <span className="text-mono text-xs text-primary/40 w-8 shrink-0 tabular-nums">{image.number}</span>
                  <h3 className="text-heading text-xl md:text-3xl lg:text-4xl text-foreground flex-1 group-hover:translate-x-1 group-hover:text-primary transition-all duration-300">
                    {image.title}
                  </h3>
                  <p className="text-body text-muted-foreground text-sm hidden md:block md:w-72 lg:w-96 shrink-0">
                    {image.description}
                  </p>
                  <button
                    onClick={() => emblaApi?.scrollTo(i)}
                    aria-label={`Show ${image.title}`}
                    className="shrink-0 w-9 h-9 md:w-10 md:h-10 border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300"
                  >
                    <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300" />
                  </button>
                </div>
                <p className="text-body text-muted-foreground text-xs pl-[52px] pr-14 pb-4 md:hidden leading-relaxed">
                  {image.description}
                </p>
              </div>
            </FadeOnScroll>
          ))}
        </div>
      </section>

      <SectionBoundary />

      {/* ─── Behind the Concepts ───────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <FadeOnScroll>
              <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary block mb-6">Behind the Concepts</span>
              <p className="text-heading text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
                A dream, rendered. Not to impress — to commit.
              </p>
              <div className="mt-8 border-l-2 border-primary pl-6">
                <p className="text-body text-muted-foreground text-lg leading-relaxed">
                  &ldquo;We render our vision so we can&apos;t forget it. Then we build the work that earns it.&rdquo;
                </p>
              </div>
            </FadeOnScroll>

            <FadeOnScroll delay={0.1} className="space-y-5 text-body text-muted-foreground text-base md:text-lg leading-relaxed">
              <p>
                Everything on this page is a concept. The building doesn&apos;t exist, the waterfront isn&apos;t ours yet,
                and the blueprint was drawn for the feeling more than the feet.
              </p>
              <p>
                <strong className="text-foreground">That&apos;s the point.</strong>
              </p>
              <p>
                Every brand we build starts the same way — imagined loud enough that it becomes real. We help
                entrepreneurs render their ambition before a single product ships. These images are ours; yours
                come next.
              </p>
              <p className="text-sm text-muted-foreground/60 italic">
                Note: These renderings are purely conceptual and do not represent actual construction plans,
                property, or real estate developments.
              </p>
            </FadeOnScroll>
          </div>
        </div>
      </section>

      <SectionBoundary />

      {/* ─── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
          >
            <div>
              <p className="text-mono text-muted-foreground/40 text-xs uppercase tracking-widest mb-2">
                Render your own empire.
              </p>
              <p className="text-heading text-2xl md:text-4xl text-foreground max-w-md">
                Inspired by our HQ vision? Let&apos;s render yours.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <ShineButton href="/brand-avatar" size="md">Try Brand Builder</ShineButton>
              <ShineButton href="/get-started" size="md" variant="ghost">Start a Project</ShineButton>
            </div>
          </motion.div>
        </div>
      </section>
    </BlueprintLayout>
  )
}
