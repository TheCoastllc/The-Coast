'use client'

import { motion } from 'motion/react'
import { useCbi } from '../CbiContext'

export function EmailGateScreen() {
  const { state, dispatch } = useCbi()
  const { form, submitting, error } = state
  const ready = form.email.includes('@') && form.email.includes('.')

  const submit = async () => {
    if (!ready || submitting) return
    dispatch({ type: 'SUBMIT_START' })
    try {
      const res = await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'cbi',
          name: form.name,
          email: form.email,
          brand: form.brand,
          website: form.website,
          answers: state.answers,
        }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        dispatch({ type: 'SUBMIT_ERROR', error: data.error ?? 'Submission failed' })
        return
      }
      dispatch({ type: 'SUBMIT_DONE' })
    } catch {
      dispatch({ type: 'SUBMIT_ERROR', error: 'Network error — please try again' })
    }
  }

  return (
    <div className="min-h-screen bg-[#070F11] text-white font-sans overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[420px] mx-auto px-8 flex flex-col items-center justify-center min-h-screen text-center"
      >
        <div className="text-[10px] tracking-[4px] text-white/55 uppercase font-semibold mb-6">
          Step 3 of 3
        </div>

        <h2 className="text-[28px] font-light leading-[1.2]">Your score is ready.</h2>
        <p className="text-[13px] text-white/70 mt-4 mb-10">
          Enter your email to reveal your Wave Rating.
        </p>

        <input
          value={form.email}
          type="email"
          placeholder="your@email.com"
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          onChange={(e) => dispatch({ type: 'UPDATE_FORM', patch: { email: e.target.value } })}
          className="w-full max-w-[320px] py-3.5 bg-transparent border-0 border-b border-white/25 text-white text-[17px] font-light outline-none text-center placeholder:text-white/30 focus:border-[#C9A24B] transition-colors"
        />

        <button
          onClick={submit}
          disabled={!ready || submitting}
          className={`mt-10 px-12 py-4 border text-xs font-bold tracking-[3px] uppercase transition-colors min-w-[220px] ${
            ready && !submitting
              ? 'border-[#C9A24B] text-[#C9A24B] cursor-pointer hover:bg-[#C9A24B] hover:text-[#070F11]'
              : 'border-white/15 text-white/30 cursor-default'
          }`}
        >
          {submitting ? (
            <span className="inline-flex items-center justify-center gap-2">
              <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Revealing
            </span>
          ) : (
            'Reveal My Wave'
          )}
        </button>

        {error && <p className="text-[12px] text-[#D94F3D] mt-4">{error}</p>}

        <p className="text-[10px] text-white/45 mt-8 tracking-[0.5px]">
          Your report arrives in your inbox too.
        </p>
      </motion.div>
    </div>
  )
}
