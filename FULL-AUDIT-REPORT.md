# Full SEO Audit Report: coastglobal.org

**Date:** 2026-04-04
**Business Type:** Brand Design Studio / Creative Agency
**Framework:** Next.js 16 (App Router) + Payload CMS + Tailwind CSS v4
**Domain:** coastglobal.org

---

## Executive Summary

### Overall SEO Health Score: 58/100

| Category | Weight | Score | Weighted |
|----------|--------|-------|----------|
| Technical SEO | 25% | 82/100 | 20.5 |
| Content Quality | 25% | 62/100 | 15.5 |
| On-Page SEO | 20% | 72/100 | 14.4 |
| Schema / Structured Data | 10% | 68/100 | 6.8 |
| Performance (CWV) | 10% | 45/100 | 4.5 |
| Images | 5% | 78/100 | 3.9 |
| AI Search Readiness | 5% | 58/100 | 2.9 |
| **Total** | **100%** | | **68.5** |

### Top 5 Critical Issues

1. **Preloader blocks LCP for ~4 seconds** -- All page content is hidden behind a GSAP animation, pushing Largest Contentful Paint into the "Poor" range (>4s)
2. **4 of 5 portfolio case studies are placeholders** -- 80% of work pages render "Under Construction," destroying E-E-A-T Experience signals
3. **Dual sitemap generators conflict** -- Static `next-sitemap` output shadows the dynamic `src/app/sitemap.ts`, causing blog posts to be missing from the crawled sitemap
4. **Pricing page is fully client-rendered** -- Googlebot sees minimal server-rendered content, risking delayed or incomplete indexation
5. **Two concurrent hero videos compete for bandwidth** -- HLS background video with `preload="auto"` + 16MB MP4 lazy video both load near-simultaneously

### Top 5 Quick Wins

1. **Fix `foundingDate` in Organization schema** -- Change `"2023-02"` to `"2023-02-01"` (1 minute fix)
2. **Remove FAQPage schema** -- Google restricted this to gov/health sites in Aug 2023; it will never generate rich results (1 minute fix)
3. **Remove `priority` from footer logo** -- Wastes a preload slot on a below-fold element (1 minute fix)
4. **Remove `SearchAction` from WebSite schema** -- Points to non-existent `/search` route (1 minute fix)
5. **Add BreadcrumbList schema to `/blog` and `/work`** -- Missing structured data on two key pages (10 minute fix)

---

## 1. Technical SEO -- Score: 82/100

### 1.1 Crawlability (90/100)

**Strengths:**
- Well-configured `robots.txt` with sensible disallow rules for `/admin`, `/api`, `/portal`, `/payment-success`, `/subscription-success`, `/intake`
- Smart AI crawler management: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot allowed; Bytespider and CCBot blocked
- Sitemap referenced in robots.txt
- Google Search Console verification present

**Issues:**
- `robots.txt` blocks `anthropic-ai` but allows `ClaudeBot` -- inconsistent (may be intentional)
- Sitemap uses `lastModified: new Date()` for all static pages, reducing signal quality
- `/offers-tools/*` internal rewrite paths discoverable by crawlers

### 1.2 Indexability (88/100)

**Strengths:**
- Every page has unique, descriptive `<title>` tags
- Canonical URLs set on all pages via `alternates.canonical`
- Layout-level `robots: { index: true, follow: true }` with generous googleBot directives
- `metadataBase` correctly set to `https://coastglobal.org`

**Issues:**
- `/work` page is thin content (~300 words), fully client-rendered
- `/blog` listing has no JSON-LD structured data
- `SearchAction` points to non-existent `/search` route
- Homepage title inconsistency: layout default "Full-Stack Creative Ecosystem" vs page override "Brand Design Studio"

### 1.3 Security (95/100)

**Strengths:**
- Comprehensive security headers in `next.config.mjs`:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `poweredByHeader: false` (no information disclosure)

**Issues:**
- No `Content-Security-Policy` header -- single most impactful missing security header

### 1.4 URL Structure (92/100)

**Strengths:**
- Clean, lowercase, hyphenated URLs
- Meaningful dynamic slugs (`/blog/[slug]`, `/work/[projectId]`)
- Proper 404 catch-all with helpful internal links
- Clean subdomain routing via `proxy.ts`

**Issues:**
- `/brand-avatar` in sitemap but not in navigation (orphan page risk)
- `/#contact` anchor in nav treated as homepage by search engines

### 1.5 JavaScript Rendering (75/100)

