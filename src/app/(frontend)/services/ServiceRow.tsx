'use client'

import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { usePageTransition } from '@/components/PageTransition'

export function ServiceRow({
  service,
  index,
}: {
  service: { number: string; title: string; description: string }
  index: number
}) {
  const { navigateTo } = usePageTransition()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      viewport={{ once: true }}
      onClick={() => navigateTo('/get-started')}
      className="group relative border-b border-border cursor-pointer"
    >
      {/* Left primary bar indicator */}
      <div className="absolute left-0 top-0 h-full w-[2px] bg-primary origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

      <div className="flex items-center gap-4 md:gap-8 py-5 md:py-7 pl-5 md:pl-8 pr-4">
        {/* Number */}
        <span className="text-mono text-xs text-primary/40 w-8 shrink-0 tabular-nums">
          {service.number}
        </span>

        {/* Title */}
        <h3 className="text-heading text-xl md:text-3xl lg:text-4xl text-foreground flex-1 group-hover:translate-x-1 group-hover:text-primary transition-all duration-300">
          {service.title}
        </h3>

        {/* Description — hidden on mobile, shown md+ */}
        <p className="text-body text-muted-foreground text-sm hidden md:block md:w-64 lg:w-80 shrink-0">
          {service.description}
        </p>

        {/* Arrow — square to match design system */}
        <div className="shrink-0 w-9 h-9 md:w-10 md:h-10 border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300">
          <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300" />
        </div>
      </div>

      {/* Description — mobile only, below */}
      <p className="text-body text-muted-foreground text-xs pl-[52px] pr-14 pb-4 md:hidden leading-relaxed">
        {service.description}
      </p>
    </motion.div>
  )
}
