'use client'

import type { Category } from '../data/categories'
import { ChecklistItem } from './ChecklistItem'

let globalCounter = 0

export function CategorySection({
  category,
  categoryIndex,
  startNumber,
}: {
  category: Category
  categoryIndex: number
  startNumber: number
}) {
  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/[0.02] border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <span className="text-[#C9A24B]/40 text-xs font-mono">{category.num}</span>
          <span className="text-white text-sm font-medium tracking-wide">{category.name}</span>
        </div>
        <div className="flex gap-6 text-[10px] text-white/20 uppercase tracking-wider">
          <span className="w-8 text-center">Yes</span>
          <span className="w-8 text-center">Part</span>
          <span className="w-8 text-center">No</span>
        </div>
      </div>

      {/* Items */}
      {category.items.map((text, ii) => (
        <ChecklistItem
          key={`${categoryIndex}-${ii}`}
          itemId={`${categoryIndex}-${ii}`}
          text={text}
          number={startNumber + ii}
        />
      ))}
    </div>
  )
}
