interface ApproachFAQ {
  question: string
  answer: string
}
const BEST_AT: string[] = ['Web Design', 'Branding', 'Product Design', 'Framer Development']
const CLIENTS: string[] = ['AI & Tech', 'Web3 / Crypto', 'Design Agencies', 'Dev Teams']
const THE_APPROACH: ApproachFAQ[] = [
  {
    question: 'What does your process look like?',
    answer:
      'We start by defining scope, goals, and constraints. Then I move straight into design, share progress early, iterate quickly, and ship. No long workshops, no unnecessary steps. We communicate through Slack or Telegram.',
  },
  {
    question: 'What does your process look like?',
    answer:
      'We start by defining scope, goals, and constraints. Then I move straight into design, share progress early, iterate quickly, and ship. No long workshops, no unnecessary steps. We communicate through Slack or Telegram.',
  },
  {
    question: 'What does your process look like?',
    answer:
      'We start by defining scope, goals, and constraints. Then I move straight into design, share progress early, iterate quickly, and ship. No long workshops, no unnecessary steps. We communicate through Slack or Telegram.',
  },
  {
    question: 'What does your process look like?',
    answer:
      'We start by defining scope, goals, and constraints. Then I move straight into design, share progress early, iterate quickly, and ship. No long workshops, no unnecessary steps. We communicate through Slack or Telegram.',
  },
]

interface Work {
  title: string
  description: string
  url: string
  image: string
  accentColor: string
}

const WORKS: Work[] = [
  {
    title: 'Noctis Studio',
    description:
      'A digital design studio redefining brand identities through motion-first thinking and spatial interfaces. Built on a foundation of dark aesthetics and luminous detail.',
    url: '#',
    image: '/works1.webp',
    accentColor: '#D5FF37',
  },
  {
    title: 'Terraform Labs',
    description:
      'Climate-tech platform visualising real-time ecological data through immersive 3D terrain maps. Designed to make planetary-scale information feel intimate and actionable.',
    url: '#',
    image: '/works2.webp',
    accentColor: '#7DD6FF',
  },
  {
    title: 'Voidform',
    description:
      'Experimental art collective exploring the intersection of generative AI and sculptural form. Each piece is minted as a living artefact that evolves over time.',
    url: '#',
    image: '/works3.webp',
    accentColor: '#FFA0B0',
  },
  {
    title: 'Arcline Finance',
    description:
      'Next-gen fintech dashboard that strips complexity out of portfolio management. Minimal chrome, maximal clarity — numbers that breathe.',
    url: '#',
    image: '/works4.webp',
    accentColor: '#FFA17B',
  },
  {
    title: 'Parallel Worlds',
    description:
      'Narrative-driven gaming platform where players shape branching storylines through collaborative world-building. Every decision ripples across shared timelines.',
    url: '#',
    image: '/works5.webp',
    accentColor: '#C4B5FD',
  },
]

export { BEST_AT, THE_APPROACH, CLIENTS, WORKS }
export type { Work }
