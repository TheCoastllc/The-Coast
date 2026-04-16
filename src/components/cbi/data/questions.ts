export type CbiOption = {
  label: string
  val: 0 | 1 | 2 | 3 | 4
}

export type CbiQuestion = {
  id: CbiPillarId
  pillar: string
  num: number
  question: string
  options: readonly CbiOption[]
}

export type CbiPillarId = 'identity' | 'digital' | 'presence' | 'consistency' | 'trust'

export const questions: readonly CbiQuestion[] = [
  {
    id: 'identity',
    pillar: 'Identity',
    num: 1,
    question: "Your brand's visual identity — logo, colors, type system.",
    options: [
      { label: 'No real logo or visual system in place', val: 0 },
      { label: 'Basic logo, no documented colors or fonts', val: 1 },
      { label: 'Logo and colors exist but applied inconsistently', val: 2 },
      { label: 'Solid identity system used consistently', val: 3 },
      { label: 'Complete brand system with guidelines', val: 4 },
    ],
  },
  {
    id: 'digital',
    pillar: 'Digital Foundation',
    num: 2,
    question: 'Your website as a business tool.',
    options: [
      { label: 'No website or just a placeholder', val: 0 },
      { label: 'Outdated, slow, or free template', val: 1 },
      { label: "Decent but doesn't generate leads", val: 2 },
      { label: 'Professional with clear CTAs and trust elements', val: 3 },
      { label: 'Conversion engine — strategic UX, fast, SEO-optimized', val: 4 },
    ],
  },
  {
    id: 'presence',
    pillar: 'Market Presence',
    num: 3,
    question: 'Your visibility in your market.',
    options: [
      { label: 'Essentially invisible to new customers', val: 0 },
      { label: 'Social accounts exist but inconsistent or dormant', val: 1 },
      { label: 'Active on 1–2 platforms, no real strategy', val: 2 },
      { label: 'Multi-platform with original content and engagement', val: 3 },
      { label: 'Recognized name — inbound leads, media, speaking', val: 4 },
    ],
  },
  {
    id: 'consistency',
    pillar: 'Consistency',
    num: 4,
    question: 'Your brand across every touchpoint.',
    options: [
      { label: 'Each channel looks like a different business', val: 0 },
      { label: 'Same logo, but look and feel varies', val: 1 },
      { label: 'Mostly consistent with some obvious gaps', val: 2 },
      { label: 'Unified look, voice, and messaging everywhere', val: 3 },
      { label: 'Perfectly aligned with documented guidelines enforced', val: 4 },
    ],
  },
  {
    id: 'trust',
    pillar: 'Trust Signals',
    num: 5,
    question: 'Your proof that you deliver.',
    options: [
      { label: 'No reviews, testimonials, or case studies', val: 0 },
      { label: 'A few reviews, maybe a testimonial or two', val: 1 },
      { label: 'Decent reviews but no case studies or video', val: 2 },
      { label: 'Strong reviews, detailed testimonials, case studies', val: 3 },
      { label: '100+ reviews, video testimonials, published case studies', val: 4 },
    ],
  },
] as const

export const CBI_MAX_SCORE = questions.length * 4
