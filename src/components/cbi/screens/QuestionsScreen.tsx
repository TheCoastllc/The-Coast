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
    <div className="min-h-screen bg-[#070F11] text-white font-sans overflow-auto relative">
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
                i < qIdx ? '#C9A24B' : i === qIdx ? 'rgba(201,162,75,0.65)' : 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
      </div>

      <div
        key={qIdx}
        className="max-w-[480px] mx-auto px-8 flex flex-col justify-center min-h-screen animate-fade-in"
      >
        <div className="text-[10px] tracking-[4px] text-white/55 uppercase font-semibold mb-2">
          Pillar {q.num}
        </div>
        <div className="text-[10px] tracking-[3px] text-[#C9A24B] uppercase font-semibold mb-9">
          {q.pillar}
        </div>

        <h2 className="text-2xl font-light leading-[1.4] mb-10">{q.question}</h2>

        <div className="flex flex-col gap-1">
          {q.options.map((opt) => {
            const isSel = sel === opt.val
            return (
              <button
                key={opt.val}
                onClick={() => pick(opt.val)}
                className={cn(
                  'w-full px-5 py-4 text-left text-sm font-normal leading-[1.5] transition-all border-l-2',
                  isSel
                    ? 'bg-[#C9A24B]/15 border-[#C9A24B] text-white'
                    : 'bg-transparent border-transparent text-white/70 hover:text-white/95',
                )}
              >
                {opt.label}
              </button>
            )
          })}
        </div>

        {qIdx > 0 && (
          <button
            onClick={() => dispatch({ type: 'SET_QIDX', qIdx: qIdx - 1 })}
            className="mt-8 text-[11px] text-white/50 hover:text-white/80 transition-colors tracking-[2px] uppercase self-start"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  )
}
