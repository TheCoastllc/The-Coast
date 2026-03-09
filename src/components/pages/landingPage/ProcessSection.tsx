'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import TextReveal from '@/components/TextReveal'

const steps = [
  {
    num: '01',
    title: 'Discover',
    desc: "We dive deep into your brand's DNA: story, audience, competitors, and aspirations. Understanding your vision is where empires begin.",
  },
  {
    num: '02',
    title: 'Design',
    desc: 'From mood boards to final concepts — every color, typeface, and element chosen with purpose. Crafting your identity with precision.',
  },
  {
    num: '03',
    title: 'Develop',
    desc: 'Designs become real-world assets: websites, social templates, print materials. Pixel-perfect and built for impact.',
  },
  {
    num: '04',
    title: 'Launch',
    desc: 'Your brand goes live. Pixel-perfect, with guidelines for sustained growth. Your empire, released into the world.',
  },
]

export default function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <section className="py-32 bg-black border-t border-white/5" ref={containerRef}>
      <div className="container mx-auto px-6">
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-mono">04</span>
            <div className="w-12 h-px bg-white/20" />
            <span className="text-white/40 text-xs tracking-[0.3em] uppercase">Methodology</span>
          </motion.div>
          <TextReveal
            className="text-4xl md:text-5xl lg:text-6xl font-display uppercase tracking-tighter"
            highlight={["Empires"]}
          >
            How We Build Empires
          </TextReveal>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-[23px] md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-primary origin-top"
            />
          </div>

          <div className="flex flex-col gap-24">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0
              return (
                <div key={index} className={`relative flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row-reverse' : ''} gap-8 md:gap-16`}>

                  {/* Timeline Node */}
                  <div className="absolute left-[23px] md:left-1/2 top-0 -translate-x-1/2 w-3 h-3 bg-black border border-white/20 rounded-full z-10 flex items-center justify-center">
                    <motion.div
                      className="w-1.5 h-1.5 bg-primary rounded-full"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, margin: "-200px" }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    />
                  </div>

                  {/* Empty space for alternating layout on desktop */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Content Card */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="md:w-1/2 pl-16 md:pl-0 group hover-target"
                  >
                    <div className="p-8 bg-black border border-white/5 hover:border-white/20 transition-colors duration-500">
                      <div className="text-primary/50 font-mono text-sm mb-6 group-hover:text-primary transition-colors duration-500">
                        {step.num}
                      </div>
                      <h3 className="text-2xl font-display uppercase tracking-tight mb-4 text-white/80 group-hover:text-white transition-colors duration-500">
                        {step.title}
                      </h3>
                      <p className="text-white/40 text-sm font-light leading-relaxed group-hover:text-white/60 transition-colors duration-500">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
