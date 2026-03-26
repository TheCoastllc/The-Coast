'use client'

import { useQuiz } from '../QuizContext'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export function IntroScreen() {
  const { dispatch } = useQuiz()

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
          10 Questions &middot; 60 Seconds &middot; Free
        </p>
        <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-tight leading-tight mb-5">
          What&apos;s Your Brand
          <br />
          <span className="text-white/40">Actually Saying?</span>
        </h1>
        <p className="text-white/50 text-sm md:text-base leading-relaxed mb-10 max-w-md mx-auto">
          Find out if your brand is invisible, inconsistent, or established &mdash; and get a clear action plan to fix it.
        </p>
        <button
          onClick={() => dispatch({ type: 'START' })}
          className="inline-flex items-center gap-2.5 bg-[#C9A24B] text-[#0D1117] px-8 py-3.5 text-sm font-semibold tracking-wide rounded-sm hover:bg-[#C9A24B]/90 transition-colors"
        >
          Start the Quiz
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-white/20 text-xs mt-6">No signup required to begin.</p>
      </div>
    </div>
  )
}
