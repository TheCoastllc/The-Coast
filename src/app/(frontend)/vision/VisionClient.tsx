'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, Building2, Sparkles } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { BlueprintLayout, SectionBoundary } from '@/components/blueprint-layout'
import TextReveal from '@/components/TextReveal'

const conceptImages = [
  {
    id: 'night',
    src: '/images/Coast_HQ_nightglowing_beside-0.jpg',
    alt: 'Conceptual rendering of The Coast HQ at night – futuristic waterfront architecture with starry sky (visionary concept only, not actual building)',
    title: 'Night View',
    description:
      'A stunning nighttime vision of The Coast HQ rising against a starry coastal sky. This conceptual rendering imagines our future headquarters as a beacon of innovation—where creative minds gather to design the future.',
  },
  {
    id: 'day',
    src: '/images/The_Coast_HQ_day_beach.png',
    alt: 'Conceptual rendering of The Coast HQ by day – futuristic waterfront architecture with blue sky and palm trees (visionary concept only, not actual building)',
    title: 'Day View',
    description:
      'Bathed in natural coastal light, this conceptual rendering showcases The Coast HQ in its full glory. The waterfront setting reflects our mission: smooth sailing through the choppy waters of business.',
  },
  {
    id: 'blueprint',
    src: '/images/Coast_HQ_blueprint.jpg',
    alt: 'Blueprint rendering of The Coast HQ – architectural blueprint with dimension lines and palm trees (visionary concept only, not actual building)',
    title: 'Blueprint',
    description:
      'The architectural blueprint of The Coast HQ reveals the structural vision behind the design. Every dimension line and detail reflects meticulous planning—turning creative ambition into a tangible masterplan.',
  },
]

export default function VisionClient() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })])

  return (
    <BlueprintLayout>
      {/* Hero Section with Carousel */}
      <section className="relative pt-20 md:pt-24">
        <div className="bg-primary/10 border-b border-primary/20 py-3 text-center">
          <p className="text-sm text-primary font-medium flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Conceptual Renderings Only – Visionary Architecture Concepts</span>
            <Sparkles className="w-4 h-4" />
          </p>
        </div>

        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {conceptImages.map((image) => (
                <div key={image.id} className="flex-[0_0_100%] min-w-0 relative">
                  <div className="aspect-[16/9] md:aspect-[21/9] relative bg-muted">
                    <img src={image.src} alt={image.alt} loading="lazy" className="w-full h-full object-contain" onError={(e) => { ; (e.target as HTMLImageElement).src = '/placeholder.svg' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <span className="text-xs text-muted-foreground font-medium">Conceptual Rendering – Not Actual Building</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => emblaApi?.scrollPrev()} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors" aria-label="Previous image">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={() => emblaApi?.scrollNext()} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors" aria-label="Next image">
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {conceptImages.map((_, index) => (
              <button key={index} onClick={() => emblaApi?.scrollTo(index)} className="w-2 h-2 rounded-full bg-foreground/30 hover:bg-foreground/60 transition-colors" aria-label={`Go to slide ${index + 1}`} />
            ))}
          </div>
        </div>
      </section>

      <SectionBoundary />

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-mono text-primary mb-4 block">VISION 2026</span>
            <TextReveal as="h1" className="text-display text-3xl md:text-5xl lg:text-6xl mb-6">Our Vision for The Coast HQ</TextReveal>
            <p className="text-body text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              These conceptual renderings showcase a futuristic waterfront headquarters, blending innovation with coastal serenity. <strong className="text-foreground">Not actual buildings</strong>—pure inspiration for turning visions into empires.
            </p>
          </motion.div>

          <div className="space-y-16 md:space-y-24">
            {conceptImages.map((image, index) => (
              <motion.div key={image.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}>
                <div className="flex-1 w-full">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img src={image.src} alt={image.alt} loading="lazy" className="w-full h-auto" onError={(e) => { ; (e.target as HTMLImageElement).src = '/placeholder.svg' }} />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
                      <span className="text-xs text-muted-foreground">Conceptual rendering – imagining the future</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <h2 className="text-heading text-2xl md:text-3xl flex items-center gap-3"><Building2 className="w-6 h-6 text-primary" />{image.title}</h2>
                  <p className="text-body text-muted-foreground leading-relaxed">{image.description}</p>
                  <p className="text-sm text-muted-foreground/70 italic">*This is a conceptual visualization only and does not represent an actual building or construction plans.</p>
                </div>
              </motion.div>
            ))}
          </div>

          <SectionBoundary />

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mt-20 md:mt-32 bg-card rounded-2xl p-8 md:p-12 border border-border">
            <h2 className="text-heading text-2xl md:text-3xl mb-6 text-center">Behind the Concepts</h2>
            <div className="space-y-6 text-body text-muted-foreground leading-relaxed max-w-2xl mx-auto text-center">
              <p>These visionary concepts embody everything The Coast stands for: <strong className="text-foreground">innovation, coastal serenity, and the bold pursuit of excellence</strong>.</p>
              <p>Just as we help small businesses transform their visions into memorable brands, these renderings represent our own dream—a future headquarters that serves as a beacon for creative minds and ambitious entrepreneurs.</p>
              <p className="text-sm italic text-muted-foreground/70">Note: These are purely conceptual designs created for inspiration and do not represent actual construction plans or real estate developments.</p>
            </div>
          </motion.div>

          <SectionBoundary />

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mt-16 md:mt-24 text-center">
            <h3 className="text-heading text-xl md:text-2xl mb-6">Ready to Build Your Own Vision?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/brand-avatar" className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full text-mono text-sm hover:bg-primary/90 transition-colors duration-300">
                Start with Brand Builder <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/get-started" className="inline-flex items-center gap-3 px-8 py-4 border border-border text-foreground rounded-full text-mono text-sm hover:border-primary hover:bg-primary/10 transition-all duration-300">Get Started</Link>
            </div>
            <p className="mt-8 text-sm text-muted-foreground">Inspired by our HQ Vision? Let us help you create a brand that&apos;s just as unforgettable.</p>
          </motion.div>
        </div>
      </section>

      <div className="fixed bottom-4 right-4 hidden lg:block z-50">
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg px-4 py-3 max-w-xs shadow-lg">
          <p className="text-xs text-muted-foreground"><strong className="text-foreground">Conceptual only</strong> – imagining the future of branding.</p>
        </div>
      </div>
    </BlueprintLayout>
  )
}
