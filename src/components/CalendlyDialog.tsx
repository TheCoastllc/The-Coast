'use client'

import { useEffect, useRef } from 'react'
import { buildCalendlyEmbedUrl } from '@/lib/calendly'

interface CalendlyDialogProps {
  open: boolean
  onClose: () => void
}

/**
 * Modal dialog containing the Calendly scheduler iframe.
 * Renders nothing until `open` becomes true (iframe never mounts otherwise).
 * Uses the native <dialog> element for focus trapping + ESC handling.
 */
export function CalendlyDialog({ open, onClose }: CalendlyDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  // Sync open state with native <dialog>
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open && !el.open) {
      el.showModal()
      document.body.style.overflow = 'hidden'
    } else if (!open && el.open) {
      el.close()
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // ESC / native dialog close → notify parent
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    const handler = () => onClose()
    el.addEventListener('close', handler)
    return () => el.removeEventListener('close', handler)
  }, [onClose])

  // Click on backdrop closes (native <dialog> renders backdrop via ::backdrop)
  function onBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      onClick={onBackdropClick}
      aria-label="Book a discovery call"
      className="m-0 h-full max-h-screen w-full max-w-screen border-0 bg-transparent p-0 backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      <div className="flex h-full w-full items-center justify-center p-4 sm:p-8">
        <div className="relative w-full max-w-3xl overflow-hidden rounded-lg border border-white/15 bg-black shadow-2xl">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close scheduler"
            className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white/80 backdrop-blur hover:border-primary/40 hover:text-white transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {open && (
            <iframe
              src={buildCalendlyEmbedUrl()}
              title="Book a 30-minute discovery call with The Coast Global"
              className="block h-[80vh] min-h-[600px] w-full"
              style={{ border: 0 }}
            />
          )}
        </div>
      </div>
    </dialog>
  )
}