**Strengths:**
- Server Components by default (App Router)
- Blog content server-side fetched from Payload CMS
- JSON-LD rendered server-side via `dangerouslySetInnerHTML`
- `generateStaticParams()` for portfolio pages

**Issues:**
- `/pricing` entirely client-rendered via `PricingClient` component
- `/work` entirely client-rendered via `WorkPageContent`
- `/get-started` rendered via `GetStartedClient`
- `/vision` uses raw `<img>` tags with `onError` handlers (JS-dependent)
- Homepage uses `dynamic()` for 8 sections (verify SSR output includes content)

---

## 2. Content Quality -- Score: 62/100

### 2.1 E-E-A-T Assessment (63/100)

| Signal | Score | Notes |
|--------|-------|-------|
| Experience | 14/20 | Real portfolio clients but 4/5 case studies are placeholders |
| Expertise | 16/25 | Educational content present but no author credentials or citations |
| Authoritativeness | 13/25 | Good schema but no external citations, press mentions, or industry recognition |
| Trustworthiness | 20/30 | Transparent pricing and contact info but no physical address |

### 2.2 Page-by-Page Content Scores

| Page | Words | Score | Issues |
|------|-------|-------|--------|
| Homepage | ~1,500 | 72/100 | Good structure, strong FAQ section |
| /services | ~1,200 | 68/100 | Educational sections good, service descriptions too terse |
| /about | ~1,200 | 70/100 | Founder section lacks depth, no credentials |
| /blog | ~400 | 45/100 | Only 4 articles, thin listing page |
| /work | ~300 | 38/100 | **Thin content** -- 4/5 projects are placeholders |
| /pricing | ~400 | 52/100 | Naming inconsistency (Creator/Studio/Agency Pro vs Starter/Professional/Enterprise in FAQ) |
| /get-started | ~150 | 55/100 | Acceptable for a form page, but lacks trust signals |

### 2.3 Critical Content Gaps

1. **Portfolio case studies** -- Only Zapped Co is complete. AMG Records, OgaTicket, Hatch Startup Nation, and Prospry all render "Under Construction." Each needs 500-1,000 words with problem/approach/deliverables/results.
2. **Suspected placeholder client names** -- "Brand Builders," "Empire Studios," "Vision Labs," "Nova Creative" in the client marquee appear fabricated. Fake social proof is a severe trust penalty.
3. **Blog volume** -- 4 articles for a 3+ year old studio is extremely thin. Need 20-30 minimum for topical authority.
4. **No individual service pages** -- 11 services share a single `/services` URL. Each should have its own page for keyword targeting.
5. **Google Reviews are client-side only** -- `GoogleReviews.tsx` fetches via `useQuery`, making reviews invisible to crawlers.

---

## 3. On-Page SEO -- Score: 72/100

### 3.1 Title Tags

| Page | Title | Length | Verdict |
|------|-------|--------|---------|
| Homepage | The Coast \| Brand Design Studio | 35 chars | Good |
| /services | Brand Design Services \| The Coast | 37 chars | Good |
| /about | About The Coast \| The Coast | 29 chars | Redundant "The Coast" |
| /blog | The Coast Journal -- Brand Design Insights \| The Coast | 55 chars | Good |
| /work | Our Work -- Brand Transformations \| The Coast | 47 chars | Good |
| /pricing | Pricing & Packages \| The Coast | 32 chars | Good |
| /get-started | Get Started \| The Coast | 25 chars | Could be more descriptive |

### 3.2 Meta Descriptions

All pages have unique meta descriptions. Quality is generally good with clear value propositions and appropriate length (120-160 chars).

### 3.3 Heading Structure

- All pages have exactly one H1 -- correct
- Logical H2/H3 hierarchy across most pages
- Homepage heading "DESIGN THE FUTURE" is impactful but not keyword-rich

### 3.4 Internal Linking

**Strengths:**
- Consistent navigation across all pages (Services, Work, Blog, About, Offers, Contact)
- Footer includes additional links (Pricing, Vision, Privacy, Terms)
- CTA buttons link to /get-started and /pricing

**Issues:**
- No contextual internal links within body content (e.g., blog posts linking to services, services linking to portfolio)
- `/brand-avatar` and `/brand-builder` are orphan pages (in sitemap but not navigation)

---

## 4. Schema / Structured Data -- Score: 68/100

### 4.1 Current Implementation

