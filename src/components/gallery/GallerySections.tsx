'use client'

import { GalleryGrid } from './GalleryGrid'
import { GalleryStrip } from './GalleryStrip'
import type { GallerySection } from './types'

// Drive folders rendered as a de-emphasized bottom scroll strip instead of the
// main wall (near-duplicate sets). Matched by normalized section name / folder.
const STRIP_SECTIONS = ['design the future']

const norm = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const isStrip = (s: GallerySection): boolean =>
  STRIP_SECTIONS.some((t) => norm(s.name) === norm(t) || norm(s.key) === norm(t))

/**
 * No section names/headings (David's call). Everything renders as one clean wall,
 * EXCEPT folders flagged as strip sections (see STRIP_SECTIONS), which drop to a
 * single horizontal scroll row at the bottom so the main wall above shines.
 */
export function GallerySections({ sections }: { sections: GallerySection[] }) {
  const wall = sections.filter((s) => !isStrip(s)).flatMap((s) => s.items)
  const strip = sections.filter(isStrip).flatMap((s) => s.items)

  // Show the wall when it has items, or when there's no strip (so a truly empty
  // gallery still renders the grid's empty state rather than nothing).
  const showWall = wall.length > 0 || strip.length === 0

  return (
    <>
      {showWall && <GalleryGrid items={wall} />}
      {strip.length > 0 && <GalleryStrip items={strip} />}
    </>
  )
}
