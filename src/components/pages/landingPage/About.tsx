'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import TextReveal from '@/components/TextReveal'

function CountUp({ target, suffix, duration = 2 }: { target: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0)
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

export default function About() {
  return (
    <section className="py-32 md:py-48 bg-black" id="about">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-mono">02</span>
            <div className="w-12 h-px bg-white/20" />
            <span className="text-white/40 text-xs tracking-[0.3em] uppercase">About Us</span>
          </motion.div>
          <TextReveal
            className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-display uppercase tracking-tighter max-w-4xl leading-none"
            highlight={["designers", "strategists", "creatives"]}
            stagger={0.04}
          >
            We are a collective of designers, strategists, and creatives building unforgettable brands for entrepreneurs and growing businesses.
          </TextReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">
          {[
            { label: 'Projects Delivered', value: '50+' },
            { label: 'Brands Built', value: '30+' },
            { label: 'Client Satisfaction', value: '98%' },
          ].map((stat, i) => {
            const { target, suffix } = parseStat(stat.value)
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col gap-4"
              >
                <span className="text-primary text-5xl md:text-6xl font-display tracking-tighter">
                  <CountUp target={target} suffix={suffix} duration={2} />
                </span>
                <span className="text-white/40 text-xs uppercase tracking-[0.2em] font-mono">{stat.label}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
