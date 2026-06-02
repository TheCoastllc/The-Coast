'use client'

import Link from 'next/link'

type Variant = 'lab' | 'editorial' | 'interactive'

const OPTIONS: { key: Variant; label: string }[] = [
  { key: 'lab', label: 'Lab' },
  { key: 'editorial', label: 'Editorial' },
  { key: 'interactive', label: 'Interactive' },
]

/**
 * Small dev/preview chip pinned bottom-left. Lets you flip the /offers page
 * between its three design directions without typing URLs. Active option is
 * highlighted gold. Low z so it never sits over modals/cursor chrome.
 */
export function OffersSwitcher({ current }: { current: Variant }) {
  return (
    <div
      aria-label="Offers layout preview switcher"
      style={{
        position: 'fixed',
        bottom: '1rem',
        left: '1rem',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        padding: '5px',
        borderRadius: 999,
        background: 'rgba(8, 16, 28, 0.82)',
        border: '1px solid var(--color-border)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 8px 28px rgba(0,0,0,0.45)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5rem',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: 'var(--color-steel)',
          padding: '0 0.55rem 0 0.45rem',
        }}
      >
        Layout
      </span>
      {OPTIONS.map((o) => {
        const active = o.key === current
        return (
          <Link
            key={o.key}
            href={`/offers?offers=${o.key}`}
            scroll={false}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '0.4rem 0.7rem',
              borderRadius: 999,
              transition: 'color 0.25s var(--ease-out), background 0.25s var(--ease-out)',
              color: active ? 'var(--color-gold)' : 'var(--color-white-dim)',
              background: active ? 'rgba(230, 178, 77, 0.12)' : 'transparent',
              boxShadow: active ? 'var(--glow-gold)' : 'none',
            }}
          >
            {o.label}
          </Link>
        )
      })}
    </div>
  )
}
