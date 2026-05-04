// Single source of truth for all case study pages.
// To publish a new case study:
//   1. Add an entry below with ready: false and build the page component
//   2. Flip ready: true when the page is done
// That's it — sitemap, generateStaticParams, metadata (noindex), and llms.txt all update automatically.
export interface CaseStudyMeta {
  title: string
  description: string
  /** true = published and indexed; false = under construction (noindex) */
  ready: boolean
}

export const CASE_STUDIES: Record<string, CaseStudyMeta> = {
  zappedco: {
    title: 'Zapped Co — Brand Transformation | The Coast',
    description:
      'Complete brand identity transformation for Zapped Co — from DIY lightning bolt to a dynamic, modern visual system across 15+ deliverables.',
    ready: true,
  },
  'amg-records': {
    title: 'AMG Records — Brand Identity | The Coast',
    description: 'A bold visual identity for a record label pushing boundaries in sound and culture.',
    ready: false,
  },
  ogaticket: {
    title: 'OgaTicket — Web Development | The Coast',
    description: "End-to-end digital platform for Africa's next-gen event ticketing experience.",
    ready: false,
  },
  'hatch-startup-nation': {
    title: 'Hatch Startup Nation — Brand Identity | The Coast',
    description: 'Crafting the identity for an incubator nurturing the next wave of founders.',
    ready: false,
  },
  prospry: {
    title: 'Prospry — Brand Identity | The Coast',
    description: 'A clean, prosperous visual system for a fintech brand built on trust.',
    ready: false,
  },
  // Add new case studies here — set ready: true to publish and include in sitemap
}
