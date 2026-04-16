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
  const ready =
    form.name.trim().length > 0 && form.brand.trim().length > 0 && form.website.trim().length > 0

  return (
    <div className="min-h-screen bg-[#070F11] text-white font-sans overflow-auto">
      <div className="max-w-[420px] mx-auto px-8 flex flex-col justify-center min-h-screen">
        <button
          onClick={() => dispatch({ type: 'SET_PHASE', phase: 'hero' })}
          className="text-[11px] text-white/50 hover:text-white/80 transition-colors tracking-[2px] uppercase self-start mb-12"
        >
          ← Back
        </button>

        <div className="text-[10px] tracking-[4px] text-[#C9A24B] uppercase font-semibold mb-8">
          Step 1 of 3
        </div>

        <div className="flex flex-col gap-7">
          {FIELDS.map((field) => (
            <div key={field.key}>
              <label className="block text-[10px] tracking-[4px] text-white/65 uppercase font-semibold mb-2.5">
                {field.label}
              </label>
              <input
                value={form[field.key]}
                type={field.type ?? 'text'}
                onChange={(e) => dispatch({ type: 'UPDATE_FORM', patch: { [field.key]: e.target.value } })}
                className="w-full py-3.5 bg-transparent border-0 border-b border-white/25 text-white text-[17px] font-light outline-none tracking-[0.3px] focus:border-[#C9A24B] transition-colors"
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => ready && dispatch({ type: 'SET_PHASE', phase: 'questions' })}
          disabled={!ready}
          className={`mt-12 w-full px-12 py-4 border text-xs font-bold tracking-[3px] uppercase transition-colors ${
            ready
              ? 'border-[#C9A24B] text-[#C9A24B] cursor-pointer hover:bg-[#C9A24B] hover:text-[#070F11]'
              : 'border-white/15 text-white/30 cursor-default'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
