import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'

type Post = {
  id: string | number
  title: string
  slug: string
  excerpt?: string | null
  category?: string | null
  readingTime?: number | null
  publishedAt?: string | null
  coverImage?: { url?: string | null; alt?: string | null; cloudinary?: { secure_url?: string | null } | null } | null
}

async function getPosts(): Promise<Post[]> {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'posts',
      limit: 3,
      sort: '-publishedAt',
      where: {
        and: [
          { status: { equals: 'published' } },
          { publishedAt: { less_than_equal: new Date().toISOString() } },
        ],
      },
    })
    return docs as unknown as Post[]
  } catch {
    // DB may need migration — run: npm run payload migrate
    return []
  }
}

export default async function BlogPreview() {
  const posts = await getPosts()

  if (posts.length === 0) return null

  return (
    <section className="py-20 md:py-32 relative border-t border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-4">
          <div>
            <span className="text-mono text-accent-cycle mb-3 block">From The Journal</span>
            <h2 className="text-heading text-3xl md:text-5xl lg:text-6xl text-foreground">
              Latest Insights
            </h2>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-mono text-muted-foreground hover:text-primary transition-colors"
          >
            View all articles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
              <article className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/30 hover:-translate-y-1">
                {(post.coverImage?.cloudinary?.secure_url || post.coverImage?.url) && (
                  <div className="aspect-16/10 overflow-hidden">
                    <img
                      src={post.coverImage.cloudinary?.secure_url ?? post.coverImage.url ?? undefined}
                      alt={post.coverImage.alt ?? post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    {post.category && (
                      <span className="text-mono text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full capitalize">
                        {post.category}
                      </span>
                    )}
                    {post.readingTime && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {post.readingTime} min
                      </span>
                    )}
                  </div>
                  <h3 className="text-heading text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-3">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-body text-muted-foreground text-sm line-clamp-2 mb-3">
                      {post.excerpt}
                    </p>
                  )}
                  {post.publishedAt && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
