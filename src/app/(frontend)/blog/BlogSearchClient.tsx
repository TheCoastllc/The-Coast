'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useCallback } from 'react'

const formatCategory = (slug: string) =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

interface BlogSearchClientProps {
  categories: string[]
  currentSearch?: string
  currentCategory?: string
}

export default function BlogSearchClient({ categories, currentSearch, currentCategory }: BlogSearchClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParams = useCallback((updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('page')
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    router.push(`/blog?${params.toString()}`)
  }, [router, searchParams])

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
        <input
          type="text"
          placeholder="Search articles..."
          defaultValue={currentSearch}
          onChange={(e) => updateParams({ search: e.target.value || undefined })}
          className="pl-9 pr-4 py-2 bg-transparent border border-border text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 transition-colors w-56"
          style={{ borderRadius: 0 }}
        />
      </div>

      {/* Category filters — sharp square pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateParams({ category: undefined })}
          className={`px-3 py-1.5 text-mono text-[10px] uppercase tracking-widest border transition-colors ${
            !currentCategory
              ? 'border-primary bg-primary text-black'
              : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => updateParams({ category: cat })}
            className={`px-3 py-1.5 text-mono text-[10px] uppercase tracking-widest border transition-colors ${
              currentCategory === cat
                ? 'border-primary bg-primary text-black'
                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
            }`}
          >
            {formatCategory(cat)}
          </button>
        ))}
      </div>
    </div>
  )
}
