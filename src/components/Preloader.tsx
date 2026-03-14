'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Image from 'next/image'

export default function Preloader() {
  const [done, setDone] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const topPanelRef = useRef<HTMLDivElement>(null)
  const bottomPanelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (
      !containerRef.current ||
      !logoRef.current ||
      !counterRef.current ||
      !lineRef.current ||
      !topPanelRef.current ||
      !bottomPanelRef.current
    ) return

    document.body.style.overflow = 'hidden'

    const line = lineRef.current
    const counter = counterRef.current
    const topPanel = topPanelRef.current
    const bottomPanel = bottomPanelRef.current
    const counterObj = { value: 0 }

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = ''
          ; (window as any).__PRELOADER_DONE__ = true
        window.dispatchEvent(new Event('preloader-done'))
        setDone(true)
      },
    })

    // 1. Logo fades in
    tl.fromTo(
      logoRef.current,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
    )

    // 2. Line grows from center outward + counter fades in
    tl.fromTo(
      line,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.55, ease: 'power3.out', transformOrigin: 'center center' },
      '-=0.1'
    )
    tl.to(counter, { opacity: 1, duration: 0.3, ease: 'power2.out' }, '<')

    // 3. Counter ticks 0 → 100
    tl.to(counterObj, {
      value: 100,
      duration: 1.2,
      ease: 'power1.inOut',
      onUpdate: () => {
        counter.textContent = `${Math.round(counterObj.value)}`
      },
    }, '-=0.1')

    // 4. Hold at 100
    tl.to({}, { duration: 0.25 })

    // 5. Logo + counter fade out
    tl.to([logoRef.current, counter], {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
    })

    // 6. Line (which is the bottom edge of the top panel) stretches to full viewport width
    tl.to(line, {
      width: '100vw',
      duration: 0.55,
      ease: 'power3.inOut',
    }, '-=0.05')

    // 7. Brief hold — full-width line sits as the seam
    tl.to({}, { duration: 0.15 })

    // 8. The two panels split apart — the line goes with the top panel, it IS the seam
    tl.to(topPanel, {
      yPercent: -100,
      duration: 0.75,
      ease: 'power3.inOut',
    })
    tl.to(bottomPanel, {
      yPercent: 100,
      duration: 0.75,
      ease: 'power3.inOut',
    }, '<')

    return () => {
      tl.kill()
      document.body.style.overflow = ''
    }
  }, [])

  if (done) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
    >
      {/* TOP panel — covers top half, the line lives at its bottom edge */}
      <div
        ref={topPanelRef}
        className="absolute top-0 left-0 w-full flex flex-col items-center justify-end"
        style={{ height: '50%', backgroundColor: '#fafafa' }}
      >
        {/* Logo + counter sit inside the top panel, above the seam */}
        <div className="flex flex-col items-center gap-2 pb-0">
          <div ref={logoRef} style={{ opacity: 0 }}>
            <Image
              src="/preloaderlogo.svg"
              alt=""
              width={70}
              height={70}
              className="h-16 md:h-20 w-auto"
            />
          </div>
          <div
            ref={counterRef}
            style={{
              fontFamily: 'monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.18em',
              color: '#000000',
              opacity: 0,
            }}
          >
            0
          </div>
        </div>

        {/* THE LINE — the seam/bottom edge of the top panel */}
        <div
          ref={lineRef}
          style={{
            width: '70px',
            height: '2px',
            backgroundColor: '#000000',
            transform: 'scaleX(0)',
            transformOrigin: 'center center',
            flexShrink: 0,
          }}
        />
      </div>

      {/* BOTTOM panel — covers bottom half */}
      <div
        ref={bottomPanelRef}
        className="absolute bottom-0 left-0 w-full"
        style={{ height: '50%', backgroundColor: '#fafafa' }}
      />
    </div>
  )
}