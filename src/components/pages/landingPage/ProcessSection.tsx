'use client'

import { motion } from 'motion/react'
import { Lightbulb, Palette, Code, Rocket } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Discover',
    subtitle: 'Understanding Your Vision',
    description:
      "We dive deep into your brand's DNA: story, audience, competitors, and aspirations.",
    icon: Lightbulb,
  },
  {
    number: '02',
    title: 'Design',
    subtitle: 'Crafting Your Identity',
    description:
      'From mood boards to final concepts, every color and typeface chosen with purpose.',
    icon: Palette,
  },
  {
    number: '03',
    title: 'Develop',
    subtitle: 'Building Your Presence',
    description:
      'Designs become real-world assets: websites, social templates, print materials.',
    icon: Code,
  },
  {
    number: '04',
    title: 'Launch',
    subtitle: 'Releasing Your Empire',
    description:
      'Your brand goes live. Pixel-perfect, with guidelines for sustained growth.',
    icon: Rocket,
  },
]

const ProcessSection = () => {
  return (
    <section
      className="py-20 md:py-32 lg:py-48 relative overflow-hidden"
      style={{ backgroundColor: '#050505' }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20"
        >
          <h2 className="text-heading text-3xl md:text-5xl lg:text-6xl text-foreground mb-4">
            How We Build Empires
          </h2>
          <div className="w-16 h-px" style={{ backgroundColor: '#C9A24B' }} />
        </motion.div>

        {/* Horizontal steps on desktop, vertical on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative">
          {/* Connecting line — desktop only */}
          <div
            className="hidden md:block absolute top-[28px] left-[calc(12.5%+14px)] right-[calc(12.5%+14px)] h-px"
            style={{ backgroundColor: 'rgba(201,162,75,0.2)' }}
          />

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Step number circle */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-full border flex items-center justify-center shrink-0"
                    style={{
                      borderColor: '#C9A24B',
                      backgroundColor: 'rgba(201,162,75,0.05)',
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: '#C9A24B' }} />
                  </div>
                  <span className="text-mono text-[#C9A24B]/50 text-xs md:hidden">
                    Step {step.number}
                  </span>
                </div>

                <span className="hidden md:block text-mono text-[#C9A24B]/50 text-xs mb-2">
                  Step {step.number}
                </span>
                <h3 className="text-heading text-2xl md:text-3xl text-foreground mb-1">
                  {step.title}
                </h3>
                <p className="text-body text-[#C9A24B] text-sm font-medium mb-2">
                  {step.subtitle}
                </p>
                <p className="text-body text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ProcessSection
