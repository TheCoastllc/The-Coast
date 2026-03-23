'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Image from 'next/image'

const TEXT = 'Design the Future'

export default function Preloader() {
  const [done, setDone] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([])
  const lineRef = useRef<HTMLDivElement>(null)
  const topPanelRef = useRef<HTMLDivElement>(null)
  const bottomPanelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (
      !containerRef.current ||
      !logoRef.current ||
      !lineRef.current ||
      !topPanelRef.current ||
      !bottomPanelRef.current
    ) return

    document.body.style.overflow = 'hidden'

    const line = lineRef.current
    const topPanel = topPanelRef.current
    const bottomPanel = bottomPanelRef.current
    const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[]

    // Shuffle for random scatter order
    const shuffled = [...letters].sort(() => Math.random() - 0.5)

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = ''
          ; (window as any).__PRELOADER_DONE__ = true
        window.dispatchEvent(new Event('preloader-done'))
        setDone(true)
      },
    })

    // 1. Logo fades + slides in
    tl.fromTo(
      logoRef.current,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
    )

    // 2. Letters scatter in randomly
    tl.fromTo(
      shuffled,
      {
        opacity: 0,
        y: () => gsap.utils.random(-18, 18),
        x: () => gsap.utils.random(-8, 8),
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration: 0.5,
        ease: 'power3.out',
        stagger: { each: 0.045, from: 'random' },
      },
      '-=0.1'
    )

    // 3. Line appears as underline beneath the text
    tl.fromTo(
      line,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.55, ease: 'power3.out', transformOrigin: 'center center' },
      '-=0.05'
    )

    // 4. Hold — everything reads for a moment
    tl.to({}, { duration: 0.6 })

    // 5. Logo + letters fade out
    tl.to([logoRef.current, ...letters], {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
    })

    // 6. Line stretches to full viewport width
    tl.to(line, {
      width: '100vw',
      duration: 0.55,
      ease: 'power3.inOut',
    }, '-=0.05')

    // 7. Brief hold — line sits as the seam
    tl.to({}, { duration: 0.15 })

    // 8. Panels split — line travels with top panel as the seam
    tl.to(topPanel, { yPercent: -100, duration: 0.75, ease: 'power3.inOut' })
    tl.to(bottomPanel, { yPercent: 100, duration: 0.75, ease: 'power3.inOut' }, '<')

    return () => {
      tl.kill()
      document.body.style.overflow = ''
    }
  }, [])

  if (done) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-9999 pointer-events-none overflow-hidden"
    >
      {/* TOP panel — line is pinned to its bottom edge */}
      <div
        ref={topPanelRef}
        className="absolute top-0 left-0 w-full flex flex-col items-center justify-end"
        style={{ height: '51%', backgroundColor: '#E7E3D8' }}
      >
        <div className="flex flex-col items-center gap-1 pb-0">
          {/* Logo */}
          <div ref={logoRef} style={{ opacity: 0 }}>
            <Image
              src="/preloaderlogo.svg"
              alt=""
              width={70}
              height={70}
              className="h-16 md:h-20 w-auto"
            />
          </div>

          {/* Text */}
          <div
            className="flex items-center font-sans tracking-widest uppercase text-xs"
            style={{ color: '#000000', gap: '0.04em' }}
            aria-label={TEXT}
          >
            {TEXT.split('').map((char, i) => (
              <span
                key={i}
                ref={el => { lettersRef.current[i] = el }}
                style={{ opacity: 0, display: 'inline-block', whiteSpace: 'pre', position: 'relative', zIndex: 1000 }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* THE LINE — underline that becomes the seam */}
        <div
          ref={lineRef}
          style={{
            width: '160px',
            height: '2px',
            position: 'relative',
            zIndex: 1000,
            backgroundColor: '#000000',
            transform: 'scaleX(0)',
            transformOrigin: 'center center',
            flexShrink: 0,
            marginTop: '6px',
          }}
        />
      </div>

      {/* BOTTOM panel */}
      <div
        ref={bottomPanelRef}
        className="absolute bottom-0 left-0 w-full"
        style={{ height: '50%', backgroundColor: '#E7E3D8' }}
      />
    </div>
  )
}