'use client'

import { motion } from 'motion/react'
import { PenTool, Monitor, Zap, Globe } from 'lucide-react'

const services = [
  {
    icon: PenTool,
    title: 'Brand Identity',
    description: 'Custom branding & logo design — your visual identity, refined and unforgettable. From mood boards to comprehensive brand guidelines, we engineer identities that demand attention.',
    className: 'md:col-span-2 md:row-span-1',
  },
  {
    icon: Monitor,
    title: 'Digital Experience',
    description: 'Websites, apps, and digital products designed for impact, usability, and conversion. We blend cutting-edge technology with uncompromising aesthetics.',
    className: 'md:col-span-1 md:row-span-2',
  },
  {
    icon: Zap,
    title: 'Creative Strategy',
    description: 'Data-driven insights combined with bold creativity to position your brand as a market leader.',
    className: 'md:col-span-1 md:row-span-1',
  },
  {
    icon: Globe,
    title: 'Marketing Assets',
    description: 'Flyers, social graphics, pitch decks, and digital assets that convert — campaigns that capture attention and drive measurable results.',
    className: 'md:col-span-1 md:row-span-1',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export default function Services() {
  return (
    <section className="py-32 bg-black relative border-t border-white/5" id="services">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-mono">03</span>
            <div className="w-12 h-px bg-white/20" />
            <span className="text-white/40 text-xs tracking-[0.3em] uppercase">Capabilities</span>
          </motion.div>
          <div className="overflow-hidden pb-4">
            <motion.h2
              initial={{ y: "100%", rotate: 2 }}
              whileInView={{ y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-display uppercase tracking-tighter origin-bottom-left"
            >
              What We <span className="text-primary">Do</span>
            </motion.h2>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:h-[70vh] md:max-h-[800px] md:min-h-[600px]"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`group relative p-8 md:p-12 bg-black border border-white/10 hover:border-white/20 transition-all duration-500 hover-target flex flex-col justify-between ${service.className}`}
            >
              <div>
                <div className="mb-8 text-white/20 group-hover:text-primary transition-colors duration-500">
                  <service.icon className="w-8 h-8" strokeWidth={1} />
                </div>

                <h3 className="text-2xl md:text-3xl font-display uppercase tracking-tight mb-4 text-white/80 group-hover:text-white transition-colors duration-300">
                  {service.title}
                </h3>

                <p className="text-white/40 leading-relaxed font-light text-sm md:text-base group-hover:text-white/60 transition-colors duration-300 max-w-md">
                  {service.description}
                </p>
              </div>

              <div className="mt-12 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/20 group-hover:text-primary transition-colors duration-300">
                <span>Explore</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
