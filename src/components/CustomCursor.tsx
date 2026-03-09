'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const visibleRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth < 768) return

    const outer = outerRef.current
    const inner = innerRef.current
    const text = textRef.current
    if (!outer || !inner || !text) return

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

    // Hover detection for interactive elements
    const handleElementEnter = (e: Event) => {
      const target = e.target as HTMLElement
      const cursorType = target.closest('[data-cursor]')?.getAttribute('data-cursor')

      if (cursorType === 'view') {
        gsap.to(outer, { width: 80, height: 80, duration: 0.3, ease: 'power2.out' })
        gsap.to(text, { opacity: 1, duration: 0.2 })
        text.textContent = 'View'
      } else if (cursorType === 'text') {
        gsap.to(outer, { width: 4, height: 32, borderRadius: '2px', duration: 0.3 })
        gsap.to(inner, { scale: 0, duration: 0.2 })
      } else {
        gsap.to(outer, { scale: 1.5, duration: 0.3, ease: 'power2.out' })
        gsap.to(inner, { scale: 0.5, duration: 0.3, ease: 'power2.out' })
      }
    }

    const handleElementLeave = () => {
      gsap.to(outer, {
        width: 40,
        height: 40,
        scale: 1,
        borderRadius: '50%',
        duration: 0.3,
        ease: 'power2.out',
      })
      gsap.to(inner, { scale: 1, duration: 0.3, ease: 'power2.out' })
      gsap.to(text, { opacity: 0, duration: 0.2 })
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    // Delegate hover events for interactive elements
    const interactiveSelector = 'a, button, [role="button"], [data-cursor]'
    const boundElements = new WeakSet<Element>()

    const bindElement = (el: Element) => {
      if (boundElements.has(el)) return
      el.addEventListener('mouseenter', handleElementEnter)
      el.addEventListener('mouseleave', handleElementLeave)
      boundElements.add(el)
    }

    const observer = new MutationObserver(() => {
      document.querySelectorAll(interactiveSelector).forEach(bindElement)
    })

    // Initial bind
    document.querySelectorAll(interactiveSelector).forEach(bindElement)

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      {/* Outer ring */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] hidden md:flex items-center justify-center"
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

      {/* Inner dot */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] hidden md:block"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#C9A24B',
          transform: 'translate(-50%, -50%)',
          opacity: 0,
        }}
      />
    </>
  )
}
