'use client'

import { useQuiz } from '../QuizContext'
import { ArrowRight, Loader2 } from 'lucide-react'

export function EmailCaptureScreen() {
  const { state, dispatch } = useQuiz()
  const { email, submitting, answers } = state

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  async function handleSubmit() {
    if (!isValidEmail || submitting) return

    dispatch({ type: 'SUBMIT_START' })

    try {
      await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, answers }),
      })
    } catch {
      // Still show results even if email fails
    }

    dispatch({ type: 'SUBMIT_DONE' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-[#0D1117]">
      <div className="max-w-md w-full text-center">
        <p className="text-[#C9A24B] text-xs tracking-[0.3em] uppercase mb-6">
          Almost There
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-4">
          Want your full Brand Audit breakdown?
        </h2>
        <p className="text-white/50 text-sm leading-relaxed mb-8">
          Enter your email and we&apos;ll send you a detailed breakdown of your score with personalised recommendations.
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => dispatch({ type: 'SET_EMAIL', email: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            disabled={submitting}
            className="flex-1 bg-white/6 border border-white/10 text-white text-sm px-4 py-3 rounded-sm placeholder:text-white/25 focus:outline-none focus:border-[#C9A24B]/40 disabled:opacity-50"
          />
          <button
            onClick={handleSubmit}
            disabled={!isValidEmail || submitting}
            className="bg-[#C9A24B] text-[#0D1117] px-5 py-3 text-sm font-semibold rounded-sm hover:bg-[#C9A24B]/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                Sending
                <Loader2 className="w-4 h-4 animate-spin" />
              </>
            ) : (
              <>
                See Results
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
        <p className="text-white/20 text-[11px] mb-6">No spam. No pressure. Unsubscribe anytime.</p>
      </div>
    </div>
  )
}
