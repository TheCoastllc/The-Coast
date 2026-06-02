// Shared content for all three /offers design directions. Editing here keeps
// the Lab / Editorial / Interactive variants in lockstep so only the layout
// differs between them.

export type Tool = {
  number: string
  title: string
  tagline: string
  description: string
  href: string
  cta: string
  glow: 'teal' | 'gold' | 'orange'
  stats: { value: string; label: string }[]
  /** One real, representative item quoted from the tool's data (interactive teaser). */
  sample: { kicker: string; prompt: string; hint?: string }
}

export const CBI = {
  eyebrow: 'The Coast Brand Index',
  headline: 'How Strong Is Your Wave?',
  blurb:
    'The Coast Brand Index scores your brand across 5 pillars and 20 criteria. Get your Wave Rating in under 2 minutes - free.',
  href: '/cbi',
  cta: 'Measure your wave',
  pillars: ['Identity', 'Digital Foundation', 'Market Presence', 'Consistency', 'Trust Signals'],
  /** The five-tier Wave scale, weakest to strongest (mirrors cbi/data/waves.ts). */
  waveScale: [
    { name: 'Stranded', w: 1 },
    { name: 'Drifting', w: 2 },
    { name: 'Shoreline', w: 3 },
    { name: 'Harbor', w: 4 },
    { name: 'Lighthouse', w: 5 },
  ],
  /** Illustrative mock result for the interactive variant (no real scoring). */
  mock: {
    score: 76,
    waveName: 'Harbor',
    line: 'Strong brand. Minor gaps between you and category leadership.',
    pillar: 'Identity',
    pillarPrompt: "Your brand's visual identity - logo, colors, type system.",
  },
} as const

export const TOOLS: Tool[] = [
  {
    number: '01',
    title: 'Brand Quiz',
    tagline: "What's Your Brand Actually Saying?",
    description:
      '10 questions, 60 seconds. Is your brand invisible, inconsistent, or established? Get a clear action plan to fix it.',
    href: 'https://offers.coastglobal.org/brand-quiz',
    cta: 'Take the Quiz',
    glow: 'teal',
    stats: [
      { value: '60s', label: 'Time' },
      { value: '10', label: 'Questions' },
      { value: 'Free', label: 'Cost' },
    ],
    sample: {
      kicker: 'Question 1 of 10',
      prompt:
        'If a new customer landed on your homepage right now with no context, what would they experience?',
      hint: "They'd immediately understand what we do, who we're for, and why we're different.",
    },
  },
  {
    number: '02',
    title: 'Brand Consistency Checklist',
    tagline: 'Is Your Brand Leaking Trust?',
    description:
      '25 checkpoints across 5 pillars. Your score updates as you check each box. See exactly where your brand leaks trust.',
    href: 'https://offers.coastglobal.org/brand-checklist',
    cta: 'Score Your Brand',
    glow: 'gold',
    stats: [
      { value: '25', label: 'Items' },
      { value: '5', label: 'Categories' },
      { value: 'Free', label: 'Cost' },
    ],
    sample: {
      kicker: 'Visual Identity - checkpoint 1 of 25',
      prompt:
        'Your logo appears in the same format, color, and proportions across your website, social profiles, email header, and packaging.',
    },
  },
  {
    number: '03',
    title: 'The 3-Second Test',
    tagline: 'How Customers Judge You Before You Say a Word',
    description:
      'The five things customers process in the first three seconds of seeing your brand. Run the self-test to see if you pass.',
    href: 'https://offers.coastglobal.org/3-second-test',
    cta: 'Run the Test',
    glow: 'orange',
    stats: [
      { value: '5', label: 'Elements' },
      { value: '3s', label: 'Window' },
      { value: 'Free', label: 'Cost' },
    ],
    sample: {
      kicker: 'Element 1 of 5 - Visual Hierarchy',
      prompt:
        'Is it immediately clear where to look? Clutter or flatness reads as disorganisation - and disorganisation reads as distrust.',
    },
  },
]
