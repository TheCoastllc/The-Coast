'use client'

import Link from 'next/link'
import { ButtonHTMLAttributes, type ReactNode } from 'react'
import { usePageTransition } from '@/components/PageTransition'

const sizeConfig: Record<string, { padding: string; fontSize: string }> = {
  sm: { padding: '10px 24px', fontSize: '12px' },
  md: { padding: '14px 36px', fontSize: '14px' },
}

interface ShineButtonProps {
  children?: ReactNode
  size?: 'sm' | 'md'
  variant?: 'default' | 'ghost'
  full?: boolean
  onClick?: () => void
  href?: string
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  className?: string
}

export function ShineButton({
  children = 'Get Started Now',
  size = 'md',
  variant = 'default',
  full = false,
  onClick,
  href,
  type,
  className = '',
}: ShineButtonProps) {
  const { navigateTo } = usePageTransition()
  const s = sizeConfig[size] || sizeConfig.md

  const sharedStyle: React.CSSProperties = {
    position: 'relative',
    display: full ? 'flex' : 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    padding: s.padding,
    fontSize: s.fontSize,
    fontFamily: "var(--font-space, 'Space Grotesk'), system-ui, sans-serif",
    fontWeight: 500,
    letterSpacing: '0.3px',
    textTransform: 'uppercase' as const,
    textDecoration: 'none',
    borderRadius: 0,
    cursor: 'none',
    outline: 'none',
    border: 'none',
    transition: 'opacity 0.15s ease, transform 0.15s ease',
    ...(full && { width: '100%' }),
    // variant-specific
    ...(variant === 'default'
      ? { background: 'var(--color-primary)', color: '#000000', overflow: 'hidden' }
      : { background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)' }),
  }

  // Plus-sign corner decorators for ghost variant (matches DecorIcon pattern)
  const corners = variant === 'ghost' ? (
    <>
      {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((pos) => {
        const style: React.CSSProperties = {
          position: 'absolute',
          width: 10,
          height: 10,
          pointerEvents: 'none',
          ...(pos.includes('top') ? { top: 0 } : { bottom: 0 }),
          ...(pos.includes('left') ? { left: 0 } : { right: 0 }),
          transform: `translate(${pos.includes('left') ? '-50%' : '50%'}, ${pos.includes('top') ? '-50%' : '50%'})`,
        }
        return (
          <svg key={pos} aria-hidden="true" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
            style={style}
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        )
      })}
    </>
  ) : null

  // Pure-CSS shine — group-hover drives the sweep so reversal is automatic
  const shine = variant === 'default' ? (
    <span
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none -translate-x-full group-hover:translate-x-[200%] transition-transform duration-[900ms] ease-in-out"
      style={{
        background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)',
      }}
    />
  ) : null

  function onMouseDown(e: React.MouseEvent<HTMLElement>) {
    e.currentTarget.style.transform = 'scale(0.96)'
  }

  function onMouseUp(e: React.MouseEvent<HTMLElement>) {
    e.currentTarget.style.transform = 'scale(1)'
  }

  const handlers = { onMouseDown, onMouseUp }

  const groupClass = `group ${className}`.trim()

  if (href) {
    return (
      <Link
        href={href}
        style={sharedStyle}
        className={groupClass}
        onClick={(e) => {
          if (!href.startsWith('http') && !href.startsWith('#')) {
            e.preventDefault()
            navigateTo(href)
          }
        }}
        {...handlers}
      >
        {corners}
        {shine}
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      style={sharedStyle}
      className={groupClass}
      onClick={onClick}
      {...handlers}
    >
      {corners}
      {shine}
      {children}
    </button>
  )
}
