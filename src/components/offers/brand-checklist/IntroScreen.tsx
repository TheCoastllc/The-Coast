'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useChecklist } from './ChecklistContext'

export function IntroScreen() {
  const { dispatch } = useChecklist()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-[#0D1117] relative">
      <a
        href="/offers-tools"
        className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Offers
      </a>
      <div className="max-w-lg text-center">
        <p className="text-[#C9A24B] text-xs tracking-[0.3em] uppercase mb-6">
          5 Pillars &middot; 26 Checkpoints &middot; Free
        </p>
        <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-tight leading-tight mb-5">
          How Consistent Is
          <br />
          <span className="text-white/40">Your Brand?</span>
        </h1>
        <p className="text-white/50 text-sm md:text-base leading-relaxed mb-10 max-w-md mx-auto">
          Score your brand across five critical pillars &mdash; visual identity, messaging, digital presence, customer experience, and internal alignment. Find out where you&apos;re strong and where the cracks are showing.
        </p>
        <button
          onClick={() => dispatch({ type: 'START' })}
          className="inline-flex items-center gap-2.5 bg-[#C9A24B] text-[#0D1117] px-8 py-3.5 text-sm font-semibold tracking-wide rounded-sm hover:bg-[#C9A24B]/90 transition-colors"
        >
          Start the Checklist
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-white/20 text-xs mt-6">No signup required to begin.</p>
      </div>
    </div>
  )
}
