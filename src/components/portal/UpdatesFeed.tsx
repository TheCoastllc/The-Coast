'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { MessageSquare, ArrowRight } from 'lucide-react'

interface Update {
  id: string
  message: string
  created_at: string
  project: {
    id: string
    title: string
  }
}

interface UpdatesFeedProps {
  updates: Update[]
}

export default function UpdatesFeed({ updates }: UpdatesFeedProps) {
  if (updates.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Recent Updates
        </h3>
        <div className="text-center py-8 text-muted-foreground">
          <p>No updates yet</p>
          <p className="text-sm mt-1">Updates from your projects will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Recent Updates
        </h3>
        <Link href="/portal/projects" className="text-sm text-primary hover:underline flex items-center gap-1">
          View All
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-4">
        {updates.map((update) => (
          <div key={update.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/portal/projects/${update.project.id}`}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {update.project.title}
              </Link>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{update.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
