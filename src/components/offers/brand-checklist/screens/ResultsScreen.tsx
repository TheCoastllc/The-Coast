'use client'

import { useChecklist } from '../ChecklistContext'
import { bands, type Band } from '../data/scoring'
import { ScoringPanel } from '../components/ScoringPanel'
import { ArrowRight, RotateCcw } from 'lucide-react'

export function ResultsScreen() {
  const { derived, dispatch } = useChecklist()
  const band = derived.band ? bands[derived.band] : null

  return (
    <div className="min-h-screen bg-[#0D1117] px-5 py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        {/* Score display */}
        <div className="text-center mb-10">
          <div className="mt-2">
            <span
              className="text-5xl md:text-6xl font-bold tabular-nums"
              style={{ color: band?.color ?? '#fff' }}
            >
              {derived.totalScore}
            </span>
            <span className="text-white/30 text-2xl md:text-3xl font-light"> / {derived.maxScore}</span>
          </div>
          {band && (
            <div className="mt-4">
              <span
                className="inline-block text-[10px] tracking-[0.15em] uppercase font-semibold px-4 py-1.5 rounded-sm"
                style={{ backgroundColor: `${band.color}15`, color: band.color }}
              >
                {band.label}
              </span>
            </div>
          )}
        </div>

        {/* Band description */}
        {band && (
          <p className="text-white/50 text-sm leading-relaxed text-center mb-10 max-w-lg mx-auto">
            {band.description}
          </p>
        )}

        {/* Tally */}
        <div className="flex justify-center gap-8 mb-10">
          <div className="text-center">
            <span className="text-[#28A77A] text-2xl font-bold tabular-nums block">{derived.yesCount}</span>
            <span className="text-white/30 text-[10px] uppercase tracking-wider">Yes</span>
          </div>
          <div className="text-center">
            <span className="text-[#C9A24B] text-2xl font-bold tabular-nums block">{derived.partCount}</span>
            <span className="text-white/30 text-[10px] uppercase tracking-wider">Partial</span>
          </div>
          <div className="text-center">
            <span className="text-[#D94F3D] text-2xl font-bold tabular-nums block">{derived.noCount}</span>
            <span className="text-white/30 text-[10px] uppercase tracking-wider">No</span>
          </div>
        </div>

        {/* Scoring panel with all bands */}
        <ScoringPanel />

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <a
            href="https://coastglobal.org/get-started"
            className="inline-flex items-center gap-2.5 bg-[#C9A24B] text-[#0D1117] px-7 py-3 text-sm font-semibold tracking-wide rounded-sm hover:bg-[#C9A24B]/90 transition-colors"
          >
            Get Your Free Brand Audit
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Restart */}
        <div className="text-center mt-8">
          <button
            onClick={() => dispatch({ type: 'RESTART' })}
            className="inline-flex items-center gap-2 text-white/30 hover:text-white/50 text-xs transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Take the checklist again
          </button>
        </div>

        {/* Wordmark */}
        <p className="text-center text-white/10 text-xs tracking-[0.4em] uppercase mt-16">
          The Coast
        </p>
      </div>
    </div>
  )
}
