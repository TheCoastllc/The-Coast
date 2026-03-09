'use client'

import { motion } from 'motion/react'

const clients = [
  'AMG Records', 'Zapped Co', 'OgaTicket', 'Coast Global', 'Brand Builders', 'Empire Studios', 'Vision Labs', 'Nova Creative'
]

export default function Clients() {
  return (
    <section className="py-32 bg-black border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-4 mb-8"
        >
          <span className="text-primary text-xs tracking-[0.3em] uppercase font-mono">06</span>
          <div className="w-12 h-px bg-white/20" />
          <span className="text-white/40 text-xs tracking-[0.3em] uppercase">Partners</span>
        </motion.div>
        <div className="overflow-hidden pb-4">
          <motion.h2
            initial={{ y: "100%", rotate: 2 }}
            whileInView={{ y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-display uppercase tracking-tighter origin-bottom-left"
          >
            Trusted <span className="text-primary">By</span>
          </motion.h2>
        </div>
      </div>

      <div className="relative flex overflow-x-hidden">
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
              className="mx-12 text-2xl md:text-3xl font-display uppercase tracking-tighter text-white/10 hover:text-white/40 transition-colors duration-500 cursor-default"
            >
              {client}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
