import { BlueprintLayout, SectionBoundary } from '@/components/blueprint-layout'

function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`bg-muted animate-pulse ${className}`} />
}


export default function BlogLoading() {
  return (
    <BlueprintLayout>
      {/* Hero skeleton */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <SkeletonBlock className="h-3 w-28 mb-4" />
          <SkeletonBlock className="h-14 md:h-20 w-64 md:w-80 mb-6" />
          <SkeletonBlock className="h-5 w-full max-w-lg mb-2" />
          <SkeletonBlock className="h-5 w-2/3 max-w-sm" />
        </div>
      </section>

      <SectionBoundary />

      {/* Filter skeleton */}
      <div className="py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="flex gap-3 flex-wrap">
            <SkeletonBlock className="h-9 w-48" />
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-9 w-20" />
            ))}
          </div>
        </div>
      </div>

      <SectionBoundary />

      {/* Card grid skeleton */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border border-border mt-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card overflow-hidden">
                <div className="aspect-[16/10] bg-muted animate-pulse" />
                <div className="p-5 space-y-3">
                  <SkeletonBlock className="h-2.5 w-20" />
                  <SkeletonBlock className="h-6 w-full" />
                  <SkeletonBlock className="h-6 w-4/5" />
                  <SkeletonBlock className="h-4 w-full" />
                  <div className="flex justify-between pt-3 border-t border-border">
                    <SkeletonBlock className="h-2.5 w-24" />
                    <div className="w-8 h-8 border border-border" />
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
