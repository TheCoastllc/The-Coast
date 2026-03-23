'use client'

import { useRef, useEffect } from 'react'

/**
 * LazyHeroVideo — lazy video loader for the homepage hero.
 *
 * Strategy:
 * - `preload="none"`: prevents browser from fetching the video on mount.
 * - `data-src`: the real video URL. No src = no network request on initial render.
 * - IntersectionObserver swaps data-src → src when section enters viewport,
 *   then calls video.load() + video.play() to begin playback.
 */
export function LazyHeroVideo({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const source = video.querySelector('source[data-src]') as HTMLSourceElement | null
          if (source && source.dataset.src) {
            source.src = source.dataset.src
            video.load()
            video.play().catch(() => {
              // Autoplay may be blocked — video stays on poster frame
            })
          }
          observer.disconnect()
        }
      },
      { threshold: 0.05 },
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="none"
      poster="/preview.jpg"
      className={className}
    >
      <source data-src="/coastVid.mp4" type="video/mp4" />
    </video>
  )
}
