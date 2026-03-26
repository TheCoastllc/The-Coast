'use client'

import { useChecklist, type CheckValue } from '../ChecklistContext'
import { cn } from '@/lib/utils'
import { Check, Minus, X } from 'lucide-react'

const options: { value: CheckValue; label: string; icon: typeof Check; activeColor: string }[] = [
  { value: 'yes', label: 'Yes', icon: Check, activeColor: '#28A77A' },
  { value: 'part', label: 'Part', icon: Minus, activeColor: '#C9A24B' },
  { value: 'no', label: 'No', icon: X, activeColor: '#D94F3D' },
]

export function ChecklistItem({
  itemId,
  text,
  number,
}: {
  itemId: string
  text: string
  number: number
}) {
  const { items, toggle } = useChecklist()
  const current = items[itemId]

  return (
    <div
      className={cn(
        'flex items-start gap-4 py-4 px-5 border-b border-white/[0.04] transition-colors',
        current === 'yes' && 'bg-[#28A77A]/[0.03]',
        current === 'part' && 'bg-[#C9A24B]/[0.03]',
        current === 'no' && 'bg-[#D94F3D]/[0.03]',
      )}
    >
      {/* Number */}
      <span className="text-white/15 text-xs tabular-nums font-mono mt-0.5 w-5 shrink-0">
        {String(number).padStart(2, '0')}
      </span>

      {/* Text */}
      <p
        className={cn(
          'flex-1 text-sm leading-relaxed transition-colors',
          current !== null ? 'text-white/70' : 'text-white/50',
        )}
      >
        {text}
      </p>

      {/* Toggle buttons */}
      <div className="flex gap-1.5 shrink-0">
        {options.map((opt) => {
          const Icon = opt.icon
          const isActive = current === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => toggle(itemId, opt.value)}
              title={opt.label}
              className={cn(
                'w-8 h-8 flex items-center justify-center rounded-sm border transition-all duration-200',
                isActive
                  ? 'border-transparent'
                  : 'border-white/[0.08] hover:border-white/20',
              )}
              style={isActive ? { backgroundColor: `${opt.activeColor}20`, color: opt.activeColor } : undefined}
            >
              <Icon className={cn('w-3.5 h-3.5', !isActive && 'text-white/20')} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
