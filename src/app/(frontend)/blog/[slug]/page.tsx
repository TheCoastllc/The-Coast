import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock, Calendar } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { BlueprintLayout, SectionBoundary } from '@/components/blueprint-layout'
import { ShineButton } from '@/components/ui/ShineButton'

const formatCategory = (slug: string) =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
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
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'posts',
      where: {
        and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
      },
      limit: 1,
      depth: 1,
    })
    const post = docs[0] as any
    if (!post) return { title: 'Not Found', robots: { index: false } }

    const coverImageUrl: string | null =
      post.coverImage?.cloudinary?.secure_url ??
      post.coverImage?.url ??
      null

    const ogImages = coverImageUrl
      ? [{ url: coverImageUrl, alt: post.title }]
      : [{ url: '/preview.jpg', width: 1600, height: 900, alt: 'The Coast — Brand Design Studio' }]

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
    const payload = await getPayload({ config: configPromise })
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
  const coverUrl: string | null =
    post.coverImage?.cloudinary?.secure_url ?? post.coverImage?.url ?? null
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

  // Fetch related posts (same category, excluding current)
  let relatedPosts: any[] = []
  if (post.category) {
    try {
      const payload = await getPayload({ config: configPromise })
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
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@id': 'https://coastglobal.org/#organization',
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://coastglobal.org/blog/${slug}`,
    },
    isPartOf: { '@id': 'https://coastglobal.org/#website' },
    ...(post.category && { articleSection: formatCategory(post.category) }),
    ...(post.tags?.length && { keywords: post.tags.map((t: any) => t.tag).join(', ') }),
  }

  return (
    <BlueprintLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {/* ─── Article Header ───────────────────────────────────────────────── */}
      <section className="pt-28 pb-10 md:pt-36 md:pb-14">
        <div className="max-w-6xl mx-auto px-6 md:px-12">

          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-mono text-xs uppercase tracking-widest text-muted-foreground/50 hover:text-primary transition-colors mb-10 md:mb-14"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            The Journal
          </Link>

          {/* Category + meta */}
          <div className="flex items-center gap-4 mb-6">
            {post.category && (
              <Link
                href={`/blog/category/${post.category}`}
                className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary border border-primary/30 px-2.5 py-1 hover:bg-primary/10 transition-colors"
              >
                {formatCategory(post.category)}
              </Link>
            )}
            {post.readingTime && (
              <span className="flex items-center gap-1.5 text-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">
                <Clock className="h-3 w-3" />
                {post.readingTime} min read
              </span>
            )}
            {publishDate && (
              <span className="flex items-center gap-1.5 text-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">
                <Calendar className="h-3 w-3" />
                {publishDate}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-heading text-4xl md:text-6xl lg:text-7xl text-foreground mb-8 leading-tight max-w-4xl">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-body text-muted-foreground text-xl md:text-2xl leading-relaxed max-w-3xl border-l-2 border-primary pl-6 mb-8">
              {post.excerpt}
            </p>
          )}

          {/* Author bar */}
          <div className="flex items-center gap-3 pt-6 border-t border-border">
            <div className="w-8 h-8 bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <span className="text-mono text-[10px] text-primary font-medium">
                {authorName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col gap-0">
              <span className="text-foreground text-sm font-medium">{authorName}</span>
              <span className="text-mono text-[10px] text-muted-foreground/40 uppercase tracking-widest">The Coast</span>
            </div>
          </div>
        </div>
      </section>

      <SectionBoundary />

      {/* ─── Cover Image ──────────────────────────────────────────────────── */}
      {coverUrl && (
        <>
          <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 md:py-14">
            <div className="aspect-[16/9] relative overflow-hidden w-full">
              <Image
                src={coverUrl}
                alt={post.coverImage?.alt ?? post.title}
                fill
                sizes="(max-width: 768px) 100vw, 1152px"
                className="object-cover"
                priority
              />
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/60 pointer-events-none" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/60 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/60 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/60 pointer-events-none" />
            </div>
          </div>

          <SectionBoundary />
        </>
      )}

      {/* ─── Article Content ──────────────────────────────────────────────── */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px] gap-12 lg:gap-16">

            {/* Main content */}
            <div>
              {post.content && (
                <div className="prose prose-lg max-w-none prose-invert
                  prose-headings:font-heading prose-headings:text-foreground
                  prose-p:text-muted-foreground prose-p:leading-relaxed
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground
                  prose-blockquote:border-l-primary prose-blockquote:border-l-2 prose-blockquote:text-muted-foreground prose-blockquote:not-italic
                  prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5
                  prose-pre:bg-card prose-pre:border prose-pre:border-border
                  prose-img:rounded-none
                  prose-hr:border-border
                ">
                  <RichText data={post.content} />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-28 lg:self-start space-y-8">

              {/* Article details card */}
              <div className="border border-border p-6 space-y-4">
                <span className="text-mono text-[10px] uppercase tracking-widest text-muted-foreground/40 block mb-2">Article Details</span>

                {post.category && (
                  <div className="flex items-start justify-between gap-2 py-3 border-t border-border">
                    <span className="text-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">Category</span>
                    <Link href={`/blog/category/${post.category}`} className="text-mono text-xs text-primary hover:underline">
                      {formatCategory(post.category)}
                    </Link>
                  </div>
                )}

                {publishDate && (
                  <div className="flex items-start justify-between gap-2 py-3 border-t border-border">
                    <span className="text-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">Published</span>
                    <span className="text-mono text-xs text-foreground">{publishDate}</span>
                  </div>
                )}

                {post.readingTime && (
                  <div className="flex items-start justify-between gap-2 py-3 border-t border-border">
                    <span className="text-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">Read time</span>
                    <span className="text-mono text-xs text-foreground">{post.readingTime} min</span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-2 py-3 border-t border-border">
                  <span className="text-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">Author</span>
                  <span className="text-mono text-xs text-foreground">{authorName}</span>
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="border border-border p-6">
                  <span className="text-mono text-[10px] uppercase tracking-widest text-muted-foreground/40 block mb-4">Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((t: any) => (
                      <span
                        key={t.id || t.tag}
                        className="text-mono text-[10px] uppercase tracking-widest px-2.5 py-1 border border-border text-muted-foreground/60 hover:border-primary/40 hover:text-primary transition-colors"
                      >
                        {t.tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="border border-border p-6 space-y-4">
                <p className="text-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">Ready to build your brand?</p>
                <p className="text-heading text-lg text-foreground leading-snug">
                  Let&apos;s create something remarkable together.
                </p>
                <ShineButton href="/get-started" size="sm" full>
                  Start a Project
                </ShineButton>
              </div>

              {/* Back to journal */}
              <Link
                href="/blog"
                className="group flex items-center justify-between border border-border px-5 py-4 hover:border-primary/40 transition-colors"
              >
                <span className="text-mono text-xs uppercase tracking-widest text-muted-foreground/60 group-hover:text-primary transition-colors">
                  Back to Journal
                </span>
                <div className="w-8 h-8 border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300">
                  <ArrowLeft className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            </aside>
          </div>
        </div>
      </section>

      {/* ─── Related Articles ────────────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <>
          <SectionBoundary />
          <section className="py-12 md:py-16">
            <div className="max-w-6xl mx-auto px-6 md:px-12">
              <span className="text-mono text-[10px] uppercase tracking-widest text-muted-foreground/40 block mb-6">
                More in {formatCategory(post.category)}
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border border-border">
                {relatedPosts.map((rp: any) => {
                  const rpCover = rp.coverImage?.cloudinary?.secure_url ?? rp.coverImage?.url ?? null
                  const rpDate = rp.publishedAt
                    ? new Date(rp.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : null
                  return (
                    <Link
                      key={rp.id}
                      href={`/blog/${rp.slug}`}
                      className="group relative block bg-card overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                      {rpCover && (
                        <div className="aspect-[16/10] relative overflow-hidden">
                          <Image
                            src={rpCover}
                            alt={rp.coverImage?.alt ?? rp.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="p-5 flex flex-col gap-3">
                        <h3 className="text-heading text-lg text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {rp.title}
                        </h3>
                        {rp.excerpt && (
                          <p className="text-body text-muted-foreground text-sm line-clamp-2 leading-relaxed">{rp.excerpt}</p>
                        )}
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                          {rpDate && <span className="text-mono text-[10px] text-muted-foreground/50">{rpDate}</span>}
                          <div className="w-8 h-8 border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300">
                            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        </>
      )}
    </BlueprintLayout>
  )
}
