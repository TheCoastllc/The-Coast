'use client'

import { motion } from 'motion/react'

export type MarqueeBrand = {
  name: string
  logoUrl?: string | null
  logoAlt?: string | null
}

export function ClientMarquee({ clients }: { clients: MarqueeBrand[] }) {
  if (clients.length === 0) return null

  // Duplicate list so the -50% translate creates a seamless loop.
  const track = [...clients, ...clients]

  return (
    <div
      className="relative max-w-6xl mx-auto w-full overflow-hidden"
      style={{
        maskImage:
          'linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)',
      }}
    >
      <motion.div
        className="flex w-max items-center"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 40,
        }}
      >
        {track.map((brand, index) => (
          <div
            key={index}
            className="mx-8 md:mx-12 flex h-16 md:h-20 shrink-0 items-center justify-center"
            aria-hidden={index >= clients.length ? true : undefined}
          >
            {brand.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brand.logoUrl}
                alt={brand.logoAlt || brand.name}
                className="h-12 w-40 md:h-16 md:w-56 object-contain opacity-40 hover:opacity-80 transition-opacity duration-500"
                loading="lazy"
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
