'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import TextReveal from '@/components/TextReveal'

function CountUp({ target, suffix, duration = 2 }: { target: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(target)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref)

  useEffect(() => {
    if (!inView) {
      setCount(0)
      return
    }
    const start = performance.now()
    let raf: number
    const step = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, target, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

function parseStat(value: string): { target: number; suffix: string } {
  const match = value.match(/^(\d+)(.*)$/)
  return match ? { target: parseInt(match[1]), suffix: match[2] } : { target: 0, suffix: value }
}

export function AnimatedLabel({ children }: { children: React.ReactNode }) {
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

export function AnimatedHeading({ text, highlight, className }: { text: string; highlight: string[]; className?: string }) {
  return (
    <TextReveal
      className={className}
      highlight={highlight}
      stagger={0.04}
    >
      {text}
    </TextReveal>
  )
}

export function AnimatedStat({ stat, index }: { stat: { label: string; value: string }; index: number }) {
  const { target, suffix } = parseStat(stat.value)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex flex-col gap-4"
    >
      <span className="text-primary text-5xl md:text-6xl font-display tracking-tighter">
        <CountUp target={target} suffix={suffix} duration={2} />
      </span>
      <span className="text-muted-foreground text-xs uppercase tracking-[0.2em] font-mono">{stat.label}</span>
    </motion.div>
  )
}
