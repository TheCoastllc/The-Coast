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
          ? 'border-[#C9A24B] bg-[#C9A24B]/[0.06]'
          : 'border-[#0D1117]/10 hover:border-[#0D1117]/20 bg-white',
      )}
    >
      <span
        className={cn(
          'shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold transition-colors',
          selected
            ? 'bg-[#C9A24B] text-white'
            : 'bg-[#0D1117]/[0.06] text-[#0D1117]/50',
        )}
      >
        {letter}
      </span>
      <span className={cn('text-sm leading-relaxed', selected ? 'text-[#0D1117]' : 'text-[#0D1117]/70')}>
        {text}
      </span>
    </button>
  )
}
