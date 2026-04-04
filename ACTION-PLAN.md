# SEO Action Plan: coastglobal.org

**Generated:** 2026-04-04
**Current Score:** 58/100
**Target Score:** 80+/100

---

## CRITICAL -- Fix Immediately (Expected impact: +15-20 points)

### 1. Eliminate or drastically shorten the Preloader
**File:** `src/components/Preloader.tsx`
**Impact:** LCP improvement from ~4-6s to <2.5s
**Effort:** Medium

The GSAP preloader adds 3-4 seconds of delay before any content is visible, pushing LCP into "Poor" range. Options:
- **Best:** Remove entirely and let hero animations play directly on mount
- **Good:** Only show on first visit (use `sessionStorage` flag), skip on return visits
- **Minimum:** Reduce total animation to under 1 second

### 2. Complete the 4 unfinished portfolio case studies
**Files:** `src/app/(frontend)/work/[projectId]/page.tsx` + project data
**Impact:** E-E-A-T Experience score, content depth
**Effort:** High (content creation required)

AMG Records, OgaTicket, Hatch Startup Nation, and Prospry all render "Under Construction." Each needs:
- 500-1,000 words covering problem, approach, deliverables, results
- Client testimonial or quote
- Before/after visuals where applicable
- `CreativeWork` JSON-LD schema

### 3. Fix the dual sitemap generator conflict
**Files:** `src/app/sitemap.ts`, `next-sitemap.config.cjs`, `public/sitemap.xml`, `public/sitemap-0.xml`
**Impact:** Blog posts discoverable in sitemap, correct URL coverage
**Effort:** Low

**Recommended approach:** Keep `src/app/sitemap.ts` (it already queries Payload for blog posts) and:
- Delete `public/sitemap.xml` and `public/sitemap-0.xml`
- Delete `next-sitemap.config.cjs`
- Remove `next-sitemap` from `package.json` dependencies
- Add `/offers-tools/*` exclusion to `src/app/sitemap.ts`
- Add portfolio project URLs by querying Payload `projects` collection

### 4. Consolidate hero videos (remove one)
**Files:** `src/components/HeroBackgroundVideo.tsx`, `src/components/LazyHeroVideo.tsx`
**Impact:** LCP, bandwidth, performance
**Effort:** Low-Medium

Two videos compete for bandwidth. Choose one:
- **Option A:** Keep only `LazyHeroVideo` with compressed MP4 (<3MB) + poster image
- **Option B:** Keep HLS via `HeroBackgroundVideo` but change `preload="auto"` to `preload="none"` and defer `hls.js` initialization

Also compress `coastVid.mp4` from 16MB to <3MB (lower resolution, H.265/AV1 codec, reduced bitrate).

### 5. Server-render the Pricing page
**File:** `src/app/(frontend)/pricing/page.tsx`
**Impact:** Indexability of pricing content
**Effort:** Medium

Refactor to render pricing tier content as a server component. Only interactive elements (toggle switches, CTAs) should be client components.

---

## HIGH -- Fix Within 1 Week (Expected impact: +10-15 points)

### 6. Remove or replace placeholder client names
**File:** `src/components/pages/landingPage/Clients.tsx`
**Impact:** E-E-A-T Trustworthiness
**Effort:** Low

"Brand Builders," "Empire Studios," "Vision Labs," "Nova Creative" appear fabricated. Replace with verified client names or remove entirely. Fake social proof is a severe trust penalty.

### 7. Fix schema validation errors (quick wins)
**Files:** `src/app/(frontend)/page.tsx`, `src/app/(frontend)/services/page.tsx`
**Impact:** Rich results eligibility, structured data quality
**Effort:** Low (15 minutes total)

- [ ] Change `foundingDate: '2023-02'` to `'2023-02-01'`
- [ ] Remove entire `faqSchema` object and its `<script>` tag (FAQPage restricted to gov/health sites)
- [ ] Remove `SearchAction` from `websiteSchema` (no `/search` route exists)
- [ ] Add `description` to Organization schema
- [ ] Fix `areaServed: 'World'` to `{ "@type": "Place", "name": "World" }`
- [ ] Expand Services ItemList from 8 to all 11 services with descriptions

