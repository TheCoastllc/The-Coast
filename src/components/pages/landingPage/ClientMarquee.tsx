'use client'

import { motion } from 'motion/react'

export function ClientMarquee({ clients }: { clients: string[] }) {
  return (
    <div className="relative flex overflow-hidden max-w-6xl mx-auto px-6">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
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
  )
}
