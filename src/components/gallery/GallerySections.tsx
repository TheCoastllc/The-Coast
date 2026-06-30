'use client'

import { GalleryGrid } from './GalleryGrid'
import { GalleryStrip } from './GalleryStrip'
import type { GallerySection } from './types'

// Drive folders rendered as de-emphasized bottom scroll strips instead of the
// main wall. Matched by normalized section name / folder. ORDER MATTERS: it is
// the vertical stacking order of the strips (first = highest, just above the next).
const STRIP_SECTIONS = ['the coast', 'design the future']

const norm = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const stripIndex = (s: GallerySection): number =>
  STRIP_SECTIONS.findIndex((t) => norm(s.name) === norm(t) || norm(s.key) === norm(t))
const isStrip = (s: GallerySection): boolean => stripIndex(s) !== -1

/**
 * No section names/headings (David's call). Everything renders as one clean wall,
 * EXCEPT folders flagged as strip sections (see STRIP_SECTIONS), which each drop to
 * their OWN horizontal scroll row at the bottom (scrolling only within that folder's
 * pictures) so the main wall above shines. Strips stack in STRIP_SECTIONS order.
 */
export function GallerySections({ sections }: { sections: GallerySection[] }) {
  const wall = sections.filter((s) => !isStrip(s)).flatMap((s) => s.items)
  // Keep each strip folder as its OWN row, stacked in STRIP_SECTIONS order.
  const stripSections = sections
    .filter(isStrip)
    .sort((a, b) => stripIndex(a) - stripIndex(b))

  // Show the wall when it has items, or when there are no strips (so a truly empty
  // gallery still renders the grid's empty state rather than nothing).
  const showWall = wall.length > 0 || stripSections.length === 0

  return (
    <>
      {showWall && <GalleryGrid items={wall} />}
      {stripSections.map((s) => (
        <GalleryStrip key={s.key} items={s.items} />
      ))}
    </>
  )
}
