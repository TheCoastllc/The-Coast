'use client'

export function ResultBadge({
  label,
  color,
}: {
  tier: string
  label: string
  color: string
}) {
  return (
    <span
      className="inline-block text-[10px] tracking-[0.2em] uppercase font-semibold px-4 py-1.5 rounded-sm"
      style={{ backgroundColor: `${color}15`, color }}
    >
      {label}
    </span>
  )
}
