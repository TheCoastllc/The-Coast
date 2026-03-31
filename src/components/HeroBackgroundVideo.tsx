'use client'

import { useRef, useEffect } from 'react'
import Hls from 'hls.js'

const HLS_SRC = 'https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8'

/**
 * HeroBackgroundVideo — full-bleed HLS background video for the hero section.
 *
 * - Autoplaying, looped, muted
 * - Shifted 200px right, scaled 1.2× from left origin
 * - Falls back to native HLS on Safari
 */
export function HeroBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let hls: Hls | null = null

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
      })
      hls.loadSource(HLS_SRC)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {
          // Autoplay may be blocked
        })
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = HLS_SRC
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => { })
      })
    }

    return () => {
      if (hls) {
        hls.destroy()
      }
    }
  }, [])

  return (
    <>
      {/* Background video layer */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none cursor-none inset-0 z-0 overflow-hidden"
      >
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          className="h-full object-cover"
          style={{
            // marginLeft: '200px',
            transform: 'scale(1.2)',
            transformOrigin: 'left center',
            width: 'calc(100% - 200px)',
          }}
        />
      </div>

      {/* Bottom fade gradient */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 z-10 h-40"
        style={{
          background: 'linear-gradient(to top, #070612, transparent)',
        }}
      />
    </>
  )
}
