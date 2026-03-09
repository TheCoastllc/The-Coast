'use client'

import { easeIn, motion } from 'motion/react'
import { PenTool, Monitor, Zap, Globe } from 'lucide-react'
import TextReveal from '@/components/TextReveal'

const services = [
  {
    icon: PenTool,
    title: 'Brand Identity',
    description:
      'Custom branding & logo design — your visual identity, refined and unforgettable. From mood boards to comprehensive brand guidelines, we engineer identities that demand attention.',
    className: 'md:col-span-2 md:row-span-1',
  },
  {
    icon: Monitor,
    title: 'Digital Experience',
    description:
      'Websites, apps, and digital products designed for impact, usability, and conversion. We blend cutting-edge technology with uncompromising aesthetics.',
    className: 'md:col-span-1 md:row-span-2',
  },
  {
    icon: Zap,
    title: 'Creative Strategy',
    description:
      'Data-driven insights combined with bold creativity to position your brand as a market leader.',
    className: 'md:col-span-1 md:row-span-1',
  },
  {
    icon: Globe,
    title: 'Marketing Assets',
    description:
      'Flyers, social graphics, pitch decks, and digital assets that convert — campaigns that capture attention and drive measurable results.',
    className: 'md:col-span-1 md:row-span-1',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
}

// CLOCKWISE ENTRY ANIMATION
const getVariants = (index: number) => {
  const directions = [
    { x: 0, y: -40 }, // from top
    { x: 40, y: 0 },  // from right
    { x: 0, y: 40 },  // from bottom
    { x: -40, y: 0 }, // from left
  ]

  const dir = directions[index % directions.length]

  return {
    hidden: {
      opacity: 0,
      x: dir.x,
      y: dir.y,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.7,
        ease: easeIn,
      },
    },
  }
}

export default function Services() {
  return (
    <section
      className="py-24 bg-black relative border-t border-white/5"
      id="services"
    >
      <div className="container mx-auto px-6">

        {/* Header */}

        <div className="mb-16">

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-mono">
              03
            </span>

            <div className="w-12 h-px bg-white/20" />

            <span className="text-white/40 text-xs tracking-[0.3em] uppercase">
              Capabilities
            </span>
          </motion.div>

          <TextReveal
            className="text-4xl md:text-5xl lg:text-6xl font-display uppercase tracking-tighter"
            highlight={["Do"]}
          >
            What We Do
          </TextReveal>

        </div>

        {/* Grid */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 md:auto-rows-[minmax(220px,auto)] gap-4"
        >

          {services.map((service, index) => {

            const Icon = service.icon

            return (
              <motion.div
                key={index}
                variants={getVariants(index)}
                className={`group relative p-6 md:p-8 bg-black border border-white/10 hover:border-white/20 transition-all duration-500 flex flex-col ${service.className}`}
              >

                <div>

                  <div className="mb-6 text-white/20 group-hover:text-primary transition-colors duration-500">
                    <Icon className="w-8 h-8" strokeWidth={1} />
                  </div>

                  <h3 className="text-xl md:text-2xl font-display uppercase tracking-tight mb-3 text-white/80 group-hover:text-white transition-colors duration-300">
                    {service.title}
                  </h3>

                  <p className="text-white/40 leading-relaxed font-light text-sm md:text-base group-hover:text-white/60 transition-colors duration-300 max-w-md">
                    {service.description}
                  </p>

                </div>

                {/* Explore button */}

                <div className="mt-auto pt-10 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/20 group-hover:text-primary transition-colors duration-300">

                  <span>Explore</span>

                  <motion.div
                    animate={{ x: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.6 }}
                  >
                    →
                  </motion.div>

                </div>

              </motion.div>
            )
          })}

        </motion.div>
      </div>
    </section>
  )
}