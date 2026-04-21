import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { MetadataRoute } from 'next'

const BASE_URL = 'https://coastglobal.org'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/services`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/pricing`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/get-started`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/work`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/offers`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/brand-avatar`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/vision`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    // Note: /cbi is excluded — noindexed placeholder
    // Note: /offers-tools/* are internal rewrite paths for offers.coastglobal.org — excluded
  ]

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
    // DB not available — blog posts omitted from sitemap
  }

  // Work / portfolio pages — only ready, fully-published case studies are indexed.
  // Placeholder (under-construction) projects are noindex and excluded from the sitemap.
  const workPages: MetadataRoute.Sitemap = [
    'zappedco',
  ].map((id) => ({
    url: `${BASE_URL}/work/${id}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...workPages, ...blogPosts]
}
