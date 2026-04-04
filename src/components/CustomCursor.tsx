'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const plusRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const visibleRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth < 768) return

    const outer = outerRef.current
    const inner = innerRef.current
    const dot = dotRef.current
    const plus = plusRef.current
    const text = textRef.current
    if (!outer || !inner || !dot || !plus || !text) return

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }

      if (!visibleRef.current) {
        visibleRef.current = true
        gsap.to([outer, inner], { opacity: 1, duration: 0.3 })
      }

      gsap.to(inner, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      })

      gsap.to(outer, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    const handleMouseLeave = () => {
      visibleRef.current = false
      gsap.to([outer, inner], { opacity: 0, duration: 0.3 })
    }

    const handleMouseEnter = () => {
      visibleRef.current = true
      gsap.to([outer, inner], { opacity: 1, duration: 0.3 })
    }

    // Reset cursor to default state
    const resetCursor = () => {
      gsap.to(outer, {
        width: 40,
        height: 40,
        scale: 1,
        borderRadius: '50%',
        duration: 0.3,
        ease: 'power2.out',
      })
      gsap.to(dot, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' })
      gsap.to(plus, { opacity: 0, scale: 0, duration: 0.2 })
      gsap.to(text, { opacity: 0, duration: 0.2 })
    }

    // Event delegation for hover effects — no MutationObserver needed
    let currentHoverTarget: Element | null = null

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactive = target.closest('a, button, [role="button"], [data-cursor]')

      if (interactive === currentHoverTarget) return
      if (!interactive && currentHoverTarget) {
        currentHoverTarget = null
        resetCursor()
        return
      }
      if (!interactive) return

      currentHoverTarget = interactive
      const cursorType = interactive.closest('[data-cursor]')?.getAttribute('data-cursor')

      if (cursorType === 'view') {
        gsap.to(outer, { width: 80, height: 80, duration: 0.3, ease: 'power2.out' })
        gsap.to(text, { opacity: 1, duration: 0.2 })
        text.textContent = 'View'
      } else if (cursorType === 'text') {
        gsap.to(outer, { width: 4, height: 32, borderRadius: '2px', duration: 0.3 })
        gsap.to(dot, { scale: 0, duration: 0.2 })
      } else if (interactive.closest('a')) {
        gsap.to(outer, { scale: 1.5, duration: 0.3, ease: 'power2.out' })
        gsap.to(dot, { opacity: 0, scale: 0, duration: 0.2 })
        gsap.to(plus, { opacity: 1, scale: 1, duration: 0.2 })
      } else {
        gsap.to(outer, { scale: 1.5, duration: 0.3, ease: 'power2.out' })
        gsap.to(dot, { scale: 0.5, duration: 0.3, ease: 'power2.out' })
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null
      if (related && currentHoverTarget?.contains(related)) return
      if (currentHoverTarget) {
        currentHoverTarget = null
        resetCursor()
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [])

  return (
    <>
      {/* Outer ring */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 pointer-events-none z-9999 hidden md:flex items-center justify-center"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(201, 162, 75, 0.5)',
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          mixBlendMode: 'difference',
        }}
      >
        <span
          ref={textRef}
          className="text-[10px] font-medium uppercase tracking-wider text-white"
          style={{ opacity: 0 }}
        />
      </div>

      {/* Inner dot & Plus container */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 pointer-events-none z-9999 hidden md:flex items-center justify-center"
        style={{
          width: 8,
          height: 8,
          transform: 'translate(-50%, -50%)',
          opacity: 0,
        }}
      >
        <div
          ref={dotRef}
          className="w-full h-full rounded-full"
          style={{ backgroundColor: '#C9A24B' }}
        />
        <div
          ref={plusRef}
          className="absolute inset-0 flex items-center justify-center opacity-0 scale-0"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 2.5V9.5M2.5 6H9.5"
              stroke="#C9A24B"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </>
  )
}
