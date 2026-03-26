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

const inputClass =
  'w-full bg-white/[0.04] border border-white/10 text-white text-sm px-4 py-3 rounded-sm placeholder:text-white/25 focus:outline-none focus:border-[#C9A24B]/40 disabled:opacity-50'

export function EmailCapture({
  tool,
  heading = 'Want your full Brand Audit breakdown?',
  description = "Enter your email and we'll send you a detailed breakdown of your results with personalised recommendations.",
  answers,
  onComplete,
}: EmailCaptureProps) {
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const canSubmit = name.trim().length > 0 && isValidEmail

  async function handleSubmit() {
    if (!canSubmit || submitting) return
    setSubmitting(true)

    try {
      await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), company: company.trim(), role: role.trim(), email, tool, answers }),
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

      <div className="space-y-3 mb-4">
        <input
          type="text"
          placeholder="Your name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={submitting}
          className={inputClass}
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={submitting}
            className={inputClass}
          />
          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={submitting}
            className={inputClass}
          />
        </div>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="you@company.com *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            disabled={submitting}
            className={`flex-1 ${inputClass}`}
          />
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
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
      </div>
      <p className="text-white/20 text-[11px] mb-6">No spam. No pressure. Unsubscribe anytime.</p>
    </div>
  )
}
