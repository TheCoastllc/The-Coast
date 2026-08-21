// Single source of truth for all case study pages.
//
// To publish a new case study:
//   1. Add an entry below with ready: false and build the page component
//   2. Flip ready: true when the page is done
// That's it — sitemap, generateStaticParams, metadata (noindex), and llms.txt all update automatically.
//
// Two render styles supported:
//   - style: 'custom'    → uses a hand-built React component (e.g. ZappedCoPage)
//   - style: 'cinematic' → uses CinematicCaseStudy (palette / moments / motion / stats / stack / live)

export interface Moment {
  image: string
  caption: string
}
export interface Stat {
  value: string
  label: string
}

export interface CaseStudyMeta {
  title: string
  description: string
  /** true = published and indexed; false = under construction (noindex) */
  ready: boolean
  /** Render style. Defaults to 'custom' for backwards compatibility. */
  style?: 'custom' | 'cinematic'

  // ── Rich data used by the 'cinematic' renderer ──
  client?: string          // 'TROI Trading & Tech'
  tagline?: string         // '1-line headline for the case study hero'
  category?: string        // 'Trading & AI'
  role?: string[]
  year?: number
  color?: string           // brand color hex
  textColor?: string       // foreground color when card uses `color` as bg
  liveUrl?: string
  stack?: string[]
  palette?: string[]
  moments?: Moment[]
  stats?: Stat[]
  summary?: string         // long-form description for listings
}

