'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect, useMemo } from 'react'
import SciFiDashboardClock from '@/components/hero/clocks/SciFiDashboardClock'

// ─── Style 1: Orbital / Planetary ───
const OrbitalClock = () => {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const s = time.getSeconds()
  const m = time.getMinutes()
  const h = time.getHours() % 12
  const size = 64
  const cx = size / 2
  const cy = size / 2

  const dot = (angle: number, radius: number, r: number, color: string, glow: string) => {
    const rad = ((angle - 90) * Math.PI) / 180
    return (
      <circle
        cx={cx + radius * Math.cos(rad)}
        cy={cy + radius * Math.sin(rad)}
        r={r}
        fill={color}
        style={{ filter: `drop-shadow(0 0 ${glow})` }}
      />
    )
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={28} fill="none" stroke="hsl(var(--border))" strokeWidth={0.5} />
        <circle cx={cx} cy={cy} r={21} fill="none" stroke="hsl(var(--border))" strokeWidth={0.5} />
        <circle cx={cx} cy={cy} r={14} fill="none" stroke="hsl(var(--border))" strokeWidth={0.5} />
        <circle cx={cx} cy={cy} r={2} fill="hsl(var(--primary))" />
        {dot(s * 6, 28, 2.5, 'hsl(var(--accent-teal))', '3px hsl(var(--accent-teal))')}
        {dot(m * 6 + s * 0.1, 21, 3, 'hsl(var(--primary))', '4px hsl(var(--primary))')}
        {dot(h * 30 + m * 0.5, 14, 3.5, 'hsl(var(--foreground))', '3px hsl(var(--foreground))')}
        <circle
          cx={cx} cy={cy} r={28}
          fill="none"
          stroke="hsl(var(--accent-teal))"
          strokeWidth={1}
          strokeDasharray={`${(s / 60) * 175.9} 175.9`}
          strokeLinecap="round"
          opacity={0.3}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>
    </div>
  )
}

