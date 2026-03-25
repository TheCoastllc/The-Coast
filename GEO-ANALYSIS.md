# GEO Analysis — The Coast (coastglobal.org)

**Date:** March 25, 2026
**Site:** https://www.coastglobal.org
**Business Type:** Brand Design Studio (B2B Services)

---

## GEO Readiness Score: 38/100

| Category | Weight | Score | Details |
|----------|--------|-------|---------|
| Citability | 25% | 15/100 | No citable 134-167 word blocks; content too fragmented |
| Structural Readability | 20% | 55/100 | Clean heading hierarchy but few question-based headings |
| Multi-Modal Content | 15% | 40/100 | Images present; no video, charts, or interactive tools indexed |
| Authority & Brand Signals | 20% | 15/100 | Near-zero external brand mentions across platforms |
| Technical Accessibility | 20% | 60/100 | AI crawlers allowed; but critical content in CSR components |

---

## Platform Breakdown

| Platform | Estimated Visibility | Key Issue |
|----------|---------------------|-----------|
| **Google AI Overviews** | Low (25/100) | Content hidden in `'use client'` components; thin answer blocks |
| **ChatGPT Web Search** | Very Low (15/100) | No Wikipedia, no Reddit presence; no external citations |
| **Perplexity** | Very Low (10/100) | No Reddit discussions, no community validation signals |
| **Bing Copilot** | Low (20/100) | Basic Bing indexing; no IndexNow integration |

---

## AI Crawler Access Status

| Crawler | Status | Notes |
|---------|--------|-------|
| GPTBot (OpenAI) | **Allowed** | Explicit `Allow: /` rule |
| ClaudeBot (Anthropic) | **Allowed** | Explicit `Allow: /` rule |
| PerplexityBot | **Allowed** | Explicit `Allow: /` rule |
| Google-Extended | **Allowed** | Explicit `Allow: /` rule |
| OAI-SearchBot | **Not specified** | Should be explicitly allowed |
| ChatGPT-User | **Not specified** | Should be explicitly allowed |
| Bytespider | **Not specified** | Consider blocking (training only) |
| CCBot | **Not specified** | Consider blocking (training only) |
| anthropic-ai | **Not specified** | Consider blocking (training crawler) |

**Rating: Good foundation, needs OAI-SearchBot and ChatGPT-User additions.**

---

## llms.txt Status

**Present:** Yes (`/public/llms.txt`)
**Format:** Correct — follows the emerging standard with markdown structure
**Completeness:** Comprehensive — covers services, pricing, process, portfolio, blog, FAQ, contact, social links

### Issues Found

1. **URLs use `coastglobal.org` instead of `www.coastglobal.org`** — inconsistent with canonical domain (301 redirect exists but bots may not follow)
2. **Missing `llms-full.txt`** — the extended version for detailed content is not provided
3. **Pricing is outdated** — llms.txt lists Creator Plan (Free), Studio ($50), Agency Pro ($500) but pricing page shows Starter ($0), Professional ($25), Enterprise ($250)
4. **No last-updated date** in the file
5. **No licensing/RSL terms** specified

### Recommendations

- Update all URLs to use `www.coastglobal.org` to match canonical
- Sync pricing data with actual pricing page
- Add a last-updated date header
- Consider adding an `llms-full.txt` with expanded content
- Add RSL 1.0 licensing terms

---

## Brand Mention Analysis

| Platform | Presence | Impact |
|----------|----------|--------|
| **Wikipedia** | None | Critical gap — 47.9% of ChatGPT citations come from Wikipedia |
| **Reddit** | None | Critical gap — Reddit is top source for both ChatGPT (11.3%) and Perplexity (46.7%) |
| **YouTube** | None | Critical gap — YouTube mentions have strongest correlation (0.737) with AI visibility |
| **LinkedIn** | Page exists, low activity | Low external visibility; not discoverable via search |
| **Clutch** | None | Missing from key B2B services directory |
| **Dribbble/Behance** | None | Missing from key design industry platforms |
| **Awwwards** | None | Missing from design showcase platform |
| **Yelp** | Basic listing | Minimal signal — Dallas, TX listing exists |
| **ZoomInfo** | Basic listing | Minimal signal — directory listing only |
| **Press/Media** | None | No design publication coverage found |

