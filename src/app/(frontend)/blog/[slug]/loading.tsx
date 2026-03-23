import { BlueprintLayout, SectionBoundary } from '@/components/blueprint-layout'

function Sk({ className = '' }: { className?: string }) {
  return <div className={`bg-muted animate-pulse ${className}`} />
}

export default function BlogPostLoading() {
  return (
    <BlueprintLayout>
      {/* Header */}
      <section className="pt-28 pb-10 md:pt-36 md:pb-14">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <Sk className="h-3 w-28 mb-10 md:mb-14" />

          {/* Meta */}
          <div className="flex items-center gap-4 mb-6">
            <Sk className="h-6 w-24" />
            <Sk className="h-3 w-20" />
            <Sk className="h-3 w-28" />
          </div>

          {/* Title */}
          <Sk className="h-14 md:h-20 w-full max-w-3xl mb-4" />
          <Sk className="h-14 md:h-20 w-2/3 max-w-xl mb-8" />

          {/* Excerpt */}
          <div className="border-l-2 border-primary/20 pl-6 mb-8 space-y-2">
            <Sk className="h-6 w-full max-w-2xl" />
            <Sk className="h-6 w-4/5 max-w-xl" />
          </div>

          {/* Author bar */}
          <div className="flex items-center gap-3 pt-6 border-t border-border">
            <div className="w-8 h-8 border border-border shrink-0" />
            <div className="space-y-1">
              <Sk className="h-3.5 w-32" />
              <Sk className="h-2.5 w-20" />
            </div>
          </div>
        </div>
      </section>

      <SectionBoundary />

      {/* Cover image */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 md:py-14">
        <div className="aspect-video bg-muted animate-pulse w-full" />
      </div>

      <SectionBoundary />

      {/* Content grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px] gap-12 lg:gap-16">
            {/* Content */}
            <div className="space-y-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Sk key={i} className={`h-4 ${i % 7 === 6 ? 'w-1/2' : i % 4 === 3 ? 'w-5/6' : 'w-full'}`} />
              ))}
              <Sk className="h-4 w-0 mt-6" />
              {Array.from({ length: 6 }).map((_, i) => (
                <Sk key={i + 20} className={`h-4 ${i % 5 === 4 ? 'w-2/3' : 'w-full'}`} />
              ))}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="border border-border p-6 space-y-4">
                <Sk className="h-2.5 w-24 mb-4" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between py-3 border-t border-border">
                    <Sk className="h-2.5 w-16" />
                    <Sk className="h-2.5 w-20" />
                  </div>
                ))}
              </div>
              <div className="border border-border p-6 space-y-4">
                <Sk className="h-2.5 w-16 mb-2" />
                <Sk className="h-5 w-48" />
                <Sk className="h-10 w-full" />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </BlueprintLayout>
  )
}
