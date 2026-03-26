'use client'

import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'

type Offer = {
  number: string
  title: string
  tagline: string
  description: string
  href: string
  cta: string
  stats: { label: string; value: string }[]
}

export function OfferCard({ offer, index }: { offer: Offer; index: number }) {
  return (
    <motion.a
      href={offer.href}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative block border border-border p-8 md:p-10 overflow-hidden hover:border-primary/30 transition-colors duration-300"
    >
      {/* Top accent bar on hover */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

      {/* Number */}
      <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary/60 block mb-4">
        {offer.number}
      </span>

      <h3 className="text-heading text-2xl md:text-3xl text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
        {offer.title}
      </h3>

      <p className="text-sm italic text-primary/80 mb-4">
        {offer.tagline}
      </p>

      <p className="text-body text-muted-foreground text-sm leading-relaxed mb-6">
        {offer.description}
      </p>

      {/* Stats row */}
      <div className="flex gap-6 mb-8 border-t border-border pt-4">
        {offer.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-0.5">
            <span className="text-heading text-lg text-foreground">{stat.value}</span>
            <span className="text-mono text-[9px] text-muted-foreground/60 uppercase tracking-wider">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <span className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all duration-300">
        {offer.cta}
        <ArrowRight className="w-4 h-4" />
      </span>
    </motion.a>
  )
}
