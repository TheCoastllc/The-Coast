'use client'

import { motion } from 'motion/react'

export default function Manifesto() {
  return (
    <section className="py-32 bg-black border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 flex items-center gap-4"
          >
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-mono">01</span>
            <div className="w-12 h-[1px] bg-white/20" />
            <span className="text-white/40 text-xs tracking-[0.3em] uppercase">Manifesto</span>
          </motion.div>

          <div className="overflow-hidden pb-4">
            <motion.p
              initial={{ y: "100%", rotate: 2 }}
              whileInView={{ y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl lg:text-4xl font-display uppercase leading-[1.1] tracking-tighter text-white/20 origin-bottom-left"
            >
              Most small businesses don&apos;t fail because they lack <span className="text-white">talent</span> or <span className="text-white">hustle</span>. They fail because they&apos;re <span className="text-primary">invisible</span>. We changed that.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}
