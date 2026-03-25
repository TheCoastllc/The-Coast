'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

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
            <svg
              viewBox="0 0 364 280"
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 md:h-20 w-auto"
              aria-hidden="true"
            >
              <path d="M0 0 C0.72 0.12 1.43 0.23 2.17 0.36 C6.1 1.1 8.86 1.89 11.75 4.69 C12.2 6.96 12.2 6.96 12.14 9.57 C12.12 10.98 12.12 10.98 12.1 12.42 C12.05 13.88 12.05 13.88 12 15.38 C11.98 16.36 11.96 17.35 11.95 18.37 C11.9 20.81 11.83 23.25 11.75 25.69 C2.45 24.84 2.45 24.84 -0.75 24.14 C-19.58 20.7 -36.57 25.38 -52.25 35.69 C-55.74 38.2 -59.03 40.84 -62.25 43.69 C-62.86 44.2 -63.47 44.72 -64.1 45.25 C-78.66 58.52 -86.16 79.4 -87.24 98.62 C-87.72 114.11 -81.52 128.66 -71.54 140.38 C-58.21 153.84 -40.69 160.64 -21.88 161 C-5.81 161 9.63 155.53 22.53 145.93 C25.75 143.69 25.75 143.69 28.75 143.69 C28.92 147.75 29.03 151.81 29.13 155.88 C29.18 157.03 29.23 158.18 29.28 159.36 C29.42 167.65 29.42 167.65 27.58 170.5 C26.07 171.8 26.07 171.8 22.75 173.69 C21.86 174.24 20.98 174.78 20.07 175.35 C-2.42 186.8 -31.12 189.15 -55.24 181.41 C-76.76 173.68 -93.81 159 -103.94 138.5 C-114.92 112.49 -111.84 84.78 -101.54 59.17 C-100.78 57.34 -100.02 55.51 -99.25 53.69 C-108.97 61.14 -117.2 69.17 -124.86 78.73 C-127.48 81.97 -130.17 85.14 -132.88 88.31 C-136.54 92.62 -140.09 96.98 -143.53 101.46 C-147 105.95 -150.62 110.32 -154.25 114.69 C-154.68 115.21 -155.12 115.74 -155.57 116.29 C-166.84 129.93 -179.07 143.03 -193.25 153.69 C-194.03 154.28 -194.03 154.28 -194.82 154.88 C-221.06 174.74 -253.66 189.56 -287.25 186.69 C-289.64 186.13 -291.91 185.44 -294.25 184.69 C-295.21 180.69 -295.35 176.98 -295.31 172.88 C-295.3 171.71 -295.29 170.55 -295.29 169.36 C-295.27 168.48 -295.26 167.59 -295.25 166.69 C-294.57 166.63 -293.89 166.57 -293.2 166.51 C-259.34 163.41 -229.01 153.61 -203.25 130.69 C-202.49 130.04 -201.74 129.39 -200.96 128.73 C-189.67 118.87 -178.67 108.22 -169.42 96.43 C-166.78 93.1 -164.02 89.9 -161.25 86.69 C-157.69 82.56 -154.18 78.42 -150.75 74.19 C-137.55 57.99 -124.09 43.17 -107.25 30.69 C-106.41 30.05 -105.57 29.42 -104.71 28.77 C-75.47 7.41 -36.26 -6.03 0 0 Z" fill="#21A8A0" transform="translate(305.25,86.3125)"/>
              <path d="M0 0 C7.26 6.38 12.16 14.54 14.25 23.98 C15.08 37.7 14.44 48.96 5.23 59.91 C-0.87 66.3 -7.35 70.28 -15.75 72.98 C-16.35 73.17 -16.94 73.37 -17.56 73.57 C-30.36 75.99 -42.54 73.62 -53.43 66.63 C-62.74 60 -68.53 50.38 -70.5 39.05 C-71.9 27.29 -68.8 16.48 -61.75 6.98 C-46.27 -12.02 -19.43 -14.63 0 0 Z" fill="#F26E62" transform="translate(203.74609375,9.01953125)"/>
            </svg>
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