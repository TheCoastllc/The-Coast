import { Suspense } from 'react'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload-client'
import { TransitionLink } from '@/components/PageTransition'
import BlogSearchClient from './BlogSearchClient'
import { ChamberShell } from '@/components/ui/ChamberShell'
import { DEFAULT_OG_IMAGES } from '@/lib/seo'
import styles from './blog.module.css'

const formatCategory = (slug: string) =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

type SearchParams = Promise<{ search?: string; category?: string; page?: string }>

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<import('next').Metadata> {
  const { search, category, page } = await searchParams
  const hasFilters = search || category || (page && page !== '1')

  return {
    title: category
      ? `${formatCategory(category)} - The Coast Journal`
      : 'The Coast Journal - Brand Design Insights',
    description: 'Insights on brand design, visual identity, and creative strategy for entrepreneurs and growing businesses. The Coast Journal.',
    alternates: { canonical: 'https://coastglobal.org/blog' },
    openGraph: {
      type: 'website',
      title: 'The Coast Journal - Brand Design Insights',
      description: 'Insights on brand design, visual identity, and creative strategy.',
      url: 'https://coastglobal.org/blog',
      images: DEFAULT_OG_IMAGES,
    },
    ...(hasFilters && { robots: { index: false, follow: true } }),
  }
}

const POSTS_PER_PAGE = 9

function GridSkeleton() {
  return (
    <div className={styles.grid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={`${styles.card} glass`} style={{ opacity: 0.5 }}>
          <div className={styles.cover} />
          <div className={styles.cardBody}>
            <span className={styles.cat}>Loading</span>
            <h2 className={styles.title}>&nbsp;</h2>
          </div>
        </div>
      ))}
    </div>
  )
}

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
      payload.find({ collection: 'posts', limit: POSTS_PER_PAGE, page: currentPage, sort: '-publishedAt', where }),
      payload.find({ collection: 'posts', limit: 100, where: { status: { equals: 'published' } }, select: { category: true } as any }),
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
      <div className={styles.searchWrap}>
        <Suspense>
          <BlogSearchClient categories={categories} currentSearch={search} currentCategory={category} />
        </Suspense>
      </div>

      {posts.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyLabel}>No results</span>
          <p className={styles.emptyTitle}>No articles found.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {posts.map((post) => {
            const coverUrl = post.coverImage?.cloudinary?.secure_url ?? post.coverImage?.url ?? null
            const date = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : null
            return (
              <TransitionLink key={post.id} href={`/blog/${post.slug}`} className={`${styles.card} glass`} data-cursor-label="Read">
                {coverUrl && (
                  <div className={styles.cover}>
                    <Image src={coverUrl} alt={post.coverImage?.alt ?? post.title} fill className="object-cover" loading="lazy" />
                  </div>
                )}
                <div className={styles.cardBody}>
                  {post.category && <span className={styles.cat}>{formatCategory(post.category)}</span>}
                  <h2 className={styles.title}>{post.title}</h2>
                  {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
                  <div className={styles.meta}>
                    {date && <span>{date}</span>}
                    {post.readingTime && <span>{post.readingTime} min</span>}
                  </div>
                </div>
              </TransitionLink>
            )
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <span className={styles.pageLabel}>Page</span>
          {Array.from({ length: totalPages }, (_, i) => {
            const params = new URLSearchParams()
            if (search) params.set('search', search)
            if (category) params.set('category', category)
            params.set('page', String(i + 1))
            return (
              <TransitionLink key={i} href={`/blog?${params.toString()}`} className={styles.pageLink} data-active={currentPage === i + 1}>
                {i + 1}
              </TransitionLink>
            )
          })}
        </div>
      )}
    </>
  )
}

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
  name: 'The Coast Journal - Brand Design Insights',
  description: 'Insights on brand design, visual identity, and creative strategy for entrepreneurs and growing businesses.',
  isPartOf: { '@id': 'https://coastglobal.org/#website' },
}

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const { search, category, page } = await searchParams
  const currentPage = parseInt(page || '1')

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogBreadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogCollectionSchema) }} />

      <ChamberShell
        index="06"
        label="Journal"
        chamber="Latest Thinking"
        preface="Insights on brand design, visual identity, and creative strategy for the visionaries behind the brands."
      >
        <section className="section">
          <Suspense fallback={<GridSkeleton />}>
            <PostsGrid search={search} category={category} currentPage={currentPage} />
          </Suspense>
        </section>
      </ChamberShell>
    </>
  )
}
