import { getPayloadClient } from '@/lib/payload-client'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { ShineButton } from '@/components/ui/ShineButton'
import { TransitionLink } from '@/components/PageTransition'
import { jsxConverters } from '../lexicalConverters'
import blogStyles from '../blog.module.css'
import styles from './article.module.css'

const formatCategory = (slug: string) =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
      select: { slug: true } as any,
    })
    return docs.map((post: any) => ({ slug: post.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'posts',
      where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
      limit: 1,
      depth: 1,
    })
    const post = docs[0] as any
    if (!post) return { title: 'Not Found', robots: { index: false } }

    const coverImageUrl: string | null =
      post.coverImage?.cloudinary?.secure_url ?? post.coverImage?.url ?? null
    const ogImages = coverImageUrl
      ? [{ url: coverImageUrl, alt: post.title }]
      : [{ url: '/preview.jpg', width: 1600, height: 900, alt: 'The Coast - Brand Design Studio' }]
    const canonicalUrl = `https://coastglobal.org/blog/${slug}`
    const authorName = post.author?.fullName || 'The Coast'

    return {
      title: post.title,
      description: post.excerpt || 'Read on The Coast Journal.',
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: post.title,
        description: post.excerpt || 'Read on The Coast Journal.',
        url: canonicalUrl,
        type: 'article',
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        authors: [authorName],
        images: ogImages,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || 'Read on The Coast Journal.',
        images: coverImageUrl ? [coverImageUrl] : ['/preview.jpg'],
      },
    }
  } catch {
    return { title: 'The Coast Journal' }
  }
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params

  let post: any = null
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'posts',
      where: {
        and: [
          { slug: { equals: slug } },
          { status: { equals: 'published' } },
          { publishedAt: { less_than_equal: new Date().toISOString() } },
        ],
      },
      limit: 1,
      depth: 1,
    })
    post = docs[0] as any
  } catch {
    // DB not migrated
  }

  if (!post) notFound()

  const authorName: string = post.author?.fullName || 'The Coast'
  const initials = authorName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
  const coverUrl: string | null = post.coverImage?.cloudinary?.secure_url ?? post.coverImage?.url ?? null
  const publishDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coastglobal.org' },
      { '@type': 'ListItem', position: 2, name: 'The Journal', item: 'https://coastglobal.org/blog' },
      ...(post.category
        ? [{ '@type': 'ListItem', position: 3, name: formatCategory(post.category), item: `https://coastglobal.org/blog/category/${post.category}` },
           { '@type': 'ListItem', position: 4, name: post.title }]
        : [{ '@type': 'ListItem', position: 3, name: post.title }]),
    ],
  }

  let relatedPosts: any[] = []
  if (post.category) {
    try {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'posts',
        where: {
          and: [
            { status: { equals: 'published' } },
            { category: { equals: post.category } },
            { slug: { not_equals: slug } },
          ],
        },
        limit: 3,
        sort: '-publishedAt',
        depth: 1,
      })
      relatedPosts = docs as any[]
    } catch {
      // ignore
    }
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `https://coastglobal.org/blog/${slug}#article`,
    url: `https://coastglobal.org/blog/${slug}`,
    headline: post.title,
    description: post.excerpt || '',
    image: coverUrl || 'https://coastglobal.org/preview.jpg',
    inLanguage: 'en-US',
    author: { '@type': 'Person', name: authorName },
    publisher: { '@id': 'https://coastglobal.org/#organization' },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://coastglobal.org/blog/${slug}` },
    isPartOf: { '@id': 'https://coastglobal.org/#website' },
    ...(post.category && { articleSection: formatCategory(post.category) }),
    ...(post.tags?.length && { keywords: post.tags.map((t: any) => t.tag).join(', ') }),
  }

  return (
    <main className={styles.main}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <div className={styles.head}>
        <TransitionLink href="/blog" className={styles.back} data-cursor-label="Back">
          ← The Journal
        </TransitionLink>

        <div className={styles.meta}>
          {post.category && (
            <TransitionLink href={`/blog/category/${post.category}`} className={styles.cat} data-cursor-label="Browse">
              {formatCategory(post.category)}
            </TransitionLink>
          )}
          {post.readingTime && <span className={styles.metaItem}>{post.readingTime} min read</span>}
          {publishDate && <span className={styles.metaItem}>{publishDate}</span>}
        </div>

        <h1 className={`${styles.title} no-marble`}>{post.title}</h1>

        {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}

        <div className={styles.author}>
          <span className={styles.authorMark}>{initials}</span>
          <div>
            <div className={styles.authorName}>{authorName}</div>
            <div className={styles.authorRole}>The Coast</div>
          </div>
        </div>
      </div>

      {coverUrl && (
        <div className={styles.cover}>
          <Image src={coverUrl} alt={post.coverImage?.alt ?? post.title} fill sizes="(max-width: 768px) 100vw, 1080px" className="object-cover" priority />
        </div>
      )}

      <div className={styles.body}>
        {post.directAnswer && <p className="sr-only">{post.directAnswer}</p>}
        {post.content && (
          <div className="prose prose-invert max-w-none">
            <RichText data={post.content} converters={jsxConverters} />
          </div>
        )}
      </div>

      <div className={styles.cta}>
        <p className={styles.ctaText}>Let&apos;s create something remarkable together.</p>
        <ShineButton href="/get-started" size="md">Start a Project</ShineButton>
      </div>

      {relatedPosts.length > 0 && (
        <div className={styles.related}>
          <span className={styles.relatedLabel}>More in {formatCategory(post.category)}</span>
          <div className={blogStyles.grid}>
            {relatedPosts.map((rp: any) => {
              const rpCover = rp.coverImage?.cloudinary?.secure_url ?? rp.coverImage?.url ?? null
              const rpDate = rp.publishedAt
                ? new Date(rp.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : null
              return (
                <TransitionLink key={rp.id} href={`/blog/${rp.slug}`} className={`${blogStyles.card} glass`} data-cursor-label="Read">
                  {rpCover && (
                    <div className={blogStyles.cover}>
                      <Image src={rpCover} alt={rp.coverImage?.alt ?? rp.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className={blogStyles.cardBody}>
                    {rp.category && <span className={blogStyles.cat}>{formatCategory(rp.category)}</span>}
                    <h3 className={blogStyles.title}>{rp.title}</h3>
                    <div className={blogStyles.meta}>{rpDate && <span>{rpDate}</span>}</div>
                  </div>
                </TransitionLink>
              )
            })}
          </div>
        </div>
      )}
    </main>
  )
}