### 8. Add missing schemas to Blog and Work pages
**Files:** `src/app/(frontend)/blog/page.tsx`, `src/app/(frontend)/work/page.tsx`, `src/app/(frontend)/work/[projectId]/page.tsx`, `src/app/(frontend)/blog/[slug]/page.tsx`
**Impact:** Structured data coverage, breadcrumb trails in SERPs
**Effort:** Low-Medium

- [ ] `/blog`: Add `CollectionPage` + `BreadcrumbList` schemas
- [ ] `/work`: Add `CollectionPage` + `BreadcrumbList` schemas
- [ ] `/work/[id]`: Add `CreativeWork` + `BreadcrumbList` schemas
- [ ] `/blog/[slug]`: Add `BreadcrumbList`, plus `url`, `articleSection`, `keywords`, `inLanguage` to BlogPosting

### 9. Fix CustomCursor performance issue
**File:** `src/components/CustomCursor.tsx`
**Impact:** INP improvement
**Effort:** Medium

Replace `MutationObserver` + `querySelectorAll` pattern with CSS-only hover effects or event delegation on a single parent. The current approach runs expensive DOM queries on every DOM mutation.

Also: only load `CustomCursor` on non-touch devices (`matchMedia('(hover: hover)')`).

### 10. Use `next/image` for blog post cover images
**File:** `src/app/(frontend)/blog/[slug]/page.tsx` (line ~198)
**Impact:** LCP on blog posts, image optimization
**Effort:** Low

Replace raw `<img>` tags with `next/image` for automatic optimization, responsive sizing, and lazy loading.

### 11. Fix pricing naming inconsistency
**File:** `src/components/pricing.tsx` + FAQ data
**Impact:** Trustworthiness, user clarity
**Effort:** Low

Unify tier names: either "Creator/Studio/Agency Pro" everywhere or "Starter/Professional/Enterprise" everywhere. Also fix the "Upgrade to Studio" button text on the Agency Pro tier.

---

## MEDIUM -- Fix Within 1 Month (Expected impact: +5-10 points)

### 12. Add persistent mobile CTA
**File:** `src/components/header.tsx`
**Impact:** Mobile conversion, CTA visibility
**Effort:** Low

The "Start Project" button is desktop-only. Add a visible CTA in the mobile header or a sticky bottom bar.

### 13. Fix noise overlay z-index vs mobile nav
**Files:** `src/components/Noise.tsx` (z-50), `src/components/mobile-nav.tsx` (z-40)
**Impact:** Mobile navigation usability
**Effort:** Low

Either increase mobile nav z-index above 50 or decrease Noise z-index.

### 14. Fix low text contrast
**File:** `src/app/(frontend)/styles.css` + component files
**Impact:** Accessibility (WCAG AA), readability
**Effort:** Medium

- `text-white/50` and `text-muted-foreground/60` on dark backgrounds likely fail WCAG AA
- Portfolio card tags at `text-[10px]` with 60% opacity
- Increase minimum opacity to 70-80% for body text

### 15. Add `Content-Security-Policy` header
**File:** `next.config.mjs`
**Impact:** Security, trust signals for some scanners
**Effort:** Medium

Start with report-only mode, then enforce. At minimum restrict `script-src` to `'self'` and Google Tag Manager domain.

### 16. Publish 15-20 more blog articles
**Impact:** Topical authority, AI citation readiness, long-tail traffic
**Effort:** High (content creation)

Target topics: brand design process, logo design guide, branding ROI, when to rebrand, brand identity checklist, branding for [industry] series. Each 1,500+ words with original insights.

### 17. Add founder credentials and author bios
**Files:** `src/app/(frontend)/about/page.tsx`, `src/app/(frontend)/blog/[slug]/page.tsx`
**Impact:** E-E-A-T Expertise
**Effort:** Low-Medium

Create substantive bio for David Coast with professional background, experience, and credentials. Add author bio sections to blog posts.

### 18. Server-render Google Reviews
**File:** `src/components/pages/landingPage/GoogleReviews.tsx`
**Impact:** Reviews visible to crawlers, E-E-A-T Trust signals
**Effort:** Medium

