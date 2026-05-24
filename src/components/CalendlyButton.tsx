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
}

/**
 * Drop-in replacement for any "Book a Call" ShineButton.
 * Opens an in-page Calendly modal instead of navigating away or to #contact.
 */
export function CalendlyButton({
  children = 'Book a 30-min call',
  size = 'md',
  variant = 'default',
  full = false,
  className = '',
}: CalendlyButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ShineButton
        size={size}
        variant={variant}
        full={full}
        className={className}
        onClick={() => setOpen(true)}
      >
        {children}
      </ShineButton>
      <CalendlyDialog open={open} onClose={() => setOpen(false)} />
    </>
  )
}
