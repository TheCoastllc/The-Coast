'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export default function Preloader() {
  const [done, setDone] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !logoRef.current || !dotRef.current || !overlayRef.current) return

    document.body.style.overflow = 'hidden'

    const dot = dotRef.current
    const overlay = overlayRef.current

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = ''
        setDone(true)
      },
    })

    // 1. Logo fades + scales in
    tl.fromTo(
      logoRef.current,
      { scale: 0.7, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' }
    )

    // 2. Fullstop dot rolls in from right
    tl.fromTo(
      dot,
      { x: 80, opacity: 0, rotation: 0 },
      { x: 0, opacity: 1, rotation: 360, duration: 0.6, ease: 'power2.out' },
      '-=0.2'
    )

    // 3. Brief hold
    tl.to({}, { duration: 0.3 })

    // 4. Calculate dot center position and expand clip-path from it
    tl.add(() => {
      const dotRect = dot.getBoundingClientRect()
      const dotCenterX = dotRect.left + dotRect.width / 2
      const dotCenterY = dotRect.top + dotRect.height / 2
      const vw = window.innerWidth
      const vh = window.innerHeight
      const xPercent = (dotCenterX / vw) * 100
      const yPercent = (dotCenterY / vh) * 100

      overlay.style.clipPath = `circle(0% at ${xPercent}% ${yPercent}%)`

      gsap.to(overlay, {
        clipPath: `circle(150% at ${xPercent}% ${yPercent}%)`,
        duration: 0.8,
        ease: 'power3.inOut',
      })
    })

    // 5. Slide the white container up (after clip-path finishes)
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 0.6,
      ease: 'power3.inOut',
    }, '+=0.8')

    return () => {
      tl.kill()
      document.body.style.overflow = ''
    }
  }, [])

  if (done) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-9999 flex items-center justify-center"
      style={{ backgroundColor: '#fafafa' }}
    >
      {/* Dark overlay that expands from dot */}
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{
          backgroundColor: '#0a0a0a',
          clipPath: 'circle(0% at 50% 50%)',
        }}
      />

      {/* Logo + dot container */}
      <div className="relative z-10 flex items-end gap-1">
        <img
          ref={logoRef}
          src="/preloaderlogo.svg"
          alt=""
          className="h-16 md:h-20 w-auto"
          style={{ opacity: 0 }}
        />
        <div
          ref={dotRef}
          className="w-3 h-3 md:w-4 md:h-4 rounded-sm mb-1"
          style={{ backgroundColor: '#000000', opacity: 0 }}
        />
      </div>
    </div>
  )
}
