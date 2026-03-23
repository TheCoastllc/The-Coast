import { Suspense } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { Clock, ArrowRight } from 'lucide-react'
import BlogSearchClient from './BlogSearchClient'
import { BlueprintLayout, SectionBoundary } from '@/components/blueprint-layout'
import TextReveal from '@/components/TextReveal'

const formatCategory = (slug: string) =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

export const metadata: import('next').Metadata = {
  title: 'Journal',
  description: 'Insights on brand design, visual identity, and creative strategy for entrepreneurs and growing businesses. The Coast Journal.',
  alternates: { canonical: 'https://www.coastglobal.org/blog' },
  openGraph: {
    title: 'The Coast Journal — Brand Design Insights',
    description: 'Insights on brand design, visual identity, and creative strategy.',
    url: 'https://www.coastglobal.org/blog',
  },
}

const POSTS_PER_PAGE = 9

type SearchParams = Promise<{ search?: string; category?: string; page?: string }>

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const { search, category, page } = await searchParams
  const currentPage = parseInt(page || '1')

  let posts: any[] = []
  let totalDocs = 0
  let categories: string[] = []

  try {
    const payload = await getPayload({ config: configPromise })

    const where: any = {
      and: [
        { status: { equals: 'published' } },
        { publishedAt: { less_than_equal: new Date().toISOString() } },
      ],
    }

    if (search) {
      where.and.push({
        or: [
          { title: { like: search } },
          { excerpt: { like: search } },
        ],
      })
    }

    if (category) {
      where.and.push({ category: { equals: category } })
    }

    const result = await payload.find({
      collection: 'posts',
      limit: POSTS_PER_PAGE,
      page: currentPage,
      sort: '-publishedAt',
      where,
    })

    posts = result.docs as any[]
    totalDocs = result.totalDocs

    // Fetch categories from all published posts
    const allPosts = await payload.find({
      collection: 'posts',
      limit: 100,
      where: { status: { equals: 'published' } },
      select: { category: true } as any,
    })
    const cats = allPosts.docs.map((p: any) => p.category).filter(Boolean)
    categories = [...new Set(cats)] as string[]
  } catch {
    // DB not migrated yet
  }

  const totalPages = Math.ceil(totalDocs / POSTS_PER_PAGE)

  return (
    <BlueprintLayout>
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-8">
          <TextReveal as="h1" className="text-heading text-4xl md:text-6xl text-foreground mb-4">The Journal</TextReveal>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-10">
            Insights on brand design, visual identity, and creative strategy.
          </p>

          <Suspense>
            <BlogSearchClient categories={categories} currentSearch={search} currentCategory={category} />
          </Suspense>
        </div>
      </section>

      <SectionBoundary />

      <section className="pb-16 px-4">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No articles found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <article className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    {(post.coverImage?.cloudinary?.secure_url || post.coverImage?.url) && (
                      <div className="aspect-16/10 overflow-hidden">
                        <img
                          src={post.coverImage.cloudinary?.secure_url || post.coverImage.url}
                          alt={post.coverImage.alt ?? post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        {post.category && (
                          <span className="text-mono text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                            {formatCategory(post.category)}
                          </span>
                        )}
                        {post.readingTime && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {post.readingTime} min
                          </span>
                        )}
                      </div>
                      <h2 className="text-heading text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                      )}
                      <div className="flex items-center justify-between">
                        {post.publishedAt && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                        <span className="text-xs font-medium text-foreground flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }, (_, i) => {
                const params = new URLSearchParams()
                if (search) params.set('search', search)
                if (category) params.set('category', category)
                params.set('page', String(i + 1))
                return (
                  <Link
                    key={i}
                    href={`/blog?${params.toString()}`}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition-colors flex items-center justify-center ${currentPage === i + 1
                        ? 'bg-foreground text-background'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
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
    </BlueprintLayout>
  )
}
