'use client'

import { ArrowRight } from 'lucide-react'

export function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-[#0D1117]">
      <div className="max-w-lg text-center">
        <p className="text-[#C9A24B] text-xs tracking-[0.3em] uppercase mb-6">
          5 Elements &middot; 3 Seconds &middot; Free
        </p>
        <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-tight leading-tight mb-5">
          Does Your Brand Pass
          <br />
          <span className="text-white/40">The 3-Second Test?</span>
        </h1>
        <p className="text-white/50 text-sm md:text-base leading-relaxed mb-10 max-w-md mx-auto">
          Learn what customers judge in the first three seconds of seeing your brand &mdash; and discover whether yours communicates trust, clarity, and credibility before a single word is read.
        </p>
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2.5 bg-[#C9A24B] text-[#0D1117] px-8 py-3.5 text-sm font-semibold tracking-wide rounded-sm hover:bg-[#C9A24B]/90 transition-colors"
        >
          Start the Test
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-white/20 text-xs mt-6">No signup required to begin.</p>
      </div>
    </div>
  )
}
