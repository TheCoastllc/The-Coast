'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { CalendlyDialog } from './CalendlyDialog'

const HIDDEN_PREFIXES = ['/contact', '/admin', '/portal', '/login', '/payment-success', '/subscription-success']
const SHOW_AFTER_PX = 600

/**
 * Floating "Book a call" pill, fixed bottom-right.
 * - Shows after the user scrolls past the hero (~600px).
 * - Hides on pages where it would compete with an inline scheduler (e.g. /contact).
 * - Respects prefers-reduced-motion (no entrance animation).
 */
export function StickyBookButton() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)

  const isHidden = HIDDEN_PREFIXES.some((p) => pathname?.startsWith(p))

  useEffect(() => {
    if (isHidden) return
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHidden])

  if (isHidden) return null

  return (
    <>
      <button
        type="button"
        aria-label="Book a 30-minute discovery call"
        onClick={() => setOpen(true)}
        data-visible={visible}
        className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary px-5 py-3 text-xs font-mono uppercase tracking-wider text-black shadow-2xl shadow-black/40 transition-all duration-300 data-[visible=false]:pointer-events-none data-[visible=false]:translate-y-4 data-[visible=false]:opacity-0 data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100 hover:bg-primary/90 motion-reduce:transition-none"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        Book a call
      </button>
      <CalendlyDialog open={open} onClose={() => setOpen(false)} />
    </>
  )
}
