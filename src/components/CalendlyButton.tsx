'use client'

import { useState, type ReactNode } from 'react'
import { ShineButton } from './ui/ShineButton'
import { CalendlyDialog } from './CalendlyDialog'

interface CalendlyButtonProps {
  children?: ReactNode
  size?: 'sm' | 'md'
  variant?: 'default' | 'ghost'
  full?: boolean
  className?: string
  /** Pre-load the scheduler on hover/focus (default true). Pass false for
   *  buttons in dense lists where hover intent is weak. */
  warmOnHover?: boolean
}

/**
 * Drop-in replacement for any "Book a Call" ShineButton.
 * Opens an in-page Calendly modal instead of navigating away or to #contact.
 * Hovering or focusing the button mounts the scheduler iframe in the (closed)
 * dialog, so by the time the user clicks it is already loaded.
 */
export function CalendlyButton({
  children = 'Book a quick call',
  size = 'md',
  variant = 'default',
  full = false,
  className = '',
  warmOnHover = true,
}: CalendlyButtonProps) {
  const [open, setOpen] = useState(false)
  const [warm, setWarm] = useState(false)
  const warmUp = warmOnHover ? () => setWarm(true) : undefined

  return (
    <>
      {/* display:contents wrapper: no box of its own, but bubbling pointer /
          focus events from the button still reach it */}
      <span style={{ display: 'contents' }} onPointerOver={warmUp} onFocus={warmUp}>
        <ShineButton
          size={size}
          variant={variant}
          full={full}
          className={className}
          onClick={() => setOpen(true)}
        >
          {children}
        </ShineButton>
      </span>
      <CalendlyDialog open={open} warm={warm} onClose={() => setOpen(false)} />
    </>
  )
}
