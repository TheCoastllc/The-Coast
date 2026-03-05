'use client'

import { motion } from 'motion/react'
import { useIsMobile } from '@/hooks/use-mobile'

const YOUTUBE_ID = 'L4DsMKEY7W0'

const VideoShowcase = () => {
  const isMobile = useIsMobile()

  return (
    <>
      <section className="relative w-full overflow-hidden bg-background aspect-[9/16] sm:aspect-video md:h-screen md:aspect-auto">
        {/* YouTube Background Video */}
        <div className="absolute inset-0 z-0">
          <iframe
            src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_ID}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&fs=0&iv_load_policy=3&enablejsapi=1&vq=hd1080&hd=1`}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none ${
              isMobile ? 'w-[400%] h-[100%]' : 'w-[200%] h-[200%] sm:w-[180%] sm:h-[180%] md:w-[200%] md:h-[200%]'
            }`}
            style={{ border: 'none' }}
            allow="autoplay; encrypted-media"
            title="The Coast Brand Showreel"
            loading="lazy"
          />
        </div>

        {/* Background grid pattern */}
        <div className="absolute inset-0 z-[1] opacity-[0.06] pointer-events-none">
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
        <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/15 rounded-full blur-[100px] md:blur-[150px] -translate-y-1/4 translate-x-1/4 z-[2] pointer-events-none" />
        <div
          className="absolute bottom-0 left-0 w-[250px] md:w-[500px] h-[250px] md:h-[500px] rounded-full blur-[100px] md:blur-[150px] translate-y-1/4 -translate-x-1/4 z-[2] pointer-events-none"
          style={{ backgroundColor: 'rgba(77, 77, 255, 0.12)' }}
        />

        {/* Edge fades */}
        <div className="absolute top-0 left-0 right-0 h-24 md:h-40 bg-gradient-to-b from-background via-background/60 to-transparent z-[3] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-24 md:h-40 bg-gradient-to-t from-background via-background/60 to-transparent z-[3] pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-0 w-16 md:w-64 bg-gradient-to-r from-background via-background/50 to-transparent z-[3] pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 md:w-64 bg-gradient-to-l from-background via-background/50 to-transparent z-[3] pointer-events-none" />
      </section>

      {/* Caption below video */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-background py-6 text-center border-b border-border"
      >
        <span className="text-mono text-primary text-xs tracking-widest uppercase">
          The Coast in Motion
        </span>
        <p className="text-body text-muted-foreground text-sm mt-1">
          Every brand we build tells a story worth watching.
        </p>
      </motion.div>
    </>
  )
}

export default VideoShowcase
