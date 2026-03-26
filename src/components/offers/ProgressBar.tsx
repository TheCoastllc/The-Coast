'use client'

import { cn } from '@/lib/utils'

export function ProgressBar({
  progress,
  className,
}: {
  progress: number
  className?: string
}) {
  return (
    <div className={cn('h-1 w-full bg-white/[0.06] overflow-hidden', className)}>
      <div
        className="h-full bg-[#C9A24B] transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  )
}