export const CASE_STUDIES: Record<string, CaseStudyMeta> = {
  // ─────────────────────────────────────────────────────────────
  // Cinematic case studies (Coast Studio designed + built)
  // ─────────────────────────────────────────────────────────────
  troi: {
    title: 'TROI Trading & Tech — Brand & Site | The Coast Global',
    description:
      'Brand site for John Dunham — U.S. Army vet running mentorship for traders and AI for business owners. Includes a 10-card testimonial deck and a /studio template system.',
    ready: true,
    style: 'cinematic',
    client: 'TROI Trading & Tech',
    tagline: 'A live-mentorship brand for traders and AI operators.',
    category: 'Trading & AI',
    role: ['Brand', 'Design', 'Development', 'CMS', 'Motion'],
    year: 2026,
    color: '#18061e',
    textColor: '#f6f1e8',
    liveUrl: 'https://troitradingandtech.com',
    stack: ['Astro', 'GSAP', 'Lenis', 'Sanity', 'Vercel'],
    palette: ['#18061e', '#D4A843', '#221030', '#f6f1e8', '#9a7a1e'],
    moments: [
      { image: '/portfolio/troi/moment-hero.jpg', caption: 'Hero — Build wealth with discipline' },
      { image: '/portfolio/troi/moment-paths.jpg', caption: 'Dual-path — trader & operator' },
      { image: '/portfolio/troi/moment-deck.jpg', caption: 'Playing-card testimonial deck' },
      { image: '/portfolio/troi/moment-studio.jpg', caption: 'Studio — 32 branded templates' },
    ],
    stats: [
      { value: '10', label: 'Testimonials' },
      { value: '32', label: 'Studio templates' },
      { value: '6+', label: 'Years running' },
      { value: '2', label: 'Audiences' },
    ],
    summary:
      "Full brand site for John Dunham — U.S. Army vet running mentorship for traders and AI for business owners. Includes a 10-card testimonial deck and a /studio template system that generates branded social posts, flyers, and ads.",
  },

  'dada-global-finance': {
    title: 'Dada Global Finance - Brand & Website | The Coast Global',
    description:
      'Brand and website for Dada Global Financial Group - a boutique wealth and life-insurance firm protecting families through generational wealth planning. Designed and built by The Coast Global.',
    ready: true,
    style: 'cinematic',
    client: 'Dada Global Finance',
    tagline: 'A covenant of protection - generational wealth, quietly architected.',
    category: 'Finance · Web',
    role: ['Brand', 'Web', 'Development'],
    year: 2025,
    color: '#0c1b30',
    textColor: '#f4efe3',
    liveUrl: 'https://dadaglobalfin.com',
    stack: ['Design', 'Development', 'Web'],
    palette: ['#0c1b30', '#c9a24a', '#13294a', '#f4efe3'],
    moments: [
      { image: '/portfolio/dada-global-finance/cover.jpg', caption: 'Hero - A Covenant of Protection' },
    ],
    stats: [],
    summary:
      'A boutique wealth and life-insurance brand. The Coast Global designed and built the full brand site for Dada Global Financial Group - an editorial serif identity in dark navy and gold, and a calm, trust-first experience at dadaglobalfin.com.',
  },

  kando: {
    title: 'Kando Elite Health — Brand & Site | The Coast Global',
    description:
      'Brand and site for a concierge healthcare practice — refined, exclusive, high-touch. Dusty-rose mauve on warm cream.',
    ready: true,
    style: 'cinematic',
    client: 'Kando Elite Health',
    tagline: 'Graceful care, exclusively yours.',
    category: 'Healthcare',
    role: ['Brand', 'Design', 'Development'],
    year: 2026,
    color: '#6B4C5A',
    textColor: '#FAF6EC',
    liveUrl: 'https://kandoelitehealth.com',
    stack: ['Design', 'Development', 'Brand'],
    palette: ['#6B4C5A', '#FAF6EC', '#3A2620', '#1f1b17'],
    moments: [
      { image: '/portfolio/kando/moment-hero.jpg', caption: 'Hero — graceful care' },
      { image: '/portfolio/kando/moment-services.jpg', caption: 'Services overview' },
      { image: '/portfolio/kando/moment-about.jpg', caption: 'Practice intro' },
      { image: '/portfolio/kando/moment-contact.jpg', caption: 'Booking flow' },
    ],
    stats: [
      { value: 'Private', label: 'Practice tier' },
      { value: 'Concierge', label: 'Care model' },
      { value: '1:1', label: 'Patient relationship' },
    ],
    summary:
      'Brand and site for a concierge healthcare practice — refined, exclusive, high-touch. Dusty-rose mauve on warm cream signals luxury and discretion without shouting.',
  },

  'solomon-katsman': {
    title: 'Solomon Katsman — Wealth Strategist Site | The Coast Global',
    description:
      'Wealth strategist site for taxable-income mitigation — Defined Benefit plans and exit-stage structures for high-earning business owners.',
    ready: true,
    style: 'cinematic',
    client: 'Solomon Katsman',
    tagline: 'Tax strategy for founders earning $400K–$5M annually.',
    category: 'Finance',
    role: ['Brand', 'Design', 'Development'],
    year: 2026,
    color: '#0C1B2A',
    textColor: '#C9A55C',
    liveUrl: 'https://solomonkatsman.com',
    stack: ['Design', 'Development', 'Brand'],
    palette: ['#0C1B2A', '#C9A55C', '#142840', '#F1ECDF', '#B8893A'],
    moments: [
      { image: '/portfolio/solomon-katsman/moment-hero.jpg', caption: 'Hero — strategic positioning' },
      { image: '/portfolio/solomon-katsman/moment-quarterly.jpg', caption: 'Katsman Quarterly' },
      { image: '/portfolio/solomon-katsman/moment-brochure.jpg', caption: 'Practice brochure' },
      { image: '/portfolio/solomon-katsman/moment-cta.jpg', caption: 'Referral call to action' },
    ],
    stats: [
      { value: '$400K–$5M', label: 'Target client income' },
      { value: 'Referral', label: 'Practice access' },
      { value: 'DB Plans', label: 'Core vehicle' },
    ],
    summary:
      "Wealth strategist site for taxable-income mitigation — Defined Benefit plans and exit-stage structures for high-earning business owners. Referral-only practice via Alpha Innovation Partners.",
  },

  'omotunde-hospital': {
    title: 'Omotunde Hospital — Healthcare Brand | The Coast Global',
    description:
      'Healthcare brand and site for a Nigerian hospital — warm rust + navy palette signals trust without sterility.',
    ready: true,
    style: 'cinematic',
    client: 'Omotunde Hospital',
    tagline: 'A Lagos-rooted healthcare brand built on warmth.',
    category: 'Healthcare',
    role: ['Brand', 'Design', 'Development'],
    year: 2026,
    color: '#b94a2a',
    textColor: '#ffe2b5',
    liveUrl: 'https://omotundehospital.org',
    stack: ['WordPress', 'Custom theme', 'Brand'],
    palette: ['#b94a2a', '#0a0e25', '#ffe2b5', '#f5a85a', '#a83622'],
    moments: [
      { image: '/portfolio/omotunde-hospital/moment-hero.jpg', caption: 'Hero — Lagos hospital' },
      { image: '/portfolio/omotunde-hospital/moment-services.jpg', caption: 'Services grid' },
      { image: '/portfolio/omotunde-hospital/moment-doctors.jpg', caption: 'Care team' },
      { image: '/portfolio/omotunde-hospital/moment-contact.jpg', caption: 'Visit + contact' },
    ],
    stats: [
      { value: 'Lagos', label: 'Region' },
      { value: 'Multi-service', label: 'Care offering' },
      { value: 'Warm', label: 'Brand temperature' },
    ],
    summary:
      'Healthcare brand and site for a Nigerian hospital — warm rust + navy palette signals trust without sterility.',
  },

  'iamd-health': {
    title: 'iAMD Health — Clinical Brand | The Coast Global',
    description:
      'Healthcare practice site with a deep-blue + cream palette — calm, trustworthy, considered. Built for patient confidence.',
    ready: true,
    style: 'cinematic',
    client: 'iAMD Health',
    tagline: 'A clinical practice brand built on reassurance.',
    category: 'Healthcare',
    role: ['Brand', 'Design', 'Development'],
    year: 2026,
    color: '#1F3554',
    textColor: '#F0EAD6',
    liveUrl: 'https://iamdhealth.org',
    stack: ['Web', 'Brand'],
    palette: ['#1F3554', '#F0EAD6', '#7A92B8'],
    moments: [
      { image: '/portfolio/iamd-health/moment-hero.jpg', caption: 'Hero — clinical reassurance' },
      { image: '/portfolio/iamd-health/moment-services.jpg', caption: 'Services overview' },
      { image: '/portfolio/iamd-health/moment-about.jpg', caption: 'Practice overview' },
      { image: '/portfolio/iamd-health/moment-contact.jpg', caption: 'Booking flow' },
    ],
    stats: [
      { value: 'Clinical', label: 'Tone' },
      { value: 'Calm', label: 'Color register' },
      { value: 'Patient-first', label: 'Design lens' },
    ],
    summary:
      'Healthcare practice site with a deep-blue + cream palette — calm, trustworthy, considered. Built for patient confidence.',
  },

  // ─────────────────────────────────────────────────────────────
  // Existing custom case studies (preserved)
  // ─────────────────────────────────────────────────────────────
  zappedco: {
    title: 'Zapped Co — Brand Transformation | The Coast Global',
    description:
      'Complete brand identity transformation for Zapped Co — from DIY lightning bolt to a dynamic, modern visual system across 15+ deliverables.',
    ready: true,
    style: 'custom',
    client: 'Zapped Co',
    tagline: 'Brand transformation across 15+ deliverables.',
    category: 'Brand',
    year: 2025,
    color: '#00fa11',
    textColor: '#0d0d0d',
  },
  'amg-records': {
    title: 'AMG Records — Brand Identity | The Coast Global',
    description:
      'Black-and-gold identity for a record label. Restrained, serious, made for artists who take the work seriously.',
    ready: true,
    style: 'cinematic',
    client: 'AMG Records',
    tagline: 'A black-and-gold identity for a label that takes the work seriously.',
    category: 'Music · Brand',
    role: ['Brand', 'Logo system', 'Web design'],
    year: 2026,
    color: '#0a0a0c',
    textColor: '#E6B24D',
    liveUrl: 'https://www.amgrecord.com',
    stack: ['Web', 'Brand', 'Logo system'],
    palette: ['#0a0a0c', '#E6B24D', '#1a1a1a', '#f5f5f5'],
    moments: [
      { image: '/portfolio/amg-records/moment-hero.jpg', caption: 'Hero — label identity' },
      { image: '/portfolio/amg-records/moment-roster.jpg', caption: 'Artist roster' },
      { image: '/portfolio/amg-records/moment-releases.jpg', caption: 'Latest releases' },
      { image: '/portfolio/amg-records/moment-contact.jpg', caption: 'Submissions / contact' },
    ],
    stats: [
      { value: 'Black', label: 'Identity base' },
      { value: 'Gold', label: 'Accent system' },
      { value: 'Music', label: 'Category' },
    ],
    summary:
      'Identity and site for a record label that needed to look as serious as the music. Black-and-gold palette, condensed type, restrained motion.',
  },
  ogaticket: {
    title: 'OgaTicket — Web Development | The Coast Global',
    description:
      "End-to-end digital platform for Africa's next-gen event ticketing experience.",
    ready: true,
    style: 'cinematic',
    client: 'OgaTicket',
    tagline: "Africa's next-gen event ticketing platform.",
    category: 'Development',
    role: ['Brand', 'Design', 'Development', 'Product'],
    year: 2026,
    color: '#F97316',
    textColor: '#FFFFFF',
    liveUrl: 'https://ogaticket.com',
    stack: ['Web', 'Payments', 'Custom build'],
    palette: ['#F97316', '#25292E', '#FFFFFF', '#FFD641'],
    moments: [
      { image: '/portfolio/ogaticket/moment-hero.jpg', caption: 'Hero — discover events' },
      { image: '/portfolio/ogaticket/moment-events.jpg', caption: 'Event listings' },
      { image: '/portfolio/ogaticket/moment-checkout.jpg', caption: 'Ticket checkout' },
      { image: '/portfolio/ogaticket/moment-organizers.jpg', caption: 'For organizers' },
    ],
    stats: [
      { value: 'Africa', label: 'Built for' },
      { value: 'Events', label: 'Category' },
      { value: 'Payments', label: 'Core flow' },
    ],
    summary:
      'End-to-end ticketing platform built for the African events market — fast checkout, organizer tools, and a brand that holds up under scale.',
  },
  'world-is-yours': {
    title: 'The World Is Yours - Brand & Website | The Coast Global',
    description:
      'Brand and website for The World Is Yours Inc - a real estate, capital and legacy firm. Designed and built by The Coast Global.',
    ready: true,
    style: 'cinematic',
    client: 'The World Is Yours Inc',
    tagline: 'Real estate, capital, legacy - an old-money standard, built for the web.',
    category: 'Real Estate · Finance',
    role: ['Brand', 'Web', 'Development'],
    year: 2026,
    color: '#0b1c2c',
    textColor: '#f4efe3',
    liveUrl: 'https://theworldisyoursinc.com',
    stack: ['Design', 'Development', 'Web'],
    palette: ['#0b1c2c', '#c8a24a', '#1f4763', '#f4efe3'],
    moments: [
      { image: '/portfolio/world-is-yours/cover.jpg', caption: 'Hero - Real Estate · Capital · Legacy' },
    ],
    stats: [],
    summary:
      'A real estate, capital and legacy firm that needed to look like the estates it represents. The Coast Global built the brand and site around an old-money editorial standard - serif wordmark, gold rules, and full-bleed property photography at theworldisyoursinc.com.',
  },
  'new-era-aesthetics': {
    title: 'New Era Aesthetics - Brand & Website | The Coast Global',
    description:
      'Brand and website for New Era Aesthetics - an RF microneedling device brand for aesthetic practices. Designed and built by The Coast Global.',
    ready: true,
    style: 'cinematic',
    client: 'New Era Aesthetics',
    tagline: 'A new beginning for your skin - a medical device made credible.',
    category: 'Medical Tech · Aesthetics',
    role: ['Brand', 'Web', 'Development'],
    year: 2025,
    color: '#12212b',
    textColor: '#f2f6f8',
    liveUrl: 'https://neweraaesthetics.com',
    stack: ['Design', 'Development', 'Web'],
    palette: ['#12212b', '#8fbcd4', '#e8eef2', '#ffffff'],
    moments: [
      { image: '/portfolio/new-era-aesthetics/cover.jpg', caption: 'Hero - A New Beginning For Your Skin' },
    ],
    stats: [],
    summary:
      'An RF microneedling device sold to aesthetic practices, where clinical trust has to arrive before the sales conversation. The Coast Global built a calm, evidence-forward brand and site - device detail, pricing and demo booking in a clean clinical white system at neweraaesthetics.com.',
  },
  'gifted-touch': {
    title: 'Gifted Touch Therapeutic Massage - Brand & Website | The Coast Global',
    description:
      'Brand and website for Gifted Touch Therapeutic Massage - board certified therapeutic massage in Huntsville, Alabama. Designed and built by The Coast Global.',
    ready: true,
    style: 'cinematic',
    client: 'Gifted Touch Therapeutic Massage',
    tagline: 'Anointed hands, a gifted touch - twenty years of care in Huntsville.',
    category: 'Wellness · Web',
    role: ['Brand', 'Web', 'Development'],
    year: 2026,
    color: '#123a2e',
    textColor: '#f6f1e4',
    liveUrl: 'https://giftedtouch.org',
    stack: ['Design', 'Development', 'Web'],
    palette: ['#123a2e', '#a5642a', '#f6f1e4', '#ffffff'],
    moments: [
      { image: '/portfolio/gifted-touch/cover.jpg', caption: 'Hero - Anointed Hands, A Gifted Touch' },
    ],
    stats: [],
    summary:
      'Board certified therapeutic massage in Huntsville, Alabama, serving studio and corporate clients for more than twenty years. The Coast Global built the brand and site around a warm editorial calm - deep green and bronze on cream, with booking front and centre at giftedtouch.org.',
  },
  prospry: {
    title: 'Prospry — Brand Identity | The Coast Global',
    description: 'A clean, prosperous visual system for a fintech brand built on trust.',
    ready: false,
    style: 'custom',
    client: 'Prospry',
    tagline: 'A clean visual system for a fintech built on trust.',
    category: 'Brand',
    year: 2026,
    color: '#15803d',
    textColor: '#fafafa',
  },
}

