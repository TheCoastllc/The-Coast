'use client'

import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import { PenTool, Monitor, Zap, Globe, ArrowRight } from 'lucide-react'
import TextReveal from '@/components/TextReveal'
import BentoGrid1 from '@/components/mvpblocks/bento-grid-1'

interface ServiceItemProps {
  title: string
  description: string
  icon: React.ReactNode
  className?: string
}

const ServiceItem = ({
  title,
  description,
  icon,
  className,
}: ServiceItemProps) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, damping: 25 },
    },
  }

  return (
    <motion.div
      variants={variants}
      className={cn(
        'group relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-black px-6 pt-6 pb-10 shadow-md transition-all duration-500 hover:border-white/20',
        className,
      )}
    >
      {/* Grid pattern overlay */}
      <div className="absolute top-0 -right-1/2 z-0 size-full bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:24px_24px]" />

      {/* Large ghost icon */}
      <div className="absolute right-1 bottom-3 scale-[6] text-white/[0.03] transition-all duration-700 group-hover:scale-[6.2] group-hover:text-white/[0.06]">
        {icon}
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary shadow shadow-primary/10 transition-all duration-500 group-hover:bg-primary/20 group-hover:shadow-primary/20">
            {icon}
          </div>
          <h3 className="mb-3 text-xl md:text-2xl font-display uppercase tracking-tight text-white/80 group-hover:text-white transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm md:text-base text-white/40 leading-relaxed font-light group-hover:text-white/60 transition-colors duration-300 max-w-md">
            {description}
          </p>
        </div>
        <div className="mt-4 flex items-center text-xs uppercase tracking-[0.2em] text-white/20 group-hover:text-primary transition-colors duration-300">
          <span className="mr-1">Explore</span>
          <ArrowRight className="size-4 transition-all duration-500 group-hover:translate-x-2" />
        </div>
      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-primary/30 blur-2xl transition-all duration-500 group-hover:blur-lg" />
    </motion.div>
  )
}

const services = [
  {
    title: 'Brand Identity',
    description:
      'Custom branding & logo design — your visual identity, refined and unforgettable. From mood boards to comprehensive brand guidelines, we engineer identities that demand attention.',
    icon: <PenTool className="size-6" strokeWidth={1.5} />,
    size: 'large' as const,
  },
  {
    title: 'Digital Experience',
    description:
      'Websites, apps, and digital products designed for impact, usability, and conversion. We blend cutting-edge technology with uncompromising aesthetics.',
    icon: <Monitor className="size-6" strokeWidth={1.5} />,
    size: 'small' as const,
  },
  {
    title: 'Creative Strategy',
    description:
      'Data-driven insights combined with bold creativity to position your brand as a market leader.',
    icon: <Zap className="size-6" strokeWidth={1.5} />,
    size: 'medium' as const,
  },
  {
    title: 'Marketing Assets',
    description:
      'Flyers, social graphics, pitch decks, and digital assets that convert — campaigns that capture attention and drive measurable results.',
    icon: <Globe className="size-6" strokeWidth={1.5} />,
    size: 'medium' as const,
  },
]

export default function Services() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  }

  return (
    <section
      className="py-24 bg-black relative"
      id="services"
    >
      <div className="max-w-6xl mx-auto px-6">
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
            highlight={['Do']}
          >
            What We Do
          </TextReveal>
        </div>

        {/* Bento Grid */}
        <motion.div
          // className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* {services.map((service, i) => (
            <ServiceItem
              key={i}
              title={service.title}
              description={service.description}
              icon={service.icon}
              className={cn(
                service.size === 'large'
                  ? 'sm:col-span-2 md:col-span-4'
                  : service.size === 'medium'
                    ? 'sm:col-span-1 md:col-span-3'
                    : 'sm:col-span-2 md:col-span-2',
                'h-full',
              )}
            />
          ))} */}
          <BentoGrid1 />
        </motion.div>
      </div>
    </section>
  )
}