Reviews are fetched client-side via `useQuery` and invisible to crawlers. Server-render them or implement `AggregateRating` schema.

### 19. Fix sitemap `lastmod` values
**File:** `src/app/sitemap.ts`
**Impact:** Crawl priority signals
**Effort:** Low

Use fixed dates for static pages (or git commit dates) instead of `new Date()`. Blog posts already use `updatedAt` correctly.

### 20. Improve touch target sizes
**Files:** `src/components/ui/ShineButton.tsx`, `src/components/mobile-nav.tsx`
**Impact:** Mobile usability
**Effort:** Low

Increase `ShineButton` `size="sm"` to minimum 48px height. Increase mobile nav toggle from 40px to 48px.

### 21. Remove duplicate motion library
**File:** `package.json`
**Impact:** Bundle size reduction
**Effort:** Low

Both `framer-motion` and `motion` (v12) are listed. `motion` IS Framer Motion v12 renamed. Remove `framer-motion` and ensure all imports use `motion/react`.

---

## LOW -- Backlog (Expected impact: +2-5 points)

### 22. Create individual service pages
**Impact:** Keyword targeting for 11 services
**Effort:** High

Each service should have its own URL (e.g., `/services/logo-design`) with 800+ words.

### 23. Add physical address
**Impact:** Trustworthiness, local SEO
**Effort:** Low

Even city/state improves trust. Update Organization schema with `PostalAddress`.

### 24. Replace SVG noise filter with static texture
**File:** `src/components/Noise.tsx`
**Impact:** GPU performance
**Effort:** Low

Use a CSS `background-image` with a pre-rendered noise PNG/WebP instead of live `feTurbulence`.

### 25. Add `Suspense` fallback for BlogPreview
**File:** `src/app/(frontend)/page.tsx` (line ~171)
**Impact:** CLS prevention
**Effort:** Low

Add a skeleton placeholder matching expected dimensions.

### 26. Reduce Inter font weights
**File:** `src/app/(frontend)/layout.tsx`
**Impact:** Font payload reduction
**Effort:** Low

Reduce from 5 weights (300, 400, 500, 600, 700) to 2-3 actually used.

### 27. Remove `priority` from footer logo
**File:** `src/components/footer.tsx`
**Impact:** Free up preload slot for LCP resources
**Effort:** 1 minute

### 28. Add `llms.txt` for AI crawler guidance
**Impact:** AI search readiness
**Effort:** Low

Create a `public/llms.txt` file describing the site's purpose, services, and key content for AI crawlers.

### 29. Add contextual internal links in body content
**Impact:** Link equity distribution, user navigation
**Effort:** Medium

Blog posts should link to relevant services. Services should link to related portfolio items. Portfolio should link back to services.

### 30. Set `TextReveal` viewport to `once: true`
**File:** `src/components/TextReveal.tsx` (line 44)
**Impact:** Reduced animation work, CLS prevention
**Effort:** 1 minute

---

## Implementation Timeline

### Week 1 (Critical + Quick Wins)
- [ ] Items 1, 3, 4, 5, 7, 10, 11, 27

### Week 2 (High Priority)
- [ ] Items 6, 8, 9, 12, 13, 21

### Week 3-4 (Medium Priority)
- [ ] Items 14, 15, 17, 18, 19, 20, 25, 26, 30

### Ongoing (Content Creation)
- [ ] Item 2 (portfolio case studies)
- [ ] Item 16 (blog articles)
- [ ] Item 22 (service pages)
- [ ] Item 29 (internal linking)

---

## Expected Score After Full Implementation

| Category | Current | After Critical | After All |
|----------|---------|---------------|-----------|
| Technical SEO | 82 | 88 | 92 |
| Content Quality | 62 | 62 | 82 |
| On-Page SEO | 72 | 76 | 85 |
| Schema | 68 | 82 | 90 |
| Performance | 45 | 72 | 82 |
| Images | 78 | 82 | 88 |
| AI Readiness | 58 | 62 | 78 |
| **Weighted Total** | **68.5** | **76** | **85+** |
