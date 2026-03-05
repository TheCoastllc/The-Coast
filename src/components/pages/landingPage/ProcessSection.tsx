'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Lightbulb, Palette, Code, Rocket } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Discover',
    subtitle: 'Understanding Your Vision',
    description:
      "We dive deep into your brand's DNA: your story, audience, competitors, and aspirations. Through our intake process, we uncover what makes you unique.",
    icon: Lightbulb,
    color: 'hsl(var(--accent-teal))',
  },
  {
    number: '02',
    title: 'Design',
    subtitle: 'Crafting Your Identity',
    description:
      'From mood boards to final concepts, we create a visual language that captures your essence. Every color, typeface, and element is chosen with purpose.',
    icon: Palette,
    color: 'hsl(var(--accent-gold))',
  },
  {
    number: '03',
    title: 'Develop',
    subtitle: 'Building Your Presence',
    description:
      'We transform designs into real-world assets: websites, social templates, print materials, pitch decks. Everything your brand needs to show up powerfully.',
    icon: Code,
    color: 'hsl(var(--accent-teal))',
  },
  {
    number: '04',
    title: 'Launch',
    subtitle: 'Releasing Your Empire',
    description:
      'Your brand goes live. We ensure everything is pixel-perfect, provide brand guidelines, and set you up for sustained growth and recognition.',
    icon: Rocket,
    color: 'hsl(var(--accent-gold))',
  },
]

const ProcessSection = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%'])

  return (
    <section
      ref={containerRef}
      className="py-20 md:py-32 lg:py-48 relative overflow-hidden"
      style={{ backgroundColor: '#050505' }}
    >
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-24"
        >
          <span className="text-mono text-accent-cycle mb-3 block">Our Process</span>
          <h2 className="text-heading text-3xl md:text-5xl lg:text-6xl text-foreground mb-4">
            How We Build Empires
          </h2>
          <p className="text-body text-muted-foreground max-w-xl text-lg">
            A proven four-step process that transforms ideas into unforgettable brands.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Animated vertical line */}
          <div className="absolute left-[23px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-border hidden md:block">
            <motion.div className="w-full bg-primary" style={{ height: lineHeight }} />
          </div>

          <div className="space-y-12 md:space-y-24">
            {steps.map((step, i) => {
              const Icon = step.icon
              const isLeft = i % 2 === 0

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  className={`relative md:grid md:grid-cols-2 md:gap-16 items-center ${
                    isLeft ? '' : 'md:direction-rtl'
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`pl-14 md:pl-0 ${isLeft ? 'md:text-right md:pr-16' : 'md:col-start-2 md:pl-16'}`}
                    style={{ direction: 'ltr' }}
                  >
                    <span className="text-mono mb-2 block" style={{ color: step.color }}>
                      Step {step.number}
                    </span>
                    <h3 className="text-heading text-3xl md:text-5xl text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-body text-foreground/80 font-medium mb-3">{step.subtitle}</p>
                    <p className="text-body text-muted-foreground text-base leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Icon node */}
                  <div
                    className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 w-12 h-12 rounded-full border-2 flex items-center justify-center bg-background z-10 transition-colors duration-500"
                    style={{ borderColor: step.color }}
                  >
                    <Icon className="w-5 h-5" style={{ color: step.color }} />
                  </div>

                  {/* Empty space for alternating layout */}
                  {isLeft && <div className="hidden md:block" />}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProcessSection
