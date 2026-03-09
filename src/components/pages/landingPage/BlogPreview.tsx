import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
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
    <section className="py-32 bg-black border-t border-white/5" id="insights">
      <div className="container mx-auto px-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3contact gap-0 border-y border-white/10">
          {posts.map((post, index) => (
            <Link
              href={`/blog/${post.slug}`}
              key={post.id}
              className={`group relative p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10 last:border-0 hover:bg-white/[0.02] transition-colors duration-500 flex flex-col justify-between min-h-[300px] md:aspect-square hover-target ${index === 2 ? 'md:border-r-0' : ''}`}
            >
              <div className="flex justify-between items-start mb-12">
                <span className="text-white/40 font-mono text-xs uppercase tracking-widest">
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

              <h3 className="text-2xl font-display uppercase tracking-tighter group-hover:text-primary transition-colors duration-500 mb-12">
                {post.title}
              </h3>

              <div className="mt-auto flex justify-end">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-all duration-500">
                  <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
