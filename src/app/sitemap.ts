import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { MetadataRoute } from 'next'
import { BLOG_CATEGORIES } from '@/lib/blog-categories'
import { CASE_STUDIES } from '@/lib/case-studies'
import { SERVICE_PAGES } from '@/lib/service-pages'
import { LOCATION_PAGES } from '@/lib/location-pages'

const BASE_URL = 'https://coastglobal.org'

// Last date the site-wide content actually changed. Google only trusts an
// accurate <lastmod> (it ignores priority/changefreq) and uses it as a recrawl
// signal - stamping it tells Google the rebranded/edited pages are fresh. BUMP
// THIS whenever static/service/location page content changes materially.
// (Blog + work entries derive their own lastmod from the CMS/data.)
const CONTENT_UPDATED = new Date('2026-07-23')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: CONTENT_UPDATED, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/services`, lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/get-started`, lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/ai`, lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/work`, lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/offers`, lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/faq`, lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/brand-avatar`, lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/locations`, lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/vision`, lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/privacy`, lastModified: CONTENT_UPDATED, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: CONTENT_UPDATED, changeFrequency: 'yearly', priority: 0.3 },
    // /cbi lives on cbi.coastglobal.org, /offers-tools/* on offers.coastglobal.org,
    // and /gallery on gallery.coastglobal.org. The apex-host duplicates set a
    // cross-host canonical to those subdomains (see cbi/layout.tsx,
    // offers-tools/layout.tsx, gallery/layout.tsx), so they are intentionally
    // excluded from this (apex) sitemap.
  ]

  // Blog category pages - auto-generated from BLOG_CATEGORIES in src/lib/blog-categories.ts
  const categoryPages: MetadataRoute.Sitemap = Object.keys(BLOG_CATEGORIES).map((slug) => ({
    url: `${BASE_URL}/blog/category/${slug}`,
    lastModified: CONTENT_UPDATED,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Dynamically include all published blog posts
  let blogPosts: MetadataRoute.Sitemap = []
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
    })
    blogPosts = docs.map((post: any) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch {
    // DB not available - blog posts omitted from sitemap
  }

  // Work / portfolio pages - sourced from CASE_STUDIES in src/lib/case-studies.ts.
  // Set ready: true there to publish a case study; it auto-appears here.
  const workPages: MetadataRoute.Sitemap = Object.entries(CASE_STUDIES)
    .filter(([, meta]) => meta.ready)
    .map(([id]) => ({
      url: `${BASE_URL}/work/${id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  // Individual service landing pages
  const servicePages: MetadataRoute.Sitemap = SERVICE_PAGES.map((s) => ({
    url: `${BASE_URL}/services/${s.slug}`,
    lastModified: CONTENT_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Location / service-area pages - sourced from src/lib/location-pages.ts
  const locationPages: MetadataRoute.Sitemap = LOCATION_PAGES.map((l) => ({
    url: `${BASE_URL}/locations/${l.slug}`,
    lastModified: CONTENT_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...servicePages, ...locationPages, ...categoryPages, ...workPages, ...blogPosts]
}