// Canonical list of project IDs in display order.
// Order: cinematic ready projects first (TROI showcase, then by recency),
// then custom-style (Zapped Co), then under-construction at the end.
export const CASE_STUDY_ORDER = [
  'troi',
  'world-is-yours',
  'gifted-touch',
  'new-era-aesthetics',
  // Dada was defined in CASE_STUDIES but never listed here, so /work (which
  // maps this array) silently dropped it while the homepage (which reads
  // CASE_STUDIES directly) still showed it. That also sent the case-study
  // "next" link for Dada back to the first project, and left its sitemap
  // entry orphaned - indexed by Google but unreachable from /work.
  'dada-global-finance',
  'kando',
  'solomon-katsman',
  'amg-records',
  'ogaticket',
  'omotunde-hospital',
  'iamd-health',
  'zappedco',
  'prospry',
] as const

/* Guard: every defined project must appear in the display order, or /work and
 * the homepage silently disagree (see the Dada omission above). Dev-only so a
 * future addition fails loudly in development instead of vanishing in prod. */
if (process.env.NODE_ENV !== 'production') {
  const missing = Object.keys(CASE_STUDIES).filter(
    (id) => !(CASE_STUDY_ORDER as readonly string[]).includes(id)
  )
  if (missing.length) {
    console.error(
      `[case-studies] Defined but absent from CASE_STUDY_ORDER, so /work will skip them: ${missing.join(', ')}`
    )
  }
}

// Helper: list projects for the work feed, with ready ones first.
export function listProjects() {
  return CASE_STUDY_ORDER.map((id) => ({ id, ...CASE_STUDIES[id] })).filter(Boolean)
}
