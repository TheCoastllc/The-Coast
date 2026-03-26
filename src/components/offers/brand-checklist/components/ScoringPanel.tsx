'use client'

import { useChecklist } from '../ChecklistContext'
import { bands, type Band } from '../data/scoring'
import { cn } from '@/lib/utils'

const bandOrder: Band[] = ['high', 'developing', 'critical']

export function ScoringPanel() {
  const { derived } = useChecklist()

  return (
    <div className="border border-white/[0.06] bg-white/[0.02] mx-5 my-8 p-6 md:p-8">
      <h3 className="text-white text-sm font-semibold tracking-wide uppercase mb-6">
        Score Breakdown
      </h3>

      {/* Tally */}
      <div className="flex gap-6 mb-6 pb-6 border-b border-white/[0.06]">
        <div className="flex flex-col gap-0.5">
          <span className="text-[#28A77A] text-xl font-bold tabular-nums">{derived.yesCount}</span>
          <span className="text-white/30 text-[10px] uppercase tracking-wider">Yes</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[#C9A24B] text-xl font-bold tabular-nums">{derived.partCount}</span>
          <span className="text-white/30 text-[10px] uppercase tracking-wider">Partial</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[#D94F3D] text-xl font-bold tabular-nums">{derived.noCount}</span>
          <span className="text-white/30 text-[10px] uppercase tracking-wider">No</span>
        </div>
      </div>

      {/* Score bands */}
      <div className="space-y-3">
        {bandOrder.map((key) => {
          const band = bands[key]
          const isActive = derived.band === key
          return (
            <div
              key={key}
              className={cn(
                'flex items-start gap-4 p-4 border rounded-sm transition-all duration-300',
                isActive ? 'border-transparent' : 'border-white/[0.04] opacity-50',
              )}
              style={isActive ? { borderColor: `${band.color}30`, backgroundColor: `${band.color}08` } : undefined}
            >
              <span
                className="text-xs font-bold shrink-0 mt-0.5"
                style={{ color: band.color }}
              >
                {band.range}
              </span>
              <div>
                <p className="text-white text-sm font-medium mb-1">{band.label}</p>
                <p className="text-white/40 text-xs leading-relaxed">{band.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
