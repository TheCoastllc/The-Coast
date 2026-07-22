// Location pages - the local-SEO surface for the service areas that match the
// Google Business Profile (home metro Dallas-Fort Worth; states Texas, Florida,
// Alabama). Each page carries real, distinct copy - service-by-region framing,
// its own FAQ set, and its own engagement model - never a templated paragraph
// with a swapped city name. The org-level LocalBusiness node lives in
// src/lib/schema.ts; these pages emit WebPage + Breadcrumb + FAQ only.

export interface LocationPillar {
  name: string
  localCopy: string
  href: string
}

export interface LocationPage {
  slug: string
  name: string
  kind: 'metro' | 'state'
  metaTitle: string
  metaDescription: string
  headline: string
  preface: string
  intro: string[]
  pillars: LocationPillar[]
  engagementTitle: string
  engagement: string
  faqs: Array<{ q: string; a: string }>
  areaServed: { '@type': string; name: string }
}

export const LOCATION_PAGES: LocationPage[] = [
  {
    slug: 'dallas-fort-worth',
    name: 'Dallas-Fort Worth',
    kind: 'metro',
    metaTitle: 'Dallas-Fort Worth Branding Agency | The Coast Global',
    metaDescription:
      'Branding, digital marketing, and AI consulting for Dallas-Fort Worth businesses. Premium-tier brand work from a DFW agency - logo design to lead generation.',
    headline: 'Dallas-Fort Worth.',
    preface: 'Our home water.',
    intro: [
      'The Coast Global is based in Dallas-Fort Worth. This is where we take calls, meet founders in person, and build brands - and the 682 on our phone number is not an accident.',
      'DFW is one of the fastest-growing business markets in the country, which means every small business here competes for attention against national brands with national budgets. Our work closes that gap: brand identity, marketing, and AI systems that make a local company look and operate like the premium player in its market.',
    ],
    pillars: [
      {
        name: 'Branding & Marketing',
        localCopy:
          'Logo design, full brand identity, rebrands, and marketing assets for DFW businesses that need to look established from day one.',
        href: '/services',
      },
      {
        name: 'Digital Growth',
        localCopy:
          'Lead generation, paid ads, and digital marketing tuned to the DFW market - built to bring local customers through the door.',
        href: '/services',
      },
      {
        name: 'AI & Software',
        localCopy:
          'AI consulting and custom builds - chatbots, automations, and tools - for Metroplex teams ready to put AI to work.',
        href: '/ai',
      },
    ],
    engagementTitle: 'In person, across the Metroplex.',
    engagement:
      'We work face to face with clients across Dallas, Fort Worth, Arlington, Plano, Frisco, and Irving - kickoffs, brand reviews, and strategy sessions on your schedule. Between meetings, everything moves through a fast, structured remote process, so DFW clients get the local relationship and the pace of a modern studio.',
    faqs: [
      {
        q: 'Do you meet in person in Dallas or Fort Worth?',
        a: 'Yes. We are based in the Metroplex and hold in-person kickoffs, brand presentations, and strategy sessions across DFW. Most day-to-day production runs remotely so projects keep moving between meetings.',
      },
      {
        q: 'Which parts of DFW do you serve?',
        a: 'All of it - Dallas, Fort Worth, Arlington, Plano, Frisco, Irving, McKinney, Denton, and the wider Metroplex. If you are in North Texas, you are local to us.',
      },
      {
        q: 'What does a typical DFW engagement look like?',
        a: 'A standalone logo runs 2 to 3 weeks, a full brand identity 4 to 6 weeks, and marketing or AI engagements are scoped to the outcome. You get a fixed scope, a clear timeline, and a single point of contact.',
      },
      {
        q: 'Do you also work with businesses outside DFW?',
        a: 'Yes - we serve clients across Texas, Florida, and Alabama, and take remote engagements worldwide. DFW is home base, not a boundary.',
      },
    ],
    areaServed: { '@type': 'Place', name: 'Dallas-Fort Worth Metroplex' },
  },
  {
    slug: 'texas',
    name: 'Texas',
    kind: 'state',
    metaTitle: 'Texas Branding & Marketing Agency | The Coast Global',
    metaDescription:
      'The Coast Global helps Texas small businesses become premium brands - branding, marketing, lead generation, and AI, from our Dallas-Fort Worth home base.',
    headline: 'Texas.',
    preface: 'Statewide, from the home base.',
    intro: [
      'From Dallas-Fort Worth, The Coast Global works with businesses across the state - Houston, Austin, San Antonio, El Paso, and everywhere between. Texas has more small businesses than any state but California, and most of them are still wearing a brand that undersells the work.',
      'We fix that. The same premium identity, marketing, and AI systems we build for DFW clients ship statewide, with a process designed to run clean whether you are across the street or across the state.',
    ],
    pillars: [
      {
        name: 'Branding & Marketing',
        localCopy:
          'Brand identity and marketing built for Texas markets - from oil-and-gas services to tech startups to family businesses ready for their next chapter.',
        href: '/services',
      },
      {
        name: 'Digital Growth',
        localCopy:
          'Lead generation and paid ads that put Texas businesses in front of Texas customers - statewide reach without statewide overhead.',
        href: '/services',
      },
      {
        name: 'AI & Software',
        localCopy:
          'Custom AI and software for Texas teams - practical systems that cut hours of work, not science projects.',
        href: '/ai',
      },
    ],
    engagementTitle: 'Every major Texas market, one process.',
    engagement:
      'Statewide clients run on a video-first process: structured kickoffs, weekly reviews, and a shared project hub - with on-site sessions in Houston, Austin, or San Antonio when the scope warrants the trip. Distance has never changed the standard of the work.',
    faqs: [
      {
        q: 'Do you work with businesses in Houston, Austin, or San Antonio?',
        a: 'Yes - across all major Texas markets and the smaller ones between. The process is video-first with on-site sessions for larger engagements.',
      },
      {
        q: 'Do Texas clients outside DFW get the same service?',
        a: 'Identical. Same team, same fixed scopes, same timelines. The only difference is whether the kickoff happens in a room or on a call.',
      },
      {
        q: 'What industries do you serve in Texas?',
        a: 'Healthcare, e-commerce, tech and SaaS, food and beverage, real estate, professional services, and entertainment - plus the trades and service businesses that keep Texas running.',
      },
    ],
    areaServed: { '@type': 'State', name: 'Texas' },
  },
  {
    slug: 'florida',
    name: 'Florida',
    kind: 'state',
    metaTitle: 'Florida Branding & Marketing Agency | The Coast Global',
    metaDescription:
      'Branding and digital growth for Florida businesses - Miami, Orlando, Tampa, and statewide. Premium brand identity, marketing, and AI from The Coast Global.',
    headline: 'Florida.',
    preface: 'Where the story started.',
    intro: [
      'The Coast Global has history in Florida. Before there was a studio, founder David Coast was building its beginnings from his car in Miami - working out of coffee shops by day and designing late into every night. Florida is not a market on a map to us; it is where the story started.',
      'Today we bring that same drive back to Florida businesses - in Miami, Orlando, Tampa, and statewide. Premium brand identity, digital marketing, and AI systems for the founders and small businesses fighting to be seen in some of the loudest markets in the country.',
    ],
    pillars: [
      {
        name: 'Branding & Marketing',
        localCopy:
          'Brand identity that cuts through crowded Florida markets - built to stand out in Miami and hold up anywhere.',
        href: '/services',
      },
      {
        name: 'Digital Growth',
        localCopy:
          'Lead generation and paid ads for Florida businesses competing in tourism-heavy, high-noise markets where attention is expensive.',
        href: '/services',
      },
      {
        name: 'AI & Software',
        localCopy:
          'AI consulting and custom tools for Florida teams - hospitality, health, e-commerce, and the service businesses behind them.',
        href: '/ai',
      },
    ],
    engagementTitle: 'Miami to the Panhandle, fully remote.',
    engagement:
      'Florida engagements run on our remote-first process: structured kickoffs on video, weekly working sessions, and a shared hub where every deliverable lands. Clients in Miami, Orlando, Tampa, Jacksonville, and beyond get the same premium work DFW clients get in person.',
    faqs: [
      {
        q: 'Do you work with businesses in Miami, Orlando, or Tampa?',
        a: 'Yes - across all of Florida. The process is fully remote and built for it: video kickoffs, weekly reviews, and a shared project hub from first call to final files.',
      },
      {
        q: 'Why does a Texas agency serve Florida?',
        a: 'Because the company started there. The Coast Global was built from Miami before it was headquartered in Dallas-Fort Worth, and Florida remains one of our named service areas alongside Texas and Alabama.',
      },
      {
        q: 'Does remote change the timeline or the price?',
        a: 'No. Fixed scopes and timelines are identical everywhere we work - a full brand identity runs 4 to 6 weeks whether you are in Tampa or Fort Worth.',
      },
    ],
    areaServed: { '@type': 'State', name: 'Florida' },
  },
  {
    slug: 'alabama',
    name: 'Alabama',
    kind: 'state',
    metaTitle: 'Alabama Branding & Marketing Agency | The Coast Global',
    metaDescription:
      'Branding and digital growth for Alabama businesses - Birmingham, Huntsville, and statewide. Premium brand identity, marketing, and lead generation.',
    headline: 'Alabama.',
    preface: 'The southeast, done premium.',
    intro: [
      'Alabama is growing fast - Huntsville is one of the strongest tech corridors in the south and Birmingham keeps producing businesses that outgrow their branding. What the state is short on is agencies that deliver premium-tier work without big-market pricing.',
      'That is the gap The Coast Global fills. We give Alabama small businesses the same identity, marketing, and AI work we deliver in Dallas and Miami - so a Birmingham company can walk into any room looking like the national player.',
    ],
    pillars: [
      {
        name: 'Branding & Marketing',
        localCopy:
          'Brand identity for Alabama businesses ready to look as strong as their work - from Birmingham firms to Huntsville startups.',
        href: '/services',
      },
      {
        name: 'Digital Growth',
        localCopy:
          'Lead generation and digital marketing that put Alabama businesses in front of the right customers, in-state and beyond.',
        href: '/services',
      },
      {
        name: 'AI & Software',
        localCopy:
          'AI consulting and custom software for Alabama teams - a natural fit for the Huntsville engineering culture and practical for everyone else.',
        href: '/ai',
      },
    ],
    engagementTitle: 'Birmingham, Huntsville, and everywhere between.',
    engagement:
      'Alabama clients run on the same remote-first process as the rest of the southeast: structured video kickoffs, weekly reviews, and one shared hub for every deliverable. No waiting on an agency two time zones away - we work your hours.',
    faqs: [
      {
        q: 'Do you work with Birmingham and Huntsville businesses?',
        a: 'Yes - Birmingham, Huntsville, Montgomery, Mobile, and statewide. Alabama is one of our three named service areas, not an afterthought.',
      },
      {
        q: 'Can a small Alabama business afford premium branding?',
        a: 'That is the point of the studio. Fixed scopes keep premium work within reach of small businesses - the same packages, at the same prices, that our Texas clients get.',
      },
      {
        q: 'How does the remote process work?',
        a: 'A video kickoff to lock strategy and scope, weekly working reviews, and a shared project hub where every concept and file lands. Most Alabama engagements never need a flight - but we will make the trip when the project calls for it.',
      },
    ],
    areaServed: { '@type': 'State', name: 'Alabama' },
  },
]

export const LOCATION_PAGES_MAP: Record<string, LocationPage> = Object.fromEntries(
  LOCATION_PAGES.map((l) => [l.slug, l])
)
