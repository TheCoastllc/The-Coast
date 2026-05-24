'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * Studio cursor — appears ONLY when hovering interactive elements.
 *
 * W9 refactor:
 * - Native cursor remains the default everywhere (per user direction).
 * - This custom cursor fades in only when the mouse enters an element that
 *   matches the hover-target selector: a, button, [role="button"],
 *   [data-cursor], .hover-target.
 * - The cursor morphs per the closest [data-cursor="view|text"] hint, or
 *   defaults to a link/button treatment.
 * - Hidden entirely on touch + viewports < 768px.
 */

const HOVER_SELECTOR = 'a, button, [role="button"], [data-cursor], .hover-target'

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const plusRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const visibleRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth < 768) return
    // Respect coarse pointers (touch screens) — no custom cursor on iPad with mouse + keyboard either
    if (window.matchMedia?.('(pointer: coarse)').matches) return

    const outer = outerRef.current
    const inner = innerRef.current
    const dot = dotRef.current
    const plus = plusRef.current
    const text = textRef.current
    if (!outer || !inner || !dot || !plus || !text) return

    // Position trackers — always update, even when invisible, so the cursor
    // is in the right spot the instant it fades in.
    const handleMouseMove = (e: MouseEvent) => {
      gsap.to(inner, { x: e.clientX, y: e.clientY, duration: 0.08, ease: 'power2.out' })
      gsap.to(outer, { x: e.clientX, y: e.clientY, duration: 0.22, ease: 'power2.out' })
    }

    const showCursor = () => {
      if (visibleRef.current) return
      visibleRef.current = true
      gsap.to([outer, inner], { opacity: 1, duration: 0.22, ease: 'power2.out' })
    }

    const hideCursor = () => {
      if (!visibleRef.current) return
      visibleRef.current = false
      gsap.to([outer, inner], { opacity: 0, duration: 0.18, ease: 'power2.out' })
      resetCursor()
    }

    const resetCursor = () => {
      gsap.to(outer, {
        width: 40, height: 40, scale: 1, borderRadius: '50%',
        duration: 0.22, ease: 'power2.out',
      })
      gsap.to(dot, { opacity: 1, scale: 1, duration: 0.22, ease: 'power2.out' })
      gsap.to(plus, { opacity: 0, scale: 0, duration: 0.18 })
      gsap.to(text, { opacity: 0, duration: 0.18 })
    }

    // Apply per-target morph + ensure visibility
    const applyHoverState = (interactive: Element) => {
      const cursorType = interactive.closest('[data-cursor]')?.getAttribute('data-cursor')
      if (cursorType === 'view') {
        gsap.to(outer, { width: 80, height: 80, borderRadius: '50%', duration: 0.22, ease: 'power2.out' })
        gsap.to(text, { opacity: 1, duration: 0.18 })
        text.textContent = 'View'
        gsap.to(dot, { scale: 0, duration: 0.18 })
        gsap.to(plus, { opacity: 0, scale: 0, duration: 0.18 })
      } else if (cursorType === 'text') {
        gsap.to(outer, { width: 4, height: 32, borderRadius: '2px', duration: 0.22, ease: 'power2.out' })
        gsap.to(dot, { scale: 0, duration: 0.18 })
        gsap.to(plus, { opacity: 0, scale: 0, duration: 0.18 })
      } else if (interactive.closest('a')) {
        gsap.to(outer, { scale: 1.5, duration: 0.22, ease: 'power2.out' })
        gsap.to(dot, { opacity: 0, scale: 0, duration: 0.18 })
        gsap.to(plus, { opacity: 1, scale: 1, duration: 0.18 })
      } else {
        gsap.to(outer, { scale: 1.5, duration: 0.22, ease: 'power2.out' })
        gsap.to(dot, { scale: 0.5, duration: 0.22, ease: 'power2.out' })
        gsap.to(plus, { opacity: 0, scale: 0, duration: 0.18 })
      }
    }

    let currentHoverTarget: Element | null = null

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactive = target.closest(HOVER_SELECTOR)
      if (!interactive || interactive === currentHoverTarget) return
      currentHoverTarget = interactive
      showCursor()
      applyHoverState(interactive)
    }

    const handleMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null
      // Still inside the same hover target's subtree — ignore
      if (related && currentHoverTarget?.contains(related)) return
      // Crossed into another hover target — let mouseover handle it
      if (related && related.closest?.(HOVER_SELECTOR)) {
        currentHoverTarget = null
        return
      }
      currentHoverTarget = null
      hideCursor()
    }

    // Hide when mouse leaves the document entirely
    const handleDocLeave = () => hideCursor()

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
    document.addEventListener('mouseleave', handleDocLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      document.removeEventListener('mouseleave', handleDocLeave)
    }
  }, [])

  return (
    <>
      {/* Outer ring — morphs per interactive target */}
      <div
        ref={outerRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:flex items-center justify-center"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid oklch(0.72 0.12 75 / 0.5)',
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

      {/* Inner dot + plus icon */}
      <div
        ref={innerRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:flex items-center justify-center"
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
          style={{ backgroundColor: 'oklch(0.72 0.12 75)' }}
        />
        <div
          ref={plusRef}
          className="absolute inset-0 flex items-center justify-center opacity-0 scale-0"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 2.5V9.5M2.5 6H9.5" stroke="oklch(0.72 0.12 75)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </>
  )
}
