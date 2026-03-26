'use client'

import { useChecklist } from '../ChecklistContext'
import { bands } from '../data/scoring'
import { ProgressBar } from '@/components/offers/ProgressBar'

export function ScoreDock() {
  const { derived } = useChecklist()
  const band = derived.band ? bands[derived.band] : null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#0D1117]/95 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-4xl mx-auto flex items-center justify-between h-14 px-5">
        {/* Score */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold tabular-nums" style={{ color: band?.color ?? '#fff' }}>
            {derived.totalScore}
          </span>
          <span className="text-white/30 text-sm">/ {derived.maxScore}</span>
        </div>

        {/* Band label */}
        {band && (
          <span
            className="text-[10px] tracking-[0.15em] uppercase font-semibold px-3 py-1 rounded-sm hidden sm:inline-block"
            style={{ backgroundColor: `${band.color}15`, color: band.color }}
          >
            {band.label}
          </span>
        )}

        {/* Progress */}
        <div className="flex items-center gap-3">
          <span className="text-white/30 text-xs tabular-nums">
            {derived.answeredCount}/{derived.totalItems}
          </span>
        </div>
      </div>
      <ProgressBar progress={derived.progress} />
    </div>
  )
}
