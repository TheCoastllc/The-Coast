'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning'
}

const variantStyles = {
  default: 'bg-card border-border',
  primary: 'bg-primary/5 border-primary/20',
  success: 'bg-green-500/5 border-green-500/20',
  warning: 'bg-yellow-500/5 border-yellow-500/20',
}

const iconVariantStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-green-500/10 text-green-400',
  warning: 'bg-yellow-500/10 text-yellow-400',
}

export default function StatsCard({ title, value, subtitle, icon, variant = 'default' }: StatsCardProps) {
  return (
    <div className={cn('rounded-xl border p-5 transition-all duration-200 hover:border-primary/30', variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', iconVariantStyles[variant])}>
          {icon}
        </div>
      </div>
    </div>
  )
}
