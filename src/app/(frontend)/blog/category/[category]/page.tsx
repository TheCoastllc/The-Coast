import { getPayloadClient } from '@/lib/payload-client'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { TransitionLink } from '@/components/PageTransition'
import type { Metadata } from 'next'
import { ChamberShell } from '@/components/ui/ChamberShell'
import { BLOG_CATEGORIES as CATEGORIES } from '@/lib/blog-categories'
import { DEFAULT_OG_IMAGES } from '@/lib/seo'
import styles from '../../blog.module.css'

type Params = Promise<{ category: string }>

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category } = await params
  const label = CATEGORIES[category]
  if (!label) return { title: 'Not Found', robots: { index: false } }

  return {
    title: `${label} - The Coast Journal`,
    description: `Articles and insights on ${label.toLowerCase()} from The Coast - brand design studio for entrepreneurs and growing businesses.`,
    alternates: { canonical: `https://coastglobal.org/blog/category/${category}` },
    openGraph: {
      type: 'website',
      title: `${label} - The Coast Journal`,
      description: `Articles and insights on ${label.toLowerCase()} from The Coast.`,
      url: `https://coastglobal.org/blog/category/${category}`,
      images: DEFAULT_OG_IMAGES,
    },
  }
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { category } = await params
  const label = CATEGORIES[category]
  if (!label) notFound()

  let posts: any[] = []
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'posts',
      where: {
        and: [
          { status: { equals: 'published' } },
          { category: { equals: category } },
          { publishedAt: { less_than_equal: new Date().toISOString() } },
        ],
      },
      limit: 50,
      sort: '-publishedAt',
      depth: 1,
    })
    posts = docs as any[]
  } catch {
    // DB not reachable
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coastglobal.org' },
      { '@type': 'ListItem', position: 2, name: 'The Journal', item: 'https://coastglobal.org/blog' },
      { '@type': 'ListItem', position: 3, name: label },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ChamberShell
        index="06"
        label="Journal"
        chamber={label}
        preface={`${posts.length} article${posts.length !== 1 ? 's' : ''} on ${label.toLowerCase()} from The Coast Journal.`}
      >
        <section className="section">
          {posts.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyLabel}>No results</span>
              <p className={styles.emptyTitle}>No articles in this category yet.</p>
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
        </section>
      </ChamberShell>
    </>
  )
}
