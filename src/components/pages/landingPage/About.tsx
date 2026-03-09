'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "start 0.2"]
  })

  const text = "We are a collective of designers, strategists, and creatives building unforgettable brands for entrepreneurs and growing businesses."
  const words = text.split(" ")

  return (
    <section ref={containerRef} className="py-32 md:py-48 bg-black border-t border-white/5" id="about">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-mono">02</span>
            <div className="w-12 h-[1px] bg-white/20" />
            <span className="text-white/40 text-xs tracking-[0.3em] uppercase">About Us</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display uppercase tracking-tighter max-w-4xl leading-tight">
            {words.map((word, i) => {
              const start = i / words.length
              const end = start + (1 / words.length)
              const wordOpacity = useTransform(scrollYProgress, [start, end], [0.2, 1])
              const isHighlight = word.includes("designers,") || word.includes("strategists,") || word.includes("creatives")
              return (
                <motion.span key={i} style={{ opacity: wordOpacity }} className={`mr-2 md:mr-3 inline-block ${isHighlight ? 'text-primary' : ''}`}>
                  {word}
                </motion.span>
              )
            })}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 border-t border-white/10 pt-16">
          {[
            { label: 'Projects Delivered', value: '50+' },
            { label: 'Brands Built', value: '30+' },
            { label: 'Client Satisfaction', value: '98%' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col gap-4"
            >
              <span className="text-primary text-5xl md:text-6xl font-display tracking-tighter">{stat.value}</span>
              <span className="text-white/40 text-xs uppercase tracking-[0.2em] font-mono">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
