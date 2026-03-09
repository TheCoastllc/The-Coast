"use client"

import { useState } from "react"
import { Play, XIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import { cn } from "@/lib/utils"

type AnimationStyle =
  | "from-bottom"
  | "from-center"
  | "from-top"
  | "from-left"
  | "from-right"
  | "fade"
  | "top-in-bottom-out"
  | "left-in-right-out"

interface HeroVideoProps {
  animationStyle?: AnimationStyle
  videoSrc: string
  thumbnailSrc: string
  thumbnailAlt?: string
  className?: string
}

const animationVariants = {
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "from-center": {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "top-in-bottom-out": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "left-in-right-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
}

export function HeroVideoDialog({
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  className,
}: HeroVideoProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const selectedAnimation = animationVariants[animationStyle]

  return (
    <div className={cn("relative w-full h-[300px]", className)}>

      {/* THUMBNAIL */}

      <button
        type="button"
        aria-label="Play video"
        onClick={() => setIsVideoOpen(true)}
        className="group relative w-full aspect-4/3 max-h-[400px] overflow-hidden rounded-xl cursor-pointer"
      >
        <Image
          src={thumbnailSrc}
          alt={thumbnailAlt}
          fill
          className="object-cover transition-all duration-300 group-hover:brightness-75"
        />

        {/* Play Button */}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-primary/10 flex size-28 items-center justify-center rounded-full backdrop-blur-md">
            <div className="from-primary/30 to-primary flex size-20 items-center justify-center rounded-full bg-gradient-to-b shadow-md transition-transform duration-300 group-hover:scale-110">
              <Play
                className="size-8 fill-white text-white"
                style={{
                  filter:
                    "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))",
                }}
              />
            </div>
          </div>
        </div>

      </button>

      {/* VIDEO MODAL */}

      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVideoOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <motion.div
              {...selectedAnimation}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative mx-4 aspect-video w-full max-w-4xl"
            >

              {/* Close Button */}

              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute -top-14 right-0 rounded-full bg-black/60 p-2 text-white backdrop-blur-md"
              >
                <XIcon className="size-5" />
              </button>

              {/* Video */}

              <div className="relative w-full h-full overflow-hidden rounded-xl border border-white/20">
                <iframe
                  src={videoSrc}
                  title="Hero Video player"
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}