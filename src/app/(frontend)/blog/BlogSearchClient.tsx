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
    <div className="flex flex-col sm:flex-row gap-4 mb-10">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search articles..."
          defaultValue={currentSearch}
          onChange={(e) => updateParams({ search: e.target.value || undefined })}
          className="w-full pl-10 pr-4 py-2.5 bg-muted/30 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateParams({ category: undefined })}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            !currentCategory ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => updateParams({ category: cat })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              currentCategory === cat ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {formatCategory(cat)}
          </button>
        ))}
      </div>
    </div>
  )
}