| Page | Schemas Present | Status |
|------|----------------|--------|
| Homepage | WebSite, Organization, ProfessionalService, FAQPage | FAQPage will never render rich results |
| /services | ItemList (8 of 11 services), BreadcrumbList | Missing 3 services |
| /about | AboutPage, Person, BreadcrumbList | Person missing `@id`, `image` |
| /blog | **None** | Missing CollectionPage + BreadcrumbList |
| /blog/[slug] | BlogPosting | Missing BreadcrumbList, `url`, `articleSection` |
| /work | **None** | Missing CollectionPage + BreadcrumbList |
| /work/[id] | **None** | Missing CreativeWork + BreadcrumbList |
| /pricing | ItemList (Offers), BreadcrumbList | Good |
| /get-started | ContactPage, BreadcrumbList | Good |
| /offers | ItemList (WebApplication), BreadcrumbList | Good |

### 4.2 Validation Errors

- `foundingDate: "2023-02"` -- Invalid ISO 8601 (needs day: `"2023-02-01"`)
- `areaServed: "World"` -- Should be `{ "@type": "Place", "name": "World" }`
- `SearchAction` target `/search` route does not exist
- FAQPage restricted to gov/health sites since August 2023 -- remove entirely
- Services ItemList has 8 items but page shows 11 services

---

## 5. Performance (Core Web Vitals) -- Score: 45/100

### Estimated Metrics

| Metric | Estimated | Rating | Target |
|--------|-----------|--------|--------|
| LCP | 4.0-6.0s | Poor | <2.5s |
| INP | 250-400ms | Needs Improvement | <200ms |
| CLS | 0.05-0.15 | Borderline | <0.1 |

### 5.1 LCP Blockers

1. **GSAP Preloader** (~3-4s of hidden content) -- `src/components/Preloader.tsx`
2. **Dual hero videos** -- HLS via `HeroBackgroundVideo.tsx` with `preload="auto"` + 16MB MP4 via `LazyHeroVideo.tsx`
3. **No preload for hero poster image** (`/preview.jpg`)
4. **Blog post cover images use raw `<img>`** instead of `next/image`

### 5.2 INP Risks

1. **CustomCursor MutationObserver** -- Watches entire DOM, runs `querySelectorAll` on every mutation -- `src/components/CustomCursor.tsx`
2. **Three animation libraries** simultaneously: motion/react, GSAP, hls.js
3. **PageTransition GSAP timeline** blocks main thread during navigation
4. **Possible duplicate bundling** of `framer-motion` and `motion` (both in package.json)

### 5.3 CLS Risks

1. Hero content shift after preloader reveal
2. `BlogPreview` wrapped in `<Suspense>` without fallback
3. Font swap (FOUT) from Inter and Anton loading

### 5.4 Resource Concerns

- `coastVid.mp4` is 16MB (should be <3MB)
- `hls.js` (~70KB gzipped) loaded eagerly for background video
- Inter font loads 5 weights (300, 400, 500, 600, 700) -- likely only needs 2-3
- Footer logo has `priority` attribute (wastes preload slot on below-fold element)
- Full-screen SVG `feTurbulence` noise filter on every page (GPU-intensive)

---

## 6. Images -- Score: 78/100

**Strengths:**
- Portfolio images use `next/image` with `fill`, `sizes`, and `alt` attributes
- Header logos use `next/image` with explicit dimensions and `priority`
- Decorative SVGs use `aria-hidden`

**Issues:**
- Blog post cover images use raw `<img>` tags (bypasses optimization)
- Footer logo has unnecessary `priority` attribute
- Client marquee logos may use raw `<img>` tags with external URLs
- No WebP/AVIF format enforcement for portfolio PNGs

---

## 7. AI Search Readiness -- Score: 58/100

**Strengths:**
- FAQ content is highly quotable with specific numbers and timelines
- Educational sections on Services and About pages are well-structured
- Comprehensive schema markup aids entity extraction
- AI crawlers (GPTBot, ClaudeBot, PerplexityBot) are allowed in robots.txt
- Clear heading hierarchy across all pages

**Issues:**
- Blog volume too low (4 articles) for topical authority
- Statistics lack citations ("98% satisfaction," "50+ projects" are unverifiable)
- No structured comparison tables or definition lists
- No "About the Author" content on blog posts
- Google Reviews invisible to AI crawlers (client-side only)
- No `llms.txt` file for AI crawler guidance

---

## 8. Sitemap Analysis

### 8.1 Dual Generator Conflict

Two competing sitemap generators exist:
1. `src/app/sitemap.ts` -- Next.js dynamic sitemap (queries Payload for blog posts)
2. `next-sitemap.config.cjs` + `public/sitemap.xml` -- Build-time static generator