// ─── Style 2: Flip Clock ───
const FlipDigit = ({ value }: { value: string }) => (
  <div className="relative w-7 h-10 md:w-9 md:h-12 overflow-hidden rounded bg-card border border-border">
    <AnimatePresence mode="popLayout">
      <motion.div
        key={value}
        initial={{ y: -40, rotateX: -90 }}
        animate={{ y: 0, rotateX: 0 }}
        exit={{ y: 40, rotateX: 90 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="absolute inset-0 flex items-center justify-center text-foreground font-mono text-lg md:text-xl font-bold"
        style={{ perspective: 100 }}
      >
        {value}
      </motion.div>
    </AnimatePresence>
    <div className="absolute left-0 right-0 top-1/2 h-px bg-border/50 z-10" />
  </div>
)

const FlipClock = () => {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const h = time.getHours().toString().padStart(2, '0')
  const m = time.getMinutes().toString().padStart(2, '0')
  const s = time.getSeconds().toString().padStart(2, '0')

  return (
    <div className="inline-flex items-center gap-1">
      <FlipDigit value={h[0]} />
      <FlipDigit value={h[1]} />
      <span className="text-primary font-bold mx-0.5">:</span>
      <FlipDigit value={m[0]} />
      <FlipDigit value={m[1]} />
      <span className="text-primary font-bold mx-0.5">:</span>
      <FlipDigit value={s[0]} />
      <FlipDigit value={s[1]} />
    </div>
  )
}

// ─── Style 3: Minimal Arc ───
const ArcClock = () => {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const s = time.getSeconds() / 60
  const m = time.getMinutes() / 60
  const h = (time.getHours() % 12) / 12
  const size = 120
  const cx = size / 2
  const cy = size / 2

  const arc = (progress: number, radius: number, color: string, width: number) => {
    const circumference = 2 * Math.PI * radius
    return (
      <circle
        cx={cx} cy={cy} r={radius}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeDasharray={`${progress * circumference} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: progress === 0 ? 'none' : 'stroke-dasharray 0.3s ease' }}
      />
    )
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={52} fill="none" stroke="hsl(var(--border))" strokeWidth={3} />
        <circle cx={cx} cy={cy} r={42} fill="none" stroke="hsl(var(--border))" strokeWidth={3} />
        <circle cx={cx} cy={cy} r={32} fill="none" stroke="hsl(var(--border))" strokeWidth={3} />
        {arc(s, 52, 'hsl(var(--accent-teal))', 3)}
        {arc(m, 42, 'hsl(var(--primary))', 3.5)}
        {arc(h, 32, 'hsl(var(--foreground))', 4)}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-mono text-muted-foreground tabular-nums">
          {time.getHours().toString().padStart(2, '0')}:{time.getMinutes().toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

// ─── Style 4: Glitch / Digital ───
const GlitchClock = () => {
  const [time, setTime] = useState(new Date())
  const [scramble, setScramble] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setScramble(true)
      setTimeout(() => {
        setTime(new Date())
        setScramble(false)
      }, 100)
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const h = time.getHours().toString().padStart(2, '0')
  const m = time.getMinutes().toString().padStart(2, '0')
  const s = time.getSeconds().toString().padStart(2, '0')

  const scrambled = useMemo(() => {
    if (!scramble) return `${h}:${m}:${s}`
    const chars = '0123456789:█▓░'
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  }, [scramble, h, m, s])

  return (
    <div className="relative font-mono">
      <span
        className="text-foreground tracking-[0.2em] tabular-nums"
        style={{ textShadow: scramble ? '0 0 8px hsl(var(--accent-teal)), 2px 0 hsl(var(--destructive))' : '0 0 6px hsl(var(--primary))' }}
      >
        {scrambled}
      </span>
      {scramble && (
        <span
          className="absolute inset-0 text-primary/30 tracking-[0.2em]"
          style={{ transform: 'translateX(1px)', clipPath: 'inset(30% 0 30% 0)' }}
        >
          {scrambled}
        </span>
      )}
    </div>
  )
}

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
          }}
        />
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[150px] -translate-y-1/4 translate-x-1/4" />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[150px] translate-y-1/4 -translate-x-1/4"
        style={{ backgroundColor: 'rgba(77, 77, 255, 0.12)' }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pt-20 md:pt-32">
        <div className="flex flex-col items-start">
          {/* Tagline with line */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-12 h-px bg-primary" />
            <span className="text-mono text-muted-foreground">Brand Builders</span>
          </motion.div>

          {/* Slogan */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-body text-lg md:text-xl italic mb-4 text-accent-cycle"
          >
            We turn visions into empires.
          </motion.p>

          {/* Giant headline with clock */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-display text-5xl sm:text-6xl md:text-7xl lg:text-[10rem] xl:text-[12rem] leading-[0.9] mb-6 md:mb-8"
          >
            <span className="block">Design</span>
            <span className="block text-outline">The</span>
            <span className="flex items-end gap-2 md:gap-8 flex-wrap">
              <span>Future</span>
              <span className="scale-[0.5] sm:scale-[0.6] md:scale-100 origin-bottom-left -mb-1 md:mb-0" style={{ marginRight: '-20px' }}>
                <SciFiDashboardClock />
              </span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-body text-muted-foreground max-w-xl text-lg md:text-xl mb-10"
          >
            Branding that makes you unforgettable.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col gap-3 sm:flex-row sm:gap-4 w-full sm:w-auto"
          >
            <a
              href="/brand-builder"
              title="Build Your Brand with The Coast"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background text-mono font-medium rounded-lg hover:bg-foreground/90 transition-all duration-300 hover:scale-[1.02]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
                <path d="M5 19l1 3 3-1-1-3-3 1z" />
                <path d="M19 19l-1 3-3-1 1-3 3 1z" />
              </svg>
              Build Your Brand
            </a>
            <a
              href="/get-started"
              title="Start Your Brand Design Project"
              className="inline-flex items-center justify-center px-8 py-4 border border-foreground/30 text-foreground text-mono font-medium rounded-lg hover:border-foreground hover:bg-foreground/5 transition-all duration-300"
            >
              Get Started
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-8 left-6 md:left-12 flex items-center gap-4"
      >
        <div className="relative flex items-center justify-center">
          <span className="absolute w-10 h-10 rounded-full border border-primary/50 animate-ping opacity-30" />
          <span className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
            <svg className="w-4 h-4 text-muted-foreground animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </span>
        </div>
        <span className="text-mono text-muted-foreground hidden md:block">Scroll to explore</span>
      </motion.div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
    </section>
  )
}

export default Hero
