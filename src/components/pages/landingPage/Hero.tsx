'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowDownRight } from 'lucide-react'
import { useRef } from 'react'

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95])

  return (
    <section ref={ref} id="hero" className="relative h-screen min-h-[600px] flex flex-col justify-center bg-black overflow-hidden">
      <motion.div
        style={{ y, opacity, scale }}
        className="container mx-auto px-6 z-10"
      >
        <div className="max-w-7xl mx-auto mt-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 flex items-center gap-4"
          >
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-mono">
              Brand Design Studio
            </span>
          </motion.div>

          <h1 className="flex flex-col gap-0 mb-10">
            <div className="overflow-hidden">
              <motion.span
                initial={{ y: "100%", rotate: 2 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="block text-5xl md:text-7xl lg:text-[7rem] font-display uppercase tracking-tighter leading-[0.85] origin-bottom-left"
              >
                Design
              </motion.span>
            </div>
            <div className="overflow-hidden flex items-center gap-6">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="hidden md:block h-[2px] w-16 lg:w-24 bg-white/20 origin-left"
              />
              <motion.span
                initial={{ y: "100%", rotate: 2 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="block text-5xl md:text-7xl lg:text-[7rem] font-display uppercase tracking-tighter leading-[0.85] origin-bottom-left text-primary"
              >
                The
              </motion.span>
            </div>
            <div className="overflow-hidden">
              <motion.span
                initial={{ y: "100%", rotate: 2 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="block text-5xl md:text-7xl lg:text-[7rem] font-display uppercase tracking-tighter leading-[0.85] origin-bottom-left"
              >
                Future.
              </motion.span>
            </div>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="md:col-span-5 md:col-start-8 flex flex-col items-start"
            >
              <p className="text-sm md:text-base text-white/50 font-light mb-6 leading-relaxed">
                Strategic brand design for entrepreneurs, artists, and growing businesses. We turn visions into empires.
              </p>
              <a href="#work" className="group flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-white hover:text-primary transition-colors duration-300 hover-target">
                <span className="relative overflow-hidden pb-1">
                  Explore Work
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary transform scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left transition-transform duration-500 ease-out" />
                </span>
                <motion.div
                  className="p-3 border border-white/10 rounded-full group-hover:border-primary transition-colors duration-300"
                  whileHover={{ rotate: 45 }}
                >
                  <ArrowDownRight className="w-4 h-4" />
                </motion.div>
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-6 flex items-center gap-4"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">Scroll</span>
        <div className="w-16 h-[1px] bg-white/10 relative overflow-hidden">
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  )
}
