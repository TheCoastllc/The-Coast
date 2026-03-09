'use client'

import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ShineButton } from '@/components/ui/ShineButton'

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const orb1Ref = useRef<HTMLDivElement>(null)
  const orb2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          y: -120,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }

      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          y: -80,
          x: 40,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const marqueeText = 'Design The Future \u2022 We Turn Visions Into Empires \u2022 Branding That Makes You Unforgettable \u2022 '

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden noise-bg"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(201,162,75,0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(201,162,75,0.3) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Parallax gold orbs */}
      <div
        ref={orb1Ref}
        className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[180px]"
        style={{ background: 'radial-gradient(circle, rgba(201,162,75,0.12) 0%, transparent 70%)' }}
      />
      <div
        ref={orb2Ref}
        className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full blur-[150px]"
        style={{ background: 'radial-gradient(circle, rgba(201,162,75,0.08) 0%, transparent 70%)' }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pt-32 md:pt-40">
        <div className="flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 2.4 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-12 h-px" style={{ backgroundColor: '#C9A24B' }} />
            <span className="text-mono text-muted-foreground">Brand Design Studio</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.6 }}
            className="text-body text-lg md:text-xl mb-6"
            style={{ color: '#C9A24B' }}
          >
            We turn visions into empires.
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.8 }}
            className="text-display text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] leading-none mb-8"
          >
            <span className="block text-foreground">Design</span>
            <span className="block text-outline">The</span>
            <span className="block gradient-text">Future</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 3.0 }}
            className="text-body text-muted-foreground max-w-xl text-lg md:text-xl mb-10"
          >
            Strategic brand design for entrepreneurs, artists, and growing businesses.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 3.2 }}
            className="flex flex-col gap-4 sm:flex-row sm:gap-6"
          >
            <ShineButton href="/brand-builder">
              Build Your Brand
            </ShineButton>
            <a
              href="#portfolio"
              data-cursor="pointer"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-flex items-center justify-center px-8 py-4 border text-foreground text-mono font-medium rounded-lg transition-all duration-300 hover:border-[#C9A24B] hover:text-[#C9A24B]"
              style={{ borderColor: 'rgba(255,255,255,0.15)' }}
            >
              View Our Work
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 3.6 }}
        className="absolute bottom-24 left-6 md:left-12 flex items-center gap-4"
      >
        <span className="w-10 h-10 rounded-full border border-[#C9A24B]/30 flex items-center justify-center">
          <svg className="w-4 h-4 text-[#C9A24B] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </span>
        <span className="text-mono text-muted-foreground hidden md:block">Scroll to explore</span>
      </motion.div>

      {/* Marquee */}
      <div
        className="absolute bottom-0 left-0 right-0 py-4 overflow-hidden"
        style={{ borderTop: '1px solid rgba(201,162,75,0.08)' }}
      >
        <div className="animate-marquee whitespace-nowrap flex">
          <span className="text-mono text-[#C9A24B]/20 text-xs mx-4">
            {marqueeText.repeat(6)}
          </span>
          <span className="text-mono text-[#C9A24B]/20 text-xs mx-4">
            {marqueeText.repeat(6)}
          </span>
        </div>
      </div>
    </section>
  )
}

export default Hero
