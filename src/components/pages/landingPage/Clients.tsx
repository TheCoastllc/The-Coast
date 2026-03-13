'use client'

import { motion } from 'motion/react'
import TextReveal from '@/components/TextReveal'

const clients = [
  'AMG Records', 'Zapped Co', 'OgaTicket', 'Coast Global', 'Brand Builders', 'Empire Studios', 'Vision Labs', 'Nova Creative'
]

export default function Clients() {
  return (
    <section className="py-32 bg-black overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-4 mb-8"
        >
          <span className="text-primary text-xs tracking-[0.3em] uppercase font-mono">06</span>
          <div className="w-12 h-px bg-white/20" />
          <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase">Partners</span>
        </motion.div>
        <TextReveal
          className="text-4xl md:text-5xl lg:text-6xl font-display uppercase tracking-tighter"
          highlight={["By"]}
        >
          Trusted By
        </TextReveal>
      </div>

      <div className="relative flex overflow-x-hidden max-w-6xl mx-auto px-6">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20,
          }}
        >
          {[...clients, ...clients].map((client, index) => (
            <div
              key={index}
              className="mx-12  text-2xl md:text-3xl font-display uppercase tracking-tighter text-white/10 hover:text-white/40 transition-colors duration-500 cursor-default"
            >
              {client}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
