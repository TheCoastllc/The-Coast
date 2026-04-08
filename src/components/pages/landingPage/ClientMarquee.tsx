'use client'

import { motion } from 'motion/react'

export type MarqueeBrand = {
  name: string
  logoUrl?: string | null
  logoAlt?: string | null
}

export function ClientMarquee({ clients }: { clients: MarqueeBrand[] }) {
  return (
    <div className="relative flex overflow-hidden max-w-6xl mx-auto px-6">
      <motion.div
        className="flex whitespace-nowrap items-center"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 20,
        }}
      >
        {[...clients, ...clients].map((brand, index) => (
          <div
            key={index}
            className="mx-12 flex h-16 shrink-0 items-center justify-center md:h-20"
          >
            {brand.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brand.logoUrl}
                alt={brand.logoAlt || brand.name}
                className="h-12 w-40 object-contain opacity-40 brightness-0 invert transition-all duration-500 hover:opacity-80 md:h-16 md:w-56"
              />
            ) : (
              <span className="text-2xl md:text-3xl font-display uppercase tracking-tighter text-white/10 hover:text-white/40 transition-colors duration-500 cursor-default">
                {brand.name}
              </span>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