The static files in `public/` shadow the dynamic route, making `src/app/sitemap.ts` dead code. Blog posts are missing from the crawled sitemap as a result.

### 8.2 Problematic URLs in Sitemap

- `/offers-tools`, `/offers-tools/3-second-test`, `/offers-tools/brand-checklist`, `/offers-tools/brand-quiz` -- Internal rewrite paths for `offers.coastglobal.org` subdomain; should NOT be in the main sitemap
- All `lastmod` values are build-time timestamps (not real content dates)
- 1 blog article on the site not in the sitemap

### 8.3 Missing URLs

- Individual blog post URLs (zero in build-time sitemap)
- `/offers` page (in nav but absent from live sitemap)

---

## 9. Visual & Mobile Analysis

### 9.1 Mobile Responsiveness

**Strengths:**
- Responsive design with Tailwind breakpoints throughout
- Mobile navigation with hamburger menu and full-screen overlay
- Fluid typography using `clamp()` for hero heading
- Dynamic viewport units (`dvh`) for mobile hero height
- Horizontal overflow prevention (`overflow-x-clip`)

**Issues:**
- No persistent mobile CTA -- "Start Project" button is desktop-only; mobile users must open hamburger menu
- Touch targets below 48px minimum: `ShineButton` at `size="sm"` (~32px height), mobile nav toggle (40px)
- Noise overlay at `z-50` renders above mobile nav at `z-40`
- CTA variant inconsistency between desktop and mobile (primary/ghost swap)

### 9.2 Accessibility Concerns

- Low text contrast: `text-white/50`, `text-muted-foreground/60` on dark background likely fail WCAG AA
- `cursor: none` on body/html -- if custom cursor JS fails, desktop users have no cursor
- Scrollbar hidden globally -- removes important navigation cue for keyboard/accessibility users
- Portfolio card tags use `text-[10px]` at 60% opacity

### 9.3 Above-the-Fold Timing

| Event | Time from Page Load |
|-------|-------------------|
| Preloader starts | 0s |
| Preloader completes | ~3-4s |
| Hero text begins animating | ~3.1-4.1s |
| Hero text fully visible | ~4.3-5.3s |
| CTA buttons visible | ~5-6s |

Users see no meaningful content or actionable CTA for approximately 5-6 seconds on first visit.

---

## Key Files Referenced

| File | Relevance |
|------|-----------|
| `src/app/(frontend)/layout.tsx` | Root layout, fonts, metadata, preloader, analytics |
| `src/app/(frontend)/page.tsx` | Homepage with 4 JSON-LD schemas, dynamic imports |
| `src/app/(frontend)/styles.css` | All CSS, theme, keyframes, cursor rules |
| `src/components/Preloader.tsx` | GSAP preloader (LCP blocker) |
| `src/components/hero.tsx` | Hero structure, CTA placement |
| `src/components/hero-animations.tsx` | Animation timing, preloader sync |
| `src/components/HeroBackgroundVideo.tsx` | Eager HLS video loading |
| `src/components/LazyHeroVideo.tsx` | Lazy-loaded MP4 video |
| `src/components/CustomCursor.tsx` | MutationObserver (INP risk) |
| `src/components/Noise.tsx` | SVG noise overlay (z-index, GPU) |
| `src/components/header.tsx` | Navigation, desktop-only CTA |
| `src/components/mobile-nav.tsx` | Mobile navigation (z-40) |
| `src/components/PageTransition.tsx` | GSAP page transitions |
| `src/components/pages/landingPage/Clients.tsx` | Client marquee (placeholder names) |
| `src/components/pages/landingPage/GoogleReviews.tsx` | Client-side reviews (not crawlable) |
| `src/components/pricing.tsx` | Pricing tiers (naming mismatch) |
| `src/app/(frontend)/blog/[slug]/page.tsx` | Blog post template (raw img) |
| `src/app/(frontend)/work/page.tsx` | Work page (thin + client-rendered) |
| `src/app/(frontend)/pricing/page.tsx` | Pricing page (fully client-rendered) |
| `src/app/sitemap.ts` | Dynamic sitemap (shadowed/dead) |
| `next-sitemap.config.cjs` | Build-time sitemap config (active) |
| `public/sitemap-0.xml` | Static sitemap with 21 URLs |
| `public/robots.txt` | Robots file |
| `src/proxy.ts` | Subdomain rewrite logic |
| `next.config.mjs` | Security headers, image config |
