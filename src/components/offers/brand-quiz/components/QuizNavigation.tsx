'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function QuizNavigation({
  canGoBack,
  canGoForward,
  onBack,
  onNext,
}: {
  canGoBack: boolean
  canGoForward: boolean
  onBack: () => void
  onNext: () => void
}) {
  return (
    <div className="flex items-center justify-between px-5 py-5 border-t border-[#0D1117]/[0.06]">
      <button
        onClick={onBack}
        disabled={!canGoBack}
        className={cn(
          'inline-flex items-center gap-2 text-sm transition-colors',
          canGoBack
            ? 'text-[#0D1117]/50 hover:text-[#0D1117]'
            : 'text-transparent cursor-default',
        )}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <button
        onClick={onNext}
        disabled={!canGoForward}
        className={cn(
          'inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-sm transition-all',
          canGoForward
            ? 'bg-[#C9A24B] text-[#0D1117] hover:bg-[#C9A24B]/90'
            : 'bg-[#0D1117]/[0.06] text-[#0D1117]/20 cursor-not-allowed',
        )}
      >
        Next
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}
