'use client'

import { useQuiz } from '../QuizContext'
import { resultTiers } from '../data/results'
import { ResultBadge } from '../components/ResultBadge'
import { ShareButton } from '../components/ShareButton'
import { ArrowRight, RotateCcw } from 'lucide-react'

export function ResultsScreen() {
  const { state, dispatch } = useQuiz()
  const { score, resultTier } = state

  if (!resultTier) return null
  const result = resultTiers[resultTier]

  return (
    <div className="min-h-screen bg-[#0D1117] px-5 py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        {/* Badge + Score */}
        <div className="text-center mb-10">
          <ResultBadge tier={resultTier} label={result.badge} color={result.color} />
          <div className="mt-6">
            <span className="text-5xl md:text-6xl font-bold tabular-nums" style={{ color: result.color }}>
              {score}
            </span>
            <span className="text-white/30 text-2xl md:text-3xl font-light"> / 30</span>
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight text-center mb-8">
          {result.headline}
        </h2>

        {/* Body */}
        <div className="space-y-4 mb-10">
          {result.body.map((paragraph, i) => (
            <p key={i} className="text-white/50 text-sm leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Causes */}
        <div className="border border-white/[0.06] bg-white/[0.02] p-6 md:p-8 mb-10">
          <h3 className="text-white text-sm font-semibold tracking-wide uppercase mb-4">
            {resultTier === 'established' ? "What's next for your brand" : "What's typically causing this"}
          </h3>
          <ul className="space-y-3">
            {result.causes.map((cause, i) => (
              <li key={i} className="flex items-start gap-3 text-white/50 text-sm leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: result.color }} />
                {cause}
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://coastglobal.org/get-started"
            className="inline-flex items-center gap-2.5 bg-[#C9A24B] text-[#0D1117] px-7 py-3 text-sm font-semibold tracking-wide rounded-sm hover:bg-[#C9A24B]/90 transition-colors"
          >
            {result.cta}
            <ArrowRight className="w-4 h-4" />
          </a>
          <ShareButton score={score} tier={resultTier} />
        </div>

        {/* Restart */}
        <div className="text-center mt-8">
          <button
            onClick={() => dispatch({ type: 'RESTART' })}
            className="inline-flex items-center gap-2 text-white/30 hover:text-white/50 text-xs transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Take the quiz again
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
