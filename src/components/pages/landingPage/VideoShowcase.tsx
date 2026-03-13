'use client'

import { motion } from 'motion/react'
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog'

const YOUTUBE_ID = 'L4DsMKEY7W0'

const VideoShowcase = () => {
  return (
    <section className="py-20 md:py-32 relative" style={{ backgroundColor: '#070707' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <span className="text-mono text-[#C9A24B] text-xs tracking-widest">
            The Coast in Motion
          </span>
          <p className="text-body text-muted-foreground text-sm mt-2">
            Every brand we build tells a story worth watching.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <HeroVideoDialog
            videoSrc={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&mute=0&loop=1&playlist=${YOUTUBE_ID}&rel=0`}
            thumbnailSrc="/coastthumbnail.webp"
            thumbnailAlt="The Coast Brand Showreel"
            animationStyle="from-center"
            className="w-full"
          />
        </motion.div>
      </div>
    </section>
  )
}

export default VideoShowcase
