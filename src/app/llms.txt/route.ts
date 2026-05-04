import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { BLOG_CATEGORIES } from '@/lib/blog-categories'
import { CASE_STUDIES } from '@/lib/case-studies'

// Revalidated on demand via revalidatePath('/llms.txt') in the Posts afterChange hook
export const revalidate = 3600

const BASE_URL = 'https://coastglobal.org'

export async function GET() {
  let posts: Array<{ title: string; slug: string; excerpt?: string; publishedAt?: string }> = []

  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      limit: 1000,
      sort: '-publishedAt',
      depth: 0,
      select: { title: true, slug: true, excerpt: true, publishedAt: true } as any,
    })
    posts = docs as any[]
  } catch {
    // DB unavailable — serve without posts section
  }

  const lastUpdated = posts[0]?.publishedAt
    ? new Date(posts[0].publishedAt).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0]

  const categoryLines = Object.entries(BLOG_CATEGORIES)
    .map(([slug, label]) => `  - [${label}](${BASE_URL}/blog/category/${slug})`)
    .join('\n')

  const postLines = posts.length > 0
    ? posts
        .map((p) => `- [${p.title}](${BASE_URL}/blog/${p.slug})${p.excerpt ? `: ${p.excerpt}` : ''}`)
        .join('\n')
    : '- No posts published yet.'

  const featuredWork = Object.entries(CASE_STUDIES)
    .filter(([, meta]) => meta.ready)
    .map(([id, meta]) => `  - [${meta.title.split(' — ')[0]}](${BASE_URL}/work/${id}): ${meta.description}`)
    .join('\n')

  const content = `# The Coast

> Last updated: ${lastUpdated}

> The Coast is a brand design studio that makes professional branding affordable and accessible for small businesses, entrepreneurs, startups, and artists. Founded by David Coast, we turn visions into empires - crafting custom branding solutions that make small businesses look and feel like they belong in the big leagues.

## About

- [About The Coast](${BASE_URL}/about): Learn about our story, mission, and vision. Founded by David Coast, The Coast was built to level the playing field - giving small businesses, startups, and solo entrepreneurs the branding power that makes people stop, look, and remember.
- [Vision 2026](${BASE_URL}/vision): Conceptual architectural renderings of our future Coast HQ - embodying innovation, coastal serenity, and the bold pursuit of excellence.

## Services

- [Services](${BASE_URL}/services): From identity design to complete brand transformations - everything you need to stand out. A la carte creative services for businesses of all sizes.
  - [Logo Design](${BASE_URL}/services): Custom logo with 3 concepts and 2 revision rounds.
  - [Flyers](${BASE_URL}/services): Print-ready promotional designs for digital and print.
  - [EPK / Press Kit](${BASE_URL}/services): Professional media kit for press and partners.
  - [Social Graphics](${BASE_URL}/services): 5–10 branded templates for social platforms.
  - [Full Rebrand](${BASE_URL}/services): Complete brand transformation package.
  - [Brand Identity Guidelines](${BASE_URL}/services): Logo, colors, typography, and comprehensive brand guidelines.
  - [Website Design](${BASE_URL}/services): Custom website design and development.
  - [Pitch Deck / Investor Materials](${BASE_URL}/services): Investor-ready presentation design.
  - [Video & Motion](${BASE_URL}/services): Promotional videos and animations.
  - [Digital Marketing](${BASE_URL}/services): SEO, ads setup, and email campaigns.
  - [Social Media Management](${BASE_URL}/services): Content creation, scheduling, and management.

## Service Categories

- [Brand Identity](${BASE_URL}/services): Custom branding and logo design - your visual identity, refined and unforgettable.
- [Digital Experience](${BASE_URL}/services): Websites, apps, and digital products designed for impact, usability, and conversion.
- [Creative Strategy](${BASE_URL}/services): Data-driven insights combined with bold creativity to position your brand as a market leader.
- [Marketing Assets](${BASE_URL}/services): Flyers, social graphics, pitch decks, and digital assets that convert.

## Pricing

- [Pricing](${BASE_URL}/pricing): Monthly retainer packages designed to keep your brand sharp, consistent, and always evolving.
  - [Creator Plan](${BASE_URL}/pricing): Free tier for freelancers and creative beginners. Up to 5 design projects, basic brand kit tools, community feedback access, starter UI components.
  - [Studio Plan](${BASE_URL}/pricing): $25/month for agencies and growing creative teams. Unlimited design projects, complete brand management, advanced UI component library, Figma and Adobe integration, team collaboration workspace.
  - [Agency Pro Plan](${BASE_URL}/pricing): $250/month for large design teams. Everything in Studio plus dedicated creative strategist, white-label design system, custom component development, SSO and enterprise security, 24/7 premium support.

## Process

- [How Does The Coast's Brand Design Process Work?](${BASE_URL}/#process): Our four-step process for transforming your brand.
  - Discover: We dive deep into your brand's DNA - story, audience, competitors, and aspirations.
  - Design: From mood boards to final concepts - every color, typeface, and element chosen with purpose.
  - Develop: Designs become real-world assets - websites, social templates, print materials.
  - Launch: Your brand goes live with guidelines for sustained growth.

## Work

- [Our Work](${BASE_URL}/work): Brand transformations, creative projects, and the stories behind them.
- Published case studies:
${featuredWork || '  - Case studies coming soon.'}

## Blog

- [The Journal](${BASE_URL}/blog): Insights on brand design, visual identity, and creative strategy from The Coast team.
- Categories:
${categoryLines}

## Blog Posts

${postLines}

## Get Started

- [Get Started](${BASE_URL}/get-started): Begin your branding journey with a quick 3-step pre-intake form.
- [Project Intake](${BASE_URL}/intake): Detailed 5-step project intake form.

## Client Portal

- [Client Portal](${BASE_URL}/portal): Login-protected portal for existing clients.

## Contact

- [Contact Us](${BASE_URL}/#contact): Get in touch with The Coast.
  - Email: hello@coastglobal.org
  - Phone: +1 (682) 702-0374

## Social

- [Facebook](https://www.facebook.com/coastglobal)
- [Instagram](https://www.instagram.com/coastglobal)
- [LinkedIn](https://www.linkedin.com/company/thecoastcompanylimited/)
- [X (Twitter)](https://x.com/TheCoastHQ)
- [Pinterest](https://www.pinterest.com/coastglobal)

## FAQ

- What is your typical project timeline? Our engagements typically range from 2 to 6 weeks depending on scope. A standalone logo design takes 2 to 3 weeks. A full brand identity system runs 4 to 6 weeks.
- Do you work with startups or established businesses? Both. We partner with solo founders, early-stage startups, small businesses, and growing companies across tech, healthcare, e-commerce, entertainment, food and beverage, and professional services.
- What is your pricing structure? We offer project-based pricing determined by scope and value, plus three monthly retainer tiers: Creator (free), Studio ($25/month), and Agency Pro ($250/month). Every project begins with a free discovery session.
- Do you offer ongoing support after launch? Yes - our retainer packages provide continuous access to design, development, and strategic support with priority turnaround.

## Company Stats

- 50+ Projects Delivered
- 30+ Brands Built
- 98% Client Satisfaction

## Industries Served

Healthcare, E-commerce, Tech/SaaS, Food & Beverage, Fashion, Real Estate, Professional Services, Entertainment, Music
`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
