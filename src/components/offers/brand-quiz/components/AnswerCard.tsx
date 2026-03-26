'use client'

import { cn } from '@/lib/utils'

export function AnswerCard({
  letter,
  text,
  selected,
  onClick,
}: {
  letter: string
  text: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left flex items-start gap-4 p-4 border rounded-sm transition-all duration-200',
        selected
          ? 'border-[#C9A24B] bg-[#C9A24B]/[0.08]'
          : 'border-white/[0.08] hover:border-white/20 bg-white/[0.03]',
      )}
    >
      <span
        className={cn(
          'shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold transition-colors',
          selected
            ? 'bg-[#C9A24B] text-[#0D1117]'
            : 'bg-white/[0.08] text-white/50',
        )}
      >
        {letter}
      </span>
      <span className={cn('text-sm leading-relaxed', selected ? 'text-white' : 'text-white/60')}>
        {text}
      </span>
    </button>
  )
}
