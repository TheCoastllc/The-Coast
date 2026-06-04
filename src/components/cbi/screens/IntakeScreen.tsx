'use client'

import { useCbi, type CbiForm } from '../CbiContext'

type Field = { key: keyof Pick<CbiForm, 'name' | 'brand' | 'website'>; label: string; type?: string }

const FIELDS: readonly Field[] = [
  { key: 'name', label: 'Your name' },
  { key: 'brand', label: 'Business name' },
  { key: 'website', label: 'Website', type: 'url' },
]

export function IntakeScreen() {
  const { state, dispatch } = useCbi()
  const { form } = state
  // website must look like a domain/URL (rejects "asdf"; accepts "brand.com", "https://brand.co/x")
  const websiteOk = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(form.website.trim())
  const ready = form.name.trim().length > 0 && form.brand.trim().length > 0 && websiteOk

  return (
    <div className="min-h-screen bg-[#06080C] text-white font-sans overflow-auto">
      <div className="max-w-[420px] mx-auto px-8 flex flex-col justify-center min-h-screen">
        <button
          onClick={() => dispatch({ type: 'SET_PHASE', phase: 'hero' })}
          className="font-mono text-[11px] text-white/50 hover:text-white/80 transition-colors tracking-[2px] uppercase self-start mb-12"
        >
          ← Back
        </button>

        <div className="text-[10px] tracking-[4px] text-[#E6B24D] uppercase font-mono mb-8">
          Step 1 of 3
        </div>

        <div className="flex flex-col gap-7">
          {FIELDS.map((field) => (
            <div key={field.key}>
              <label className="block text-[10px] tracking-[4px] text-white/65 uppercase font-mono mb-2.5">
                {field.label}
              </label>
              <input
                value={form[field.key]}
                type={field.type ?? 'text'}
                onChange={(e) => dispatch({ type: 'UPDATE_FORM', patch: { [field.key]: e.target.value } })}
                className="w-full py-3.5 bg-transparent border-0 border-b border-white/25 text-white text-[17px] font-light outline-none tracking-[0.3px] focus:border-[#E6B24D] transition-colors"
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => ready && dispatch({ type: 'SET_PHASE', phase: 'questions' })}
          disabled={!ready}
          className={`mt-12 w-full px-12 py-4 border text-xs font-mono font-medium tracking-[3px] uppercase transition-colors ${
            ready
              ? 'border-[#E6B24D] text-[#E6B24D] cursor-pointer hover:bg-[#E6B24D] hover:text-[#06080C]'
              : 'border-white/15 text-white/30 cursor-default'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
