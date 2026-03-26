'use client'

import { useChecklist } from '../ChecklistContext'
import { categories } from '../data/categories'
import { ChecklistItem } from '../components/ChecklistItem'
import { ScoreDock } from '../components/ScoreDock'
import { ProgressBar } from '@/components/offers/ProgressBar'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CategoryStepScreen() {
  const { currentCategory, derived, dispatch } = useChecklist()
  const cat = categories[currentCategory]
  const stepProgress = ((currentCategory + 1) / categories.length) * 100
  const isFirst = currentCategory === 0
  const isLast = currentCategory === categories.length - 1

  return (
    <div className="min-h-screen flex flex-col bg-[#0D1117] text-white">
      <ScoreDock />

      {/* Step progress */}
      <ProgressBar progress={stepProgress} className="fixed top-14 left-0 right-0 z-40 bg-white/[0.06]" />

      {/* Category header */}
      <div className="pt-20 pb-6 px-5">
        <div className="max-w-2xl mx-auto">
          <p className="text-white/30 text-xs tracking-[0.2em] uppercase font-medium mb-3">
            Pillar {currentCategory + 1} of {categories.length}
          </p>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-[#C9A24B]/40 text-sm font-mono">{cat.num}</span>
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight">{cat.name}</h2>
          </div>
          <p className="text-white/30 text-xs">
            {cat.items.length} items &middot; {derived.categoryComplete ? 'All answered' : 'Answer all to continue'}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 pb-4">
        <div className="max-w-2xl mx-auto flex gap-5 text-xs text-white/30">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#28A77A]" /> Yes = 2 pts
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C9A24B]" /> Partially = 1 pt
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D94F3D]" /> No = 0 pts
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 px-5">
        <div className="max-w-2xl mx-auto">
          {cat.items.map((text, ii) => (
            <ChecklistItem
              key={`${currentCategory}-${ii}`}
              itemId={`${currentCategory}-${ii}`}
              text={text}
              number={ii + 1}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="px-5 py-5 border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => dispatch({ type: 'PREV_CATEGORY' })}
            disabled={isFirst}
            className={cn(
              'inline-flex items-center gap-2 text-sm transition-colors',
              isFirst
                ? 'text-transparent cursor-default'
                : 'text-white/50 hover:text-white',
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={() => dispatch({ type: 'NEXT_CATEGORY' })}
            disabled={!derived.categoryComplete}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-sm transition-all',
              derived.categoryComplete
                ? 'bg-[#C9A24B] text-[#0D1117] hover:bg-[#C9A24B]/90'
                : 'bg-white/[0.06] text-white/20 cursor-not-allowed',
            )}
          >
            {isLast ? 'Finish' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
