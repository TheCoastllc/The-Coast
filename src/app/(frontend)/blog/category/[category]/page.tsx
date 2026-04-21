import { getPayloadClient } from '@/lib/payload-client'
import { notFound } from 'next/navigation'
import { TransitionLink } from '@/components/PageTransition'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import { BlueprintLayout, SectionBoundary } from '@/components/blueprint-layout'
import TextReveal from '@/components/TextReveal'
import Image from 'next/image'

const CATEGORIES: Record<string, string> = {
  'brand-strategy': 'Brand Strategy',
  'visual-identity': 'Visual Identity',
  'logo-design': 'Logo Design',
  'web-design': 'Web Design',
  'social-media': 'Social Media',
  'creative-direction': 'Creative Direction',
  'case-study': 'Case Study',
  'industry-insights': 'Industry Insights',
}

type Params = Promise<{ category: string }>

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category } = await params
  const label = CATEGORIES[category]
  if (!label) return { title: 'Not Found', robots: { index: false } }

  return {
    title: `${label} — The Coast Journal`,
    description: `Articles and insights on ${label.toLowerCase()} from The Coast — brand design studio for entrepreneurs and growing businesses.`,
    alternates: { canonical: `https://coastglobal.org/blog/category/${category}` },
    openGraph: {
      title: `${label} — The Coast Journal`,
      description: `Articles and insights on ${label.toLowerCase()} from The Coast.`,
      url: `https://coastglobal.org/blog/category/${category}`,
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
    <BlueprintLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <TransitionLink
            href="/blog"
            className="inline-flex items-center gap-2 text-mono text-xs uppercase tracking-widest text-muted-foreground/50 hover:text-primary transition-colors mb-10 md:mb-14"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Articles
          </TransitionLink>

          <span className="text-mono text-muted-foreground/40 text-xs uppercase tracking-widest block mb-4">
            Category
          </span>
          <TextReveal as="h1" className="text-heading text-4xl md:text-6xl lg:text-7xl mb-6">
            {label}
          </TextReveal>
          <p className="text-body text-muted-foreground text-lg md:text-xl max-w-2xl">
            {posts.length} article{posts.length !== 1 ? 's' : ''} on {label.toLowerCase()} from The Coast Journal.
          </p>
        </div>
      </section>

      <SectionBoundary />

      {/* Post grid */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          {posts.length === 0 ? (
            <div className="py-24 flex flex-col items-center gap-3">
              <span className="text-mono text-xs uppercase tracking-widest text-muted-foreground/40">No results</span>
              <p className="text-heading text-2xl text-foreground">No articles in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-border mt-10 gap-2">
              {posts.map((post) => {
                const coverUrl = post.coverImage?.cloudinary?.secure_url ?? post.coverImage?.url ?? null
                const date = post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : null

                return (
                  <TransitionLink
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group relative block bg-card overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

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
                      <h2 className="text-heading text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h2>

                      {post.excerpt && (
                        <p className="text-body text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                        <div className="flex items-center gap-3">
                          {date && <span className="text-mono text-[10px] text-muted-foreground/50">{date}</span>}
                          {post.readingTime && <span className="text-mono text-[10px] text-muted-foreground/30">{post.readingTime} min</span>}
                        </div>
                        <div className="w-8 h-8 border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300">
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                  </TransitionLink>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </BlueprintLayout>
  )
}
