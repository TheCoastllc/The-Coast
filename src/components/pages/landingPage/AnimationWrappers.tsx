'use client'

import React from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import TextReveal from '@/components/TextReveal'

/* ─── Generic fade-in wrapper ─── */
export function FadeIn({
  children,
  className,
  delay = 0,
  direction = 'up',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
}) {
  const initial = {
    opacity: 0,
    ...(direction === 'up' && { y: 20 }),
    ...(direction === 'left' && { x: -20 }),
    ...(direction === 'right' && { x: 20 }),
  }
  const animate = {
    opacity: 1,
    ...(direction === 'up' && { y: 0 }),
    ...(direction === 'left' && { x: 0 }),
    ...(direction === 'right' && { x: 0 }),
  }

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Section label with fade ─── */
export function AnimatedSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="flex items-center gap-4 mb-8"
    >
      {children}
    </motion.div>
  )
}

/* ─── Heading with word reveal ─── */
export function AnimatedSectionHeading({
  text,
  highlight,
  className,
  stagger,
  as,
}: {
  text: string
  highlight: string[]
  className?: string
  stagger?: number
  as?: 'h1' | 'h2' | 'h3'
}) {
  return (
    <TextReveal
      as={as}
      className={className}
      highlight={highlight}
      stagger={stagger}
    >
      {text}
    </TextReveal>
  )
}

/* ─── Staggered grid container ─── */
export function StaggerContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Marquee (infinite scroll) ─── */
export function Marquee({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="flex whitespace-nowrap"
      animate={{ x: ['0%', '-50%'] }}
      transition={{ repeat: Infinity, ease: 'linear', duration: 20 }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Scroll-linked timeline container ─── */
export function ScrollTimeline({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  })
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section className={className} ref={containerRef}>
      {children}
      {/* Expose scroll progress for the timeline line */}
      <style>{`[data-timeline-line] { height: var(--line-height, 0%); }`}</style>
      <ScrollTimelineLine progress={lineHeight} />
    </section>
  )
}

function ScrollTimelineLine({ progress }: { progress: any }) {
  return (
    <div className="hidden">
      <motion.div style={{ height: progress }} data-timeline-progress />
    </div>
  )
}

/* ─── Timeline node dot ─── */
export function TimelineNode() {
  return (
    <motion.div
      className="w-1.5 h-1.5 bg-primary rounded-full"
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, margin: '-200px' }}
      transition={{ duration: 0.4, delay: 0.2 }}
    />
  )
}

/* ─── Timeline card with slide animation ─── */
export function TimelineCard({
  children,
  className,
  direction = 'left',
}: {
  children: React.ReactNode
  className?: string
  direction?: 'left' | 'right'
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction === 'right' ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
