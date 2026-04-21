import { Suspense } from 'react'
import { getPayloadClient } from '@/lib/payload-client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import BlogSearchClient from './BlogSearchClient'
import { BlueprintLayout, SectionBoundary } from '@/components/blueprint-layout'
import TextReveal from '@/components/TextReveal'
import Image from 'next/image'
const formatCategory = (slug: string) =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<import('next').Metadata> {
  const { search, category, page } = await searchParams
  const hasFilters = search || category || (page && page !== '1')

  return {
    title: category
      ? `${category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} — The Coast Journal`
      : 'The Coast Journal — Brand Design Insights',
    description: 'Insights on brand design, visual identity, and creative strategy for entrepreneurs and growing businesses. The Coast Journal.',
    alternates: { canonical: 'https://coastglobal.org/blog' },
    openGraph: {
      title: 'The Coast Journal — Brand Design Insights',
      description: 'Insights on brand design, visual identity, and creative strategy.',
      url: 'https://coastglobal.org/blog',
    },
    ...(hasFilters && { robots: { index: false, follow: true } }),
  }
}

const POSTS_PER_PAGE = 9

type SearchParams = Promise<{ search?: string; category?: string; page?: string }>

// ─── Skeletons ────────────────────────────────────────────────────────────────

function PostGridSkeleton() {
  return (
    <>
      {/* Filter skeleton */}
      <div className="flex gap-3 flex-wrap">
        <div className="h-9 w-48 bg-muted animate-pulse" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-9 w-20 bg-muted animate-pulse" />
        ))}
      </div>

      {/* Card grid skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px mt-10 border border-border">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-card p-0 overflow-hidden animate-pulse">
            <div className="aspect-16/10 bg-muted" />
            <div className="p-5 space-y-3">
              <div className="h-3 w-20 bg-muted" />
              <div className="h-5 w-full bg-muted" />
              <div className="h-5 w-3/4 bg-muted" />
              <div className="h-3 w-full bg-muted" />
              <div className="flex justify-between pt-2">
                <div className="h-2.5 w-24 bg-muted" />
                <div className="w-8 h-8 bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// ─── Async data component ─────────────────────────────────────────────────────

async function PostsGrid({
  search,
  category,
  currentPage,
}: {
  search?: string
  category?: string
  currentPage: number
}) {
  let posts: any[] = []
  let totalDocs = 0
  let categories: string[] = []

  try {
    const payload = await getPayloadClient()

    const where: any = {
      and: [
        { status: { equals: 'published' } },
        { publishedAt: { less_than_equal: new Date().toISOString() } },
      ],
    }
    if (search) {
      where.and.push({ or: [{ title: { like: search } }, { excerpt: { like: search } }] })
    }
    if (category) {
      where.and.push({ category: { equals: category } })
    }

    const [result, allPosts] = await Promise.all([
      payload.find({
        collection: 'posts',
        limit: POSTS_PER_PAGE,
        page: currentPage,
        sort: '-publishedAt',
        where,
      }),
      payload.find({
        collection: 'posts',
        limit: 100,
        where: { status: { equals: 'published' } },
        select: { category: true } as any,
      }),
    ])

    posts = result.docs as any[]
    totalDocs = result.totalDocs
    const cats = allPosts.docs.map((p: any) => p.category).filter(Boolean)
    categories = [...new Set(cats)] as string[]
  } catch {
    // DB not reachable
  }

  const totalPages = Math.ceil(totalDocs / POSTS_PER_PAGE)

  return (
    <>
      {/* Filter/search bar */}
      <div className="py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <Suspense>
            <BlogSearchClient
              categories={categories}
              currentSearch={search}
              currentCategory={category}
            />
          </Suspense>
        </div>
      </div>

      <SectionBoundary />

      {/* Post grid */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          {posts.length === 0 ? (
            <div className="py-24 flex flex-col items-center gap-3">
              <span className="text-mono text-xs uppercase tracking-widest text-muted-foreground/40">No results</span>
              <p className="text-heading text-2xl text-foreground">No articles found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-border mt-10 gap-2">
              {posts.map((post) => {
                const coverUrl = post.coverImage?.cloudinary?.secure_url ?? post.coverImage?.url ?? null
                const date = post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : null

                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group relative block bg-card overflow-hidden"
                  >
                    {/* Top primary bar */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                    {/* Cover image */}
                    {coverUrl && (
                      <div className="aspect-16/10 relative overflow-hidden">
                        <Image
                          src={coverUrl}
                          alt={post.coverImage?.alt ?? post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="p-5 flex flex-col gap-3">
                      {/* Category */}
                      {post.category && (
                        <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                          {formatCategory(post.category)}
                        </span>
                      )}

                      {/* Title */}
                      <h2 className="text-heading text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-body text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                        <div className="flex items-center gap-3">
                          {date && (
                            <span className="text-mono text-[10px] text-muted-foreground/50">{date}</span>
                          )}
                          {post.readingTime && (
                            <span className="text-mono text-[10px] text-muted-foreground/30">{post.readingTime} min</span>
                          )}
                        </div>
                        <div className="w-8 h-8 border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300">
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2 mt-12 pt-8 border-t border-border">
              <span className="text-mono text-xs text-muted-foreground/40 uppercase tracking-widest mr-4">Page</span>
              {Array.from({ length: totalPages }, (_, i) => {
                const params = new URLSearchParams()
                if (search) params.set('search', search)
                if (category) params.set('category', category)
                params.set('page', String(i + 1))
                return (
                  <Link
                    key={i}
                    href={`/blog?${params.toString()}`}
                    className={`w-10 h-10 text-mono text-sm transition-colors flex items-center justify-center border ${currentPage === i + 1
                      ? 'border-primary bg-primary text-black'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                      }`}
                  >
                    {i + 1}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const blogBreadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coastglobal.org' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://coastglobal.org/blog' },
  ],
}

const blogCollectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://coastglobal.org/blog#webpage',
  url: 'https://coastglobal.org/blog',
  name: 'The Coast Journal — Brand Design Insights',
  description: 'Insights on brand design, visual identity, and creative strategy for entrepreneurs and growing businesses.',
  isPartOf: { '@id': 'https://coastglobal.org/#website' },
}

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const { search, category, page } = await searchParams
  const currentPage = parseInt(page || '1')

  return (
    <BlueprintLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogBreadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogCollectionSchema) }} />
      {/* Hero — renders immediately, no DB calls */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <span className="text-mono text-muted-foreground/40 text-xs uppercase tracking-widest block mb-4">
            What We Write
          </span>
          <TextReveal as="h1" className="text-heading text-4xl md:text-6xl lg:text-7xl mb-6">
            The Journal
          </TextReveal>
          <p className="text-body text-muted-foreground text-lg md:text-xl max-w-2xl">
            Insights on brand design, visual identity, and creative strategy for entrepreneurs and growing businesses.
          </p>

        </div>
      </section>

      <SectionBoundary />

      {/* Intro copy */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-6 md:px-12 space-y-5 text-body text-muted-foreground text-base md:text-lg leading-relaxed">
          <p>
            The Journal is where The Coast publishes the ideas, frameworks, and working notes behind the brand systems we build. Every post is written by the strategists and designers on our team — not freelancers, not SEO mills — and is grounded in real client work, real decisions, and the lessons we have collected across hundreds of identity projects.
          </p>
          <p>
            We write on four recurring themes. <strong className="text-foreground">Brand identity</strong> covers the visual system — logo, color, typography, and the invisible grammar that makes a brand feel inevitable. <strong className="text-foreground">Brand strategy</strong> is about positioning, narrative, and the choices a founder makes before a single pixel is drawn. <strong className="text-foreground">Marketing and growth</strong> traces how a brand compounds through websites, content, social, and paid channels. <strong className="text-foreground">Studio notes</strong> are the behind-the-scenes — process breakdowns, case studies, and the reasoning behind the decisions you see in our client work.
          </p>
          <p>
            If you are a founder, marketer, or creative lead working on a brand that needs to grow up, this is the archive we built for you. Browse the latest below, filter by category, or search for the specific question you came here with.
          </p>
        </div>
      </section>

      <SectionBoundary />

      {/* Posts + search — streams in with skeleton fallback */}
      <Suspense fallback={
        <div className="py-8 md:py-10">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <PostGridSkeleton />
          </div>
        </div>
      }>
        <PostsGrid search={search} category={category} currentPage={currentPage} />
      </Suspense>
    </BlueprintLayout>
  )
}
