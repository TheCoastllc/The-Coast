'use client'

import { motion, useInView } from 'motion/react'
import { useRef, useState, useEffect } from 'react'

const stats = [
  { value: 50, suffix: '+', label: 'Projects Delivered' },
  { value: 30, suffix: '+', label: 'Brands Built' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
  { value: 3, suffix: '+', label: 'Years of Craft' },
]

// Ease-out cubic for a satisfying deceleration
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

const AnimatedNumber = ({
  target,
  suffix,
  inView,
}: {
  target: number
  suffix: string
  inView: boolean
}) => {
  const [count, setCount] = useState(0)
  const animatingRef = useRef(false)

  useEffect(() => {
    if (inView && !animatingRef.current) {
      animatingRef.current = true
      setCount(0)

      const duration = 2000
      const startTime = performance.now()

      const tick = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        setCount(Math.round(easeOutCubic(progress) * target))

        if (progress < 1) {
          requestAnimationFrame(tick)
        } else {
          animatingRef.current = false
        }
      }

      requestAnimationFrame(tick)
    } else if (!inView) {
      setCount(0)
      animatingRef.current = false
    }
  }, [inView, target])

  return (
    <span className="text-display text-5xl md:text-7xl lg:text-8xl tabular-nums" style={{ color: '#C9A24B' }}>
      {count}
      {suffix}
    </span>
  )
}

const StatsCounter = () => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-40px' })

  return (
    <section
      ref={ref}
      className="py-20 md:py-32 relative border-t border-b border-border overflow-hidden"
    >
      {/* Subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <AnimatedNumber target={stat.value} suffix={stat.suffix} inView={inView} />
              <p className="text-mono text-muted-foreground mt-3">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsCounter
