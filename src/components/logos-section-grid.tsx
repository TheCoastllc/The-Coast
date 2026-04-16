'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'

export type TrustedBrand = {
  id: string
  name: string
  logoUrl?: string | null
  logoAlt?: string | null
  url?: string | null
}

const VISIBLE_COUNT = 8
const CYCLE_MS = 3000

function pickRandom(items: TrustedBrand[]): TrustedBrand[] {
  if (items.length <= VISIBLE_COUNT) return items.slice(0, VISIBLE_COUNT)
  const pool = [...items]
  const out: TrustedBrand[] = []
  for (let i = 0; i < VISIBLE_COUNT; i++) {
    const idx = Math.floor(Math.random() * pool.length)
    out.push(pool.splice(idx, 1)[0])
  }
  return out
}

export function LogosSectionGrid({ items }: { items: TrustedBrand[] }) {
  const [visible, setVisible] = useState<TrustedBrand[]>(() => items.slice(0, VISIBLE_COUNT))

  useEffect(() => {
    if (items.length > VISIBLE_COUNT) setVisible(pickRandom(items))
  }, [items])

  useEffect(() => {
    if (items.length <= VISIBLE_COUNT) return
    const interval = setInterval(() => {
      setVisible((current) => {
        const currentIds = new Set(current.map((b) => b.id))
        const offscreen = items.filter((b) => !currentIds.has(b.id))
        if (offscreen.length === 0) return current
        const slot = Math.floor(Math.random() * current.length)
        const incoming = offscreen[Math.floor(Math.random() * offscreen.length)]
        const next = [...current]
        next[slot] = incoming
        return next
      })
    }, CYCLE_MS)
    return () => clearInterval(interval)
  }, [items])

  return (
    <div className="grid grid-cols-2 border md:grid-cols-4">
      {visible.map((brand, i) => (
        <div
          key={i}
          className={cn(
            'relative flex h-28 items-center justify-center overflow-hidden bg-background px-4 md:h-32 md:p-8',
            i % 4 !== 3 && 'md:border-r',
            i % 2 === 0 && 'border-r md:border-r',
            i < VISIBLE_COUNT - 2 && 'border-b md:border-b',
            i < VISIBLE_COUNT - 4 && 'md:border-b',
            i >= VISIBLE_COUNT - 4 && 'md:border-b-0',
            (i === 0 || i === 2 || i === 5 || i === 7) && 'bg-secondary dark:bg-secondary/30',
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-full w-full items-center justify-center"
            >
              {brand.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={brand.logoUrl}
                  alt={brand.logoAlt || brand.name}
                  className="h-10 w-32 object-contain opacity-70 transition-all duration-300 md:h-12 md:w-40"
                />
              ) : (
                <span className="pointer-events-none select-none text-center font-display text-sm uppercase tracking-wider text-muted-foreground/60 transition-colors duration-300 hover:text-foreground md:text-base">
                  {brand.name}
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
