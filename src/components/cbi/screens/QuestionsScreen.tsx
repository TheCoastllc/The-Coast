'use client'

import { useCbi } from '../CbiContext'
import { questions } from '../data/questions'
import { cn } from '@/lib/utils'

export function QuestionsScreen() {
  const { state, dispatch } = useCbi()
  const { qIdx, answers } = state
  const q = questions[qIdx]
  const sel = answers[q.id]

  const pick = (value: number) => {
    dispatch({ type: 'ANSWER', pillar: q.id, value })
    setTimeout(() => {
      if (qIdx < questions.length - 1) {
        dispatch({ type: 'SET_QIDX', qIdx: qIdx + 1 })
      } else {
        dispatch({ type: 'SET_PHASE', phase: 'gate' })
      }
    }, 280)
  }

  return (
    <div className="min-h-screen bg-[#06080C] text-white font-sans overflow-auto relative">
      <div className="fixed top-7 left-0 right-0 flex justify-center gap-3 z-10">
        {questions.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-2 rounded-[4px] transition-all duration-300',
              i === qIdx && 'w-6',
              i !== qIdx && 'w-2',
            )}
            style={{
              background:
                i < qIdx ? '#E6B24D' : i === qIdx ? 'rgba(201,162,75,0.65)' : 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
      </div>

      <div
        key={qIdx}
        className="max-w-[480px] mx-auto px-8 flex flex-col justify-center min-h-screen pt-24 pb-12 animate-fade-in"
      >
        <div className="font-mono text-[10px] tracking-[4px] text-white/55 uppercase mb-2">
          Pillar {q.num}
        </div>
        <div className="font-mono text-[10px] tracking-[3px] text-[#E6B24D] uppercase mb-9">
          {q.pillar}
        </div>

        <h2 className="font-serif text-[clamp(26px,3.6vw,38px)] font-light leading-[1.25] tracking-[-0.3px] mb-10">
          {q.question}
        </h2>

        <div className="flex flex-col gap-2.5">
          {q.options.map((opt, i) => {
            const isSel = sel === opt.val
            const letter = String.fromCharCode(65 + i)
            return (
              <button
                key={opt.val}
                onClick={() => pick(opt.val)}
                aria-pressed={isSel}
                className={cn(
                  'group flex w-full items-center gap-4 rounded-xl border px-4 py-4 text-left transition-all duration-200',
                  isSel
                    ? 'border-[#E6B24D] bg-[#E6B24D]/12 text-white shadow-[0_0_34px_-10px_rgba(230,178,77,0.6)]'
                    : 'border-white/12 bg-white/[0.03] text-white/80 hover:-translate-y-px hover:border-white/35 hover:bg-white/[0.06] hover:text-white',
                )}
              >
                <span
                  className={cn(
                    'grid h-8 w-8 shrink-0 place-items-center rounded-lg border font-mono text-[12px] transition-colors',
                    isSel
                      ? 'border-[#E6B24D] bg-[#E6B24D] text-[#06080C]'
                      : 'border-white/20 text-white/55 group-hover:border-white/40 group-hover:text-white/85',
                  )}
                >
                  {letter}
                </span>
                <span className="text-[15px] leading-snug">{opt.label}</span>
              </button>
            )
          })}
        </div>

        {qIdx > 0 && (
          <button
            onClick={() => dispatch({ type: 'SET_QIDX', qIdx: qIdx - 1 })}
            className="font-mono mt-8 text-[11px] text-white/50 hover:text-white/80 transition-colors tracking-[2px] uppercase self-start"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  )
}