**Brand Mention Score: 5/100** — Near-zero presence on the platforms that matter most for AI citations.

---

## Passage-Level Citability Analysis

### Current State: No Citable Blocks Found

AI systems cite passages of **134-167 words** that are self-contained and fact-rich. Current content fails on multiple criteria:

| Content Area | Word Count | Citable? | Issue |
|-------------|-----------|----------|-------|
| Hero body text | 56 words | No | Too short, marketing language |
| About "The Story" | ~97 words | No | Close but 37 words short |
| About "Who We Are" | ~81 words | No | Narrative, not self-contained |
| FAQ answers (avg) | ~32 words | No | Far too short (need 4× more) |
| Service descriptions | 15-29 words | No | Feature fragments, not explanations |
| Process steps | 17-20 words | No | Too terse |
| Service page items | 6-15 words | No | One-liners |

### What a Citable Block Looks Like

**Example for "What is brand identity?":**

> Brand identity is the complete visual system that defines how a business presents itself to the world. It encompasses the logo, color palette, typography, imagery style, and design guidelines that create a consistent, recognizable appearance across every touchpoint — from business cards and websites to social media and packaging. A strong brand identity does more than look professional; it builds trust with potential customers, differentiates a business from competitors, and creates an emotional connection that drives loyalty. For small businesses and startups, investing in professional brand identity is one of the highest-ROI decisions available, as it directly influences how customers perceive quality, credibility, and value. At The Coast, we build brand identity systems starting with logo design, extending through comprehensive brand guidelines, and delivering production-ready assets for digital and print use.

**(148 words — within the optimal 134-167 range, self-contained, fact-rich, citable)**

---

## Server-Side Rendering Check

### Critical Finding: Most Content is Client-Rendered

| Component | Directive | AI Crawler Impact |
|-----------|-----------|-------------------|
| Homepage layout, metadata, schema | Server | Visible |
| `HeroSection` | Server | Visible |
| `About.tsx` (landing) | `'use client'` | **HIDDEN** |
| `Services.tsx` (landing) | `'use client'` | **HIDDEN** |
| `ProcessSection.tsx` (landing) | `'use client'` | **HIDDEN** |
| `FAQ.tsx` (landing) | `'use client'` | **HIDDEN** |
| `Portfolio.tsx` (landing) | `'use client'` | **HIDDEN** |
| `Clients.tsx` (landing) | `'use client'` | **HIDDEN** |
| `Contact.tsx` (landing) | `'use client'` | **HIDDEN** |
| `AboutClient.tsx` (about page) | `'use client'` | **HIDDEN** |
| `ServicesClient.tsx` (services page) | `'use client'` | **HIDDEN** |
| Blog page (PostsGrid) | Server | Visible |
| Blog post detail | Server | Visible |

**Impact:** AI crawlers (GPTBot, ClaudeBot, PerplexityBot) do **not** execute JavaScript. They see only the server-rendered HTML. This means:

- The **homepage** appears to AI crawlers as mostly a hero section with metadata — the About, Services, Process, FAQ, Portfolio, Clients, and Contact sections are **invisible**
- The **Services page** appears as metadata + schema markup only — the actual service details are invisible
- The **About page** appears as metadata + schema markup only — the founder story, values, and disciplines are invisible
- **Blog pages** are the most AI-accessible content on the site

**This is the single highest-impact issue in this analysis.**

---

## Top 5 Highest-Impact Changes

### 1. Convert Key Content from CSR to SSR (Critical)

**Impact:** Transforms the site from ~20% AI-visible to ~90% AI-visible
**Effort:** Medium

The most impactful thing you can do: extract static text content from `'use client'` components into server components. Keep animations and interactivity client-side, but render the actual text server-side.

