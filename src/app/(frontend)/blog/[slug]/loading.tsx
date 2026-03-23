import { BlueprintLayout } from '@/components/blueprint-layout'

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`rounded bg-muted animate-pulse ${className}`} />
}

export default function BlogPostLoading() {
  return (
    <BlueprintLayout>
      <article className="pt-28 pb-20 px-4">
        <div className="max-w-3xl mx-auto px-2 sm:px-4 md:px-8">
          {/* Back link */}
          <Skeleton className="h-4 w-32 mb-10" />

          {/* Meta row */}
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Title */}
          <Skeleton className="h-12 md:h-16 w-full mb-3" />
          <Skeleton className="h-12 md:h-16 w-3/4 mb-6" />

          {/* Author byline */}
          <Skeleton className="h-4 w-40 mb-8" />

          {/* Excerpt */}
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-5/6 mb-10" />

          {/* Cover image */}
          <div className="aspect-[16/9] rounded-2xl bg-muted animate-pulse mb-12" />

          {/* Content lines */}
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className={`h-4 ${i % 5 === 4 ? 'w-2/3' : 'w-full'}`} />
            ))}
          </div>
        </div>
      </article>
    </BlueprintLayout>
  )
}
