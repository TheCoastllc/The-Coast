import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import { BlueprintLayout } from '@/components/blueprint-layout'

const formatCategory = (slug: string) =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

type Params = Promise<{ slug: string }>

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

    const canonicalUrl = `https://www.coastglobal.org/blog/${slug}`
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
  const authorTitle: string | null = post.author?.authorTitle || null
  const authorBio: string | null = post.author?.authorBio || null

  return (
    <BlueprintLayout>
      <article className="pt-28 pb-20 px-4">
        <div className="max-w-3xl mx-auto px-2 sm:px-4 md:px-8">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Journal
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-6">
            {post.category && (
              <span className="text-mono text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                {formatCategory(post.category)}
              </span>
            )}
            {post.readingTime && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {post.readingTime} min read
              </span>
            )}
            {post.publishedAt && (
              <span className="text-xs text-muted-foreground">
                {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Author byline */}
          <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
            <span>By</span>
            <span className="text-foreground font-medium">{authorName}</span>
            {authorTitle && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <span>{authorTitle}</span>
              </>
            )}
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-body text-muted-foreground text-xl mb-10 leading-relaxed border-l-2 border-primary/30 pl-4">
              {post.excerpt}
            </p>
          )}

          {/* Cover image */}
          {(post.coverImage?.cloudinary?.secure_url || post.coverImage?.url) && (
            <div className="aspect-16/9 rounded-2xl overflow-hidden mb-12">
              <img
                src={post.coverImage.cloudinary?.secure_url || post.coverImage.url}
                alt={post.coverImage.alt ?? post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          {post.content && (
            <div className="prose prose-lg max-w-none">
              <RichText data={post.content} />
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((t: any) => (
                  <span key={t.id || t.tag} className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">
                    #{t.tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author bio box */}
          {authorBio && (
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground/60 uppercase tracking-widest font-mono">About the author</p>
                <p className="text-sm font-medium text-foreground">{authorName}</p>
                {authorTitle && <p className="text-xs text-muted-foreground">{authorTitle}</p>}
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{authorBio}</p>
              </div>
            </div>
          )}
        </div>
      </article>
    </BlueprintLayout>
  )
}