**Priority components:**
- `About.tsx` — founder story, statistics, mission
- `Services.tsx` — service categories, descriptions
- `FAQ.tsx` — questions and answers
- `ProcessSection.tsx` — the 4-step process

**Pattern:** Use composition — server component renders text, wraps children in client component for animations:

```tsx
// Server component (AI-visible)
export default function About() {
  return (
    <section>
      <h2>About The Coast</h2>
      <p>The Coast is a brand design studio...</p>
      <AnimationWrapper> {/* client component for motion */}
        <StatCard number="50+" label="Projects Delivered" />
      </AnimationWrapper>
    </section>
  )
}
```

### 2. Create 134-167 Word Citable Answer Blocks (High Impact)

**Impact:** Enables AI citation for core queries like "brand design studio," "brand identity services," "affordable branding"
**Effort:** Medium

Add substantive, self-contained paragraphs to key pages:
- Homepage About section: "What is The Coast?"
- Services page: Per-service educational blocks
- About page: "What makes a good brand identity?"
- Blog: Topical authority articles with citable passages

### 3. Build External Brand Presence (High Impact, Ongoing)

**Impact:** Addresses the 3× stronger correlation between brand mentions and AI visibility
**Effort:** High (ongoing)

**Immediate actions:**
- Create a Clutch profile (B2B services directory — feeds AI systems)
- Create Dribbble and Behance portfolios (design industry signals)
- Start a YouTube channel with brand process videos
- Write and submit to Reddit communities (r/smallbusiness, r/Entrepreneur, r/graphic_design)
- Contribute to Wikipedia articles about brand design topics (do not create a self-promotional article)

### 4. Expand FAQ Answers to Citable Length (Medium Impact)

**Impact:** FAQ content matches the exact query patterns AI systems answer
**Effort:** Low

Expand each FAQ answer from ~32 words to 134-167 words with:
- Specific details and examples
- Statistics with sources
- Step-by-step explanations
- References to The Coast's approach

### 5. Add Question-Based H2/H3 Headings (Medium Impact)

**Impact:** Question headings match AI query patterns directly
**Effort:** Low

Transform headings from declarative to interrogative:
- "Our Process" → "How Does The Coast's Brand Design Process Work?"
- "What We Do" → "What Brand Design Services Does The Coast Offer?"
- "About" → "What Is The Coast and Who Is It For?"
- "Pricing" → "How Much Does Professional Branding Cost?"

---

## Schema Recommendations for AI Discoverability

### Currently Implemented (Good)
- `WebSite` with SearchAction
- `Organization` with sameAs links
- `ProfessionalService` with contact info
- `ItemList` for services and pricing
- `BreadcrumbList` on subpages
- `AboutPage` and `ContactPage`

### Missing / Recommended Additions

1. **`FAQPage` schema** — Add to homepage and dedicated FAQ (if created). This directly feeds AI Overviews.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is your typical project timeline?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our engagements typically range from 2 to 6 weeks..."
      }
    }
  ]
}
```

2. **`Person` schema for David Coast** — Establishes founder entity for AI knowledge graphs.

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "David Coast",
  "jobTitle": "Founder & Creative Director",
  "worksFor": { "@id": "https://www.coastglobal.org/#organization" },
  "sameAs": ["https://www.linkedin.com/in/davidcoast"]
}
```

3. **`Service` schema per service** — Individual service schemas with descriptions, price ranges, and provider info.

4. **`Article` / `BlogPosting` schema on blog posts** — Confirm JSON-LD is present on blog post pages (not just OpenGraph metadata).

5. **`Review` / `AggregateRating` schema** — If you have Google Reviews collection, expose rating data.

---

## Content Reformatting Suggestions

### Homepage — About Section

**Current (hidden in CSR, ~56 words):**
> "We are a collective of designers, strategists, and creatives building unforgettable brands for entrepreneurs and growing businesses."

