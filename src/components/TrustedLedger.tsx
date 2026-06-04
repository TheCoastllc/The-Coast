'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

/**
 * TrustedLedger - Awwwards-tier client showcase.
 *
 * Design intent (see plan Section B.3):
 * - Horizontal auto-marquee row, pauses on hover/focus, respects reduced motion.
 * - Each brand rendered as a typographic wordmark in the display font - no logo
 *   PNG wrangling required (per user decision Q2). Cohesive with site typography.
 * - Per-card metadata: index fraction, wordmark, category tag, year.
 * - Hover: 1px lift, gold underline sweeps L→R under wordmark, arrow appears.
 * - If a brand has a case study slug, the whole card is a link.
 */

export type LedgerBrand = {
  id: string
  name: string
  /** Optional display override - used when name has special casing or punctuation. */
  wordmark?: string
  /** Category descriptor, e.g. "BRANDING · WEB". Rendered in mono. */
  category?: string
  /** Year of engagement (or most recent). */
  year?: number
  /** If set, the card links to /work/[slug]. */
  caseStudySlug?: string
  /** Optional external URL - used when no case study exists. */
  url?: string
}

const MARQUEE_DURATION = 60 // seconds for one full loop

function BrandCard({
  brand,
  index,
  total,
}: {
  brand: LedgerBrand
  index: number
  total: number
}) {
  const indexLabel = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
  const display = brand.wordmark ?? brand.name
  const href = brand.caseStudySlug ? `/work/${brand.caseStudySlug}` : brand.url ?? null

  const inner = (
    <div className="group relative flex h-[220px] w-[300px] shrink-0 flex-col justify-between border-r border-[var(--hairline)] px-7 py-6 transition-transform duration-[var(--dur-std)] [transition-timing-function:var(--ease-out-expo)] hover:-translate-y-[1px]">
      {/* Top row: index fraction + arrow */}
      <div className="flex items-start justify-between">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--fg-subtle)] tabular-nums"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {indexLabel}
        </span>
        {href && (
          <ArrowUpRight
            className="size-3.5 text-[var(--fg-subtle)] opacity-0 transition-all duration-[var(--dur-micro)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--gold)] group-hover:opacity-100"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Wordmark */}
      <div className="relative">
        <h3
          className="font-display text-2xl uppercase tracking-tighter text-[var(--fg)] leading-[0.95] transition-colors duration-[var(--dur-micro)] group-hover:text-[var(--gold)] md:text-3xl"
          aria-label={brand.name}
        >
          {display}
        </h3>
        {/* Gold underline sweep on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-2 left-0 block h-px w-full origin-left scale-x-0 bg-[var(--gold)] transition-transform duration-[var(--dur-std)] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-x-100"
        />
      </div>

      {/* Bottom row: category + year */}
      <div className="flex items-end justify-between">
        {brand.category && (
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--gold)] opacity-80">
            {brand.category}
          </span>
        )}
        {brand.year && (
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--fg-subtle)] tabular-nums">
            {brand.year}
          </span>
        )}
      </div>
    </div>
  )

  if (href) {
    const isExternal = href.startsWith('http')
    return isExternal ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="hover-target block focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--gold)] focus-visible:outline-offset-2"
      >
        {inner}
      </a>
    ) : (
      <Link
        href={href}
        className="hover-target block focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--gold)] focus-visible:outline-offset-2"
      >
        {inner}
      </Link>
    )
  }

  return <div className="block">{inner}</div>
}

export function TrustedLedger({ brands }: { brands: LedgerBrand[] }) {
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement | null>(null)

  // Track hover/focus to pause the marquee
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const onEnter = () => setPaused(true)
    const onLeave = () => setPaused(false)
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    el.addEventListener('focusin', onEnter)
    el.addEventListener('focusout', onLeave)
    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
      el.removeEventListener('focusin', onEnter)
      el.removeEventListener('focusout', onLeave)
    }
  }, [])

  if (brands.length === 0) return null

  // Duplicate the list so the marquee can loop seamlessly
  const reel = [...brands, ...brands]

  return (
    <section
      aria-label="Trusted by"
      className="relative overflow-hidden border-y border-[var(--hairline)] bg-[var(--black-0)] py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        {/* Kicker */}
        <div className="mb-6 flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]/70">
            [ Trusted by ]
          </span>
          <span className="h-px flex-1 bg-[var(--hairline-2)]" aria-hidden="true" />
        </div>

        {/* Tagline */}
        <h2 className="mb-16 max-w-3xl font-display text-3xl uppercase leading-[0.95] tracking-tighter text-[var(--fg)] md:text-5xl">
          The brands building what&apos;s next.
        </h2>
      </div>

      {/* The Ledger - full-bleed marquee track */}
      <div
        ref={trackRef}
        className="relative border-t border-[var(--hairline)] [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
      >
        <motion.div
          className="flex w-max"
          animate={
            reduced || paused
              ? { x: 0 }
              : { x: ['0%', '-50%'] }
          }
          transition={
            reduced || paused
              ? { duration: 0 }
              : {
                  x: { repeat: Infinity, ease: 'linear', duration: MARQUEE_DURATION },
                }
          }
        >
          {reel.map((brand, i) => (
            <BrandCard
              key={`${brand.id}-${i}`}
              brand={brand}
              index={i % brands.length}
              total={brands.length}
            />
          ))}
        </motion.div>
      </div>

      {/* Right-edge fade pointer + counter */}
      <div className="mx-auto mt-8 max-w-6xl px-6 md:px-10">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--fg-subtle)]">
            {paused ? 'Paused' : reduced ? 'Static' : 'Auto-scroll'} ·{' '}
            {brands.length} clients
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--fg-subtle)]">
            Hover to pause
          </span>
        </div>
      </div>
    </section>
  )
}
