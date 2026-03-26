'use client'

import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'

type EmailCaptureProps = {
  tool: 'brand-quiz' | 'brand-checklist' | '3-second-test'
  heading?: string
  description?: string
  answers?: unknown
  onComplete: () => void
}

export function EmailCapture({
  tool,
  heading = 'Want your full Brand Audit breakdown?',
  description = "Enter your email and we'll send you a detailed breakdown of your results with personalised recommendations.",
  answers,
  onComplete,
}: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  async function handleSubmit() {
    if (!isValidEmail || submitting) return
    setSubmitting(true)

    try {
      await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tool, answers }),
      })
    } catch {
      // Still advance even if request fails
    }

    setSubmitting(false)
    onComplete()
  }

  return (
    <div className="max-w-md w-full text-center">
      <p className="text-[#C9A24B] text-xs tracking-[0.3em] uppercase mb-6">
        Almost There
      </p>
      <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-4">
        {heading}
      </h2>
      <p className="text-white/50 text-sm leading-relaxed mb-8">
        {description}
      </p>

      <div className="flex gap-2 mb-4">
        <input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
  )
}