**Recommended (SSR, 152 words):**
> The Coast is a brand design studio that makes professional branding affordable and accessible for small businesses, entrepreneurs, startups, and artists. Founded by David Coast, the studio was built on a simple observation: most small businesses fail not because they lack talent, but because they are invisible. Professional branding has traditionally been locked behind agency budgets that most entrepreneurs cannot touch — retainers starting at $10,000 per month with the largest firms. The Coast changed that equation by offering the same caliber of brand identity work — custom logo design, comprehensive brand guidelines, marketing collateral, and digital presence — at prices that make sense for growing businesses. With over 50 projects delivered across healthcare, e-commerce, tech, food and beverage, and entertainment, The Coast's four-step process (Discover, Design, Develop, Launch) typically delivers complete brand transformations in 2 to 6 weeks.

### FAQ — "What is your pricing structure?"

**Current (36 words):**
> "We price based on value and scope, not hourly rates. Every project is unique, and we construct custom proposals after a discovery session. We also offer monthly retainer packages."

**Recommended (147 words):**
> The Coast offers two pricing models to fit different business needs. For project-based work, pricing is determined by scope and value rather than hourly rates — a logo design package starts at a different price point than a full rebrand with brand guidelines, website design, and marketing collateral. Every project begins with a free discovery session where we assess your needs, timeline, and budget to create a custom proposal. For ongoing support, The Coast offers three monthly retainer tiers: the Starter plan (free) for freelancers and creative beginners includes up to 5 design projects and basic brand kit tools; the Professional plan ($25/month) provides unlimited projects, complete brand management, and team collaboration; and the Enterprise plan ($250/month) adds a dedicated creative strategist, white-label design system, and 24/7 premium support. Most single projects range from 2 to 6 weeks from kickoff to delivery.

### Services Page — Logo Design

**Current (8 words):**
> "Custom logo with 3 concepts & 2 revision rounds"

**Recommended (add a 140-word educational block below the service listing):**
> A professional logo is the cornerstone of any brand identity — it is the single most-seen element of your business, appearing on everything from your website and social media profiles to business cards, packaging, and signage. The Coast's logo design process begins with a discovery session to understand your business, target audience, competitors, and brand personality. From there, our designers develop three distinct logo concepts, each exploring a different creative direction informed by your brand strategy. You select your preferred direction, and we refine it through two rounds of revisions until every detail — from letterform spacing to color balance — is precisely right. The final deliverable includes your logo in all standard formats (SVG, PNG, PDF, EPS) optimized for both digital and print use, along with a basic usage guide covering minimum sizes, spacing rules, and color variations.

---

## Quick Wins Checklist

- [ ] Add `OAI-SearchBot` and `ChatGPT-User` to robots.txt Allow rules
- [ ] Update llms.txt URLs from `coastglobal.org` to `www.coastglobal.org`
- [ ] Sync llms.txt pricing with actual pricing page
- [ ] Add publication/update dates to all static pages
- [ ] Add `FAQPage` JSON-LD schema to homepage
- [ ] Add `Person` schema for David Coast on about page
- [ ] Add question-based H2/H3 headings to key sections
- [ ] Add "What is [topic]?" definitions in first 60 words of each page section

## Medium Effort

- [ ] Refactor landing page components to render text content server-side (SSR)
- [ ] Expand all FAQ answers to 134-167 words
- [ ] Create `/llms-full.txt` with expanded content
- [ ] Add `BlogPosting` JSON-LD to blog post pages
- [ ] Create Clutch, Dribbble, and Behance profiles
- [ ] Implement IndexNow for Bing Copilot visibility
- [ ] Add author bios with credentials and LinkedIn links to blog posts

## High Impact (Ongoing)

- [ ] Start YouTube channel with brand process/case study videos
- [ ] Build Reddit presence in relevant communities
- [ ] Create original research (e.g., "State of Small Business Branding 2026" survey)
- [ ] Develop unique interactive tools (brand name generator, color palette builder)
- [ ] Pursue press coverage in design publications (It's Nice That, The Brand Identity, etc.)
- [ ] Contribute expertise to Wikipedia articles on brand design topics
- [ ] Implement comprehensive `sameAs` entity linking across all platforms

---

*Generated by GEO Analysis — March 25, 2026*
