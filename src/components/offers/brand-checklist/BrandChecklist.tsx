'use client'

import { useCallback, useEffect, useRef } from 'react'
import { ChecklistProvider, useChecklist } from './ChecklistContext'
import { categories } from './data/categories'
import { ScoreDock } from './components/ScoreDock'
import { CategorySection } from './components/CategorySection'
import { ScoringPanel } from './components/ScoringPanel'
import { OffersCTA } from '@/components/offers/OffersCTA'
import { Toast } from '@/components/offers/Toast'
import { useState } from 'react'
import Image from 'next/image'

function ChecklistInner() {
  const { derived } = useChecklist()
  const [toast, setToast] = useState<string | null>(null)
  const prevCount = useRef(0)

  useEffect(() => {
    const count = derived.answeredCount
    if (count === 5 && prevCount.current < 5) {
      setToast('Nice start! Keep going.')
    } else if (count === 10 && prevCount.current < 10) {
      setToast('Almost halfway there!')
    } else if (count === 25 && prevCount.current < 25) {
      setToast('All done! Scroll down to see your breakdown.')
    }
    prevCount.current = count
  }, [derived.answeredCount])

  let itemNumber = 0

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <ScoreDock />

      {/* Document header */}
      <div className="pt-20 pb-8 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2.5 mb-8">
            <Image src="/logo.png" alt="The Coast" width={24} height={24} className="opacity-60" />
            <span className="text-white/20 text-xs tracking-widest uppercase">Brand Consistency Checklist</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-semibold tracking-tight mb-3">
            How Consistent Is Your Brand?
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-2xl mb-6">
            25 checkpoints across five brand pillars. Mark each item as Yes, Partially, or No. Your score updates in real time.
          </p>
          <div className="flex gap-5 text-xs text-white/30">
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
      </div>

      {/* Categories */}
      <div className="max-w-4xl mx-auto">
        {categories.map((cat, ci) => {
          const startNum = itemNumber + 1
          itemNumber += cat.items.length
          return (
            <CategorySection
              key={cat.num}
              category={cat}
              categoryIndex={ci}
              startNumber={startNum}
            />
          )
        })}
      </div>

      {/* Scoring Panel */}
      <div className="max-w-4xl mx-auto">
        <ScoringPanel />
      </div>

      <OffersCTA
        heading="Find out exactly what your score is costing you."
        description="The Coast's free Brand Audit delivers a specific, honest diagnosis \u2014 not a generic framework."
      />

      {/* Toast */}
      <Toast
        message={toast ?? ''}
        show={toast !== null}
        onDone={useCallback(() => setToast(null), [])}
      />
    </div>
  )
}

export default function BrandChecklist() {
  return (
    <ChecklistProvider>
      <ChecklistInner />
    </ChecklistProvider>
  )
}
