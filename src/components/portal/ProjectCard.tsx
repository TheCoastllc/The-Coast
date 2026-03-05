'use client'

import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  id: string
  title: string
  serviceType: string
  status: string
  dueDate?: string | null
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-muted text-muted-foreground border-border' },
  in_progress: { label: 'In Progress', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  review: { label: 'In Review', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  revision: { label: 'Revision', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  completed: { label: 'Completed', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  cancelled: { label: 'Cancelled', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
}

const serviceConfig: Record<string, { label: string; className: string }> = {
  logo: { label: 'Logo Design', className: 'bg-purple-500/20 text-purple-400' },
  flyer: { label: 'Flyer', className: 'bg-pink-500/20 text-pink-400' },
  epk: { label: 'EPK', className: 'bg-indigo-500/20 text-indigo-400' },
  social: { label: 'Social Media', className: 'bg-cyan-500/20 text-cyan-400' },
  merch: { label: 'Merchandise', className: 'bg-amber-500/20 text-amber-400' },
  rebrand: { label: 'Rebrand', className: 'bg-rose-500/20 text-rose-400' },
  website: { label: 'Website', className: 'bg-teal-500/20 text-teal-400' },
}

export default function ProjectCard({ id, title, serviceType, status, dueDate }: ProjectCardProps) {
  const statusInfo = statusConfig[status] || statusConfig.pending
  const serviceInfo = serviceConfig[serviceType] || { label: serviceType, className: 'bg-muted text-foreground' }

  const progressWidth =
    status === 'completed' ? 'w-full' :
    status === 'review' ? 'w-3/4' :
    status === 'in_progress' ? 'w-1/2' :
    status === 'revision' ? 'w-2/3' : 'w-1/4'

  const progressColor =
    status === 'completed' ? 'bg-green-500' :
    status === 'review' ? 'bg-yellow-500' :
    status === 'in_progress' ? 'bg-blue-500' :
    status === 'revision' ? 'bg-orange-500' : 'bg-muted-foreground'

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-foreground line-clamp-1">{title}</h3>
        <span className={cn('text-xs px-2 py-0.5 rounded-full border', serviceInfo.className)}>
          {serviceInfo.label}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={cn('text-xs px-2 py-0.5 rounded-full border', statusInfo.className)}>
          {statusInfo.label}
        </span>
        {dueDate && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {format(new Date(dueDate), 'MMM d')}
          </span>
        )}
      </div>

      <div className="mb-4">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className={cn('h-full rounded-full transition-all duration-500', progressColor, progressWidth)} />
        </div>
      </div>

      <Link
        href={`/portal/projects/${id}`}
        className="flex items-center gap-1 text-sm text-primary hover:underline group-hover:gap-2 transition-all"
      >
        View Details
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
