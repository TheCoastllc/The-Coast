import { BlueprintLayout, SectionBoundary } from '@/components/blueprint-layout'

function SkeletonPill({ className = '' }: { className?: string }) {
  return <div className={`rounded-full bg-muted animate-pulse ${className}`} />
}

function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`rounded bg-muted animate-pulse ${className}`} />
}

export default function BlogLoading() {
  return (
    <BlueprintLayout>
      {/* Header skeleton */}
      <section className="pt-32 px-4">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-8">
          <SkeletonBlock className="h-14 md:h-20 w-64 md:w-96 mb-4" />
          <SkeletonBlock className="h-5 w-full max-w-lg mb-2" />
          <SkeletonBlock className="h-5 w-2/3 max-w-sm mb-10" />
        </div>
      </section>

      {/* Filter pill skeletons — matches PostsGrid container */}
      <div className="px-4 pb-16">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-8">
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonPill key={i} className="h-8 w-24" />
            ))}
          </div>
        </div>
      </div>

      <SectionBoundary />

      {/* Card grid skeleton */}
      <section className="pb-16 px-4">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                <div className="aspect-[16/10] bg-muted animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="flex gap-2">
                    <SkeletonPill className="h-5 w-20" />
                    <SkeletonPill className="h-5 w-16" />
                  </div>
                  <SkeletonBlock className="h-5 w-full" />
                  <SkeletonBlock className="h-5 w-3/4" />
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-4 w-2/3" />
                  <div className="flex justify-between pt-1">
                    <SkeletonBlock className="h-3 w-24" />
                    <SkeletonBlock className="h-3 w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </BlueprintLayout>
  )
}
