'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

export function ProcessTimeline({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  })
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section className="py-32 bg-black" ref={containerRef}>
      {children}
      {/* Vertical Line with scroll progress */}
      <div
        className="absolute left-[23px] md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2"
        style={{ position: 'absolute' }}
      >
        <motion.div style={{ height: lineHeight }} className="w-full bg-primary origin-top" />
      </div>
    </section>
  )
}

export function ProcessTimelineContainer({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  })
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div className="relative max-w-4xl mx-auto" ref={containerRef}>
      {/* Vertical Line */}
      <div className="absolute left-[23px] md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2">
        <motion.div style={{ height: lineHeight }} className="w-full bg-primary origin-top" />
      </div>
      {children}
    </div>
  )
}

export function ProcessNode() {
  return (
    <div className="absolute left-[23px] md:left-1/2 top-0 -translate-x-1/2 w-3 h-3 bg-black border border-white/20 rounded-full z-10 flex items-center justify-center">
      <motion.div
        className="w-1.5 h-1.5 bg-primary rounded-full"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '-200px' }}
        transition={{ duration: 0.4, delay: 0.2 }}
      />
    </div>
  )
}

export function ProcessCard({
  children,
  className,
  slideFrom,
}: {
  children: React.ReactNode
  className?: string
  slideFrom: 'left' | 'right'
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: slideFrom === 'right' ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
