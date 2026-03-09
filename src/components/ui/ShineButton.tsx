'use client'

import { ButtonHTMLAttributes, useEffect, useRef, useState, type ReactNode } from 'react'

interface SizeConfig {
  padding: string
  fontSize: string
  borderRadius: string
  wrapperRadius: string
  outerRadius: string
}

const sizeConfig: Record<string, SizeConfig> = {
  sm: { padding: '8px 20px', fontSize: '12px', borderRadius: '7px', wrapperRadius: '8px', outerRadius: '10px' },
  md: { padding: '14px 36px', fontSize: '16px', borderRadius: '9px', wrapperRadius: '10px', outerRadius: '12px' },
}

function conicGradient(angle: number, r: number, g: number, b: number): string {
  const c = (a: number) => `rgba(${r},${g},${b},${a})`
  return `conic-gradient(
    from ${angle}deg,
    ${c(0.3)} 0deg,
    ${c(0.3)} 30deg,
    ${c(0.7)} 60deg,
    ${c(0.9)} 90deg,
    ${c(0.3)} 120deg,
    ${c(0.3)} 210deg,
    ${c(0.7)} 240deg,
    ${c(0.9)} 270deg,
    ${c(0.3)} 300deg,
    ${c(0.3)} 360deg
  )`
}

interface ShineButtonProps {
  children?: ReactNode
  size?: 'sm' | 'md'
  onClick?: () => void
  href?: string
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  className?: string
}

export function ShineButton({
  children = 'Get Started Now',
  size = 'md',
  onClick,
  href,
  type,
  className = '',
}: ShineButtonProps) {
  const rafRef = useRef<number | null>(null)
  const currentAngle = useRef(225)
  const targetAngle = useRef(225)
  const [angle, setAngle] = useState(225)

  const s = sizeConfig[size] || sizeConfig.md
  const r = 201, g = 162, b = 75

  function animateAngle() {
    const diff = targetAngle.current - currentAngle.current
    currentAngle.current += diff * 0.08
    setAngle(currentAngle.current)
    if (Math.abs(diff) > 0.1) {
      rafRef.current = requestAnimationFrame(animateAngle)
    }
  }

  function handleMouseEnter() {
    targetAngle.current = 45
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(animateAngle)
  }

  function handleMouseLeave() {
    targetAngle.current = 225
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(animateAngle)
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    borderRadius: s.wrapperRadius,
    padding: '1px',
    margin: '2px',
    background: conicGradient(angle, r, g, b),
  }

  const innerStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    display: 'block',
    padding: s.padding,
    fontSize: s.fontSize,
    fontFamily: "var(--font-space, 'Space Grotesk'), system-ui, sans-serif",
    fontWeight: 500,
    color: '#ffffff',
    background: 'radial-gradient(ellipse at center, #1a1a1a 0%, #0a0a0a 100%)',
    border: 'none',
    borderRadius: s.borderRadius,
    cursor: 'none',
    letterSpacing: '0.3px',
    outline: 'none',
    transition: 'all 0.15s ease',
    textTransform: 'uppercase' as const,
    textDecoration: 'none',
  }

  const content = (
    <div
      style={{ display: 'inline-block', borderRadius: s.outerRadius }}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={wrapperStyle}>
        {href ? (
          <a
            href={href}
            style={innerStyle}
            onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.96)' }}
            onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
          >
            {children}
          </a>
        ) : (
          <button
            type={type}
            style={innerStyle}
            onClick={onClick}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.96)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            {children}
          </button>
        )}
      </div>
    </div>
  )

  return content
}
