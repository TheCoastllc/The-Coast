import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DecorIcon } from '@/components/ui/decor-icon'
import { FullWidthDivider } from '@/components/ui/full-width-divider'
import TextReveal from '@/components/TextReveal'

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
    return []
  }
}

export default async function BlogPreview() {
  const posts = await getPosts()

  if (posts.length === 0) return null

  return (
    <section className="py-32 bg-black px-4" id="insights">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-mono">08</span>
            <div className="w-12 h-px bg-white/20" />
            <span className="text-white/40 text-xs tracking-[0.3em] uppercase">Insights</span>
          </div>
          <TextReveal
            className="text-4xl md:text-5xl lg:text-6xl font-display uppercase tracking-tighter"
            highlight={["Thinking"]}
          >
            Latest Thinking
          </TextReveal>
        </div>

        {/* LogosSection-style bordered grid */}
        <div className="relative">
          <DecorIcon className="size-4" position="top-left" />
          <DecorIcon className="size-4" position="top-right" />
          <DecorIcon className="size-4" position="bottom-left" />
          <DecorIcon className="size-4" position="bottom-right" />

          <FullWidthDivider className="-top-px" />
          <div className="grid grid-cols-1 md:grid-cols-3 border">
            {posts.map((post, index) => (
              <Link
                href={`/blog/${post.slug}`}
                key={post.id}
                className={cn(
                  "group relative flex flex-col justify-between p-8 md:p-10 aspect-square bg-background transition-colors duration-500 hover-target",
                  index < posts.length - 1 && "border-b md:border-b-0",
                  index < 2 && "md:border-r",
                  index === 1 && "bg-secondary dark:bg-secondary/30",
                )}
              >
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground/60 font-mono text-xs uppercase tracking-widest">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                      : ''}
                  </span>
                  {post.category && (
                    <span className="text-primary text-xs uppercase tracking-[0.2em]">{post.category}</span>
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-display uppercase tracking-tighter group-hover:text-primary transition-colors duration-500 mb-6">
                    {post.title}
                  </h3>
                  <div className="flex justify-end">
                    <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all duration-500">
                      <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <FullWidthDivider className="-bottom-px" />
        </div>
      </div>
    </section>
  )
}
