'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useClientAuth } from '@/hooks/use-client-auth'
import { toast } from 'sonner'
import { ArrowLeft, Calendar, Loader2, Download, CheckCircle, XCircle, MessageSquare, Send } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-muted text-muted-foreground border-border' },
  in_progress: { label: 'In Progress', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  review: { label: 'In Review', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  revision: { label: 'Revision', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  completed: { label: 'Completed', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  cancelled: { label: 'Cancelled', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
}

export default function ProjectDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const { client } = useClientAuth()
  const queryClient = useQueryClient()
  const [comment, setComment] = useState('')

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['portal-project', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('projects').select('*').eq('id', id).maybeSingle()
      if (error) throw error
      return data
    },
    enabled: !!id && !!client,
  })

  const { data: updates } = useQuery({
    queryKey: ['portal-project-updates', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_updates')
        .select('*')
        .eq('project_id', id)
        .eq('is_internal', false)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data
    },
    enabled: !!id && !!client,
  })

  const { data: files } = useQuery({
    queryKey: ['portal-project-files', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!id && !!client,
  })

  const addCommentMutation = useMutation({
    mutationFn: async (message: string) => {
      const { error } = await supabase.from('project_updates').insert({
        project_id: id,
        message,
        is_internal: false,
        created_by: client?.user_id,
      })
      if (error) throw error
    },
    onSuccess: () => {
      setComment('')
      queryClient.invalidateQueries({ queryKey: ['portal-project-updates', id] })
      toast.success('Comment added')
    },
    onError: () => toast.error('Failed to add comment'),
  })

  const fileActionMutation = useMutation({
    mutationFn: async ({ fileId, action, feedback }: { fileId: string; action: 'approved' | 'revision_requested'; feedback?: string }) => {
      const { error } = await supabase
        .from('project_files')
        .update({ status: action, client_feedback: feedback || null })
        .eq('id', fileId)
      if (error) throw error
      await supabase.functions.invoke('file-notification', { body: { fileId, action } }).catch(() => {})
    },
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ['portal-project-files', id] })
      toast.success(action === 'approved' ? 'File approved!' : 'Revision requested')
    },
    onError: () => toast.error('Action failed'),
  })

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Project not found</p>
        <Link href="/portal/projects" className="text-primary hover:underline text-sm mt-2 inline-block">
          Back to projects
        </Link>
      </div>
    )
  }

  const statusInfo = statusConfig[project.status] || statusConfig.pending

  return (
    <>
      <div className="mb-6">
        <Link href="/portal/projects" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">{project.title}</h1>
          <span className={cn('text-xs px-2 py-0.5 rounded-full border w-fit', statusInfo.className)}>
            {statusInfo.label}
          </span>
        </div>
        {project.due_date && (
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Due {format(new Date(project.due_date), 'MMM d, yyyy')}
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {project.description && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-3">Project Description</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{project.description}</p>
            </div>
          )}

          {/* Files */}
          {files && files.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-4">Deliverables</h2>
              <div className="space-y-3">
                {files.map((file: any) => (
                  <div key={file.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{file.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(file.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.status === 'pending_review' && (
                        <>
                          <button
                            onClick={() => fileActionMutation.mutate({ fileId: file.id, action: 'approved' })}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-green-400 border border-green-500/30 rounded hover:bg-green-500/10 transition-colors"
                          >
                            <CheckCircle className="h-3 w-3" /> Approve
                          </button>
                          <button
                            onClick={() => {
                              const feedback = prompt('Revision notes:')
                              if (feedback) fileActionMutation.mutate({ fileId: file.id, action: 'revision_requested', feedback })
                            }}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-red-400 border border-red-500/30 rounded hover:bg-red-500/10 transition-colors"
                          >
                            <XCircle className="h-3 w-3" /> Revise
                          </button>
                        </>
                      )}
                      {file.status !== 'pending_review' && (
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded-full border',
                          file.status === 'approved' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                        )}>
                          {file.status === 'approved' ? 'Approved' : 'Revision Requested'}
                        </span>
                      )}
                      {file.file_url && (
                        <a href={file.file_url} target="_blank" rel="noopener noreferrer"
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Updates / Comments */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Updates
            </h2>

            {updates && updates.length > 0 ? (
              <div className="space-y-4 mb-6">
                {updates.map((update: any) => (
                  <div key={update.id} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{update.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-6">No updates yet.</p>
            )}

            {/* Add comment */}
            <div className="flex gap-2">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment or question..."
                rows={2}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                onClick={() => comment.trim() && addCommentMutation.mutate(comment.trim())}
                disabled={!comment.trim() || addCommentMutation.isPending}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {addCommentMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Project Details</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-muted-foreground">Service Type</dt>
                <dd className="text-sm text-foreground capitalize mt-0.5">{project.service_type?.replace(/_/g, ' ')}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Status</dt>
                <dd className="mt-0.5">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full border', statusInfo.className)}>
                    {statusInfo.label}
                  </span>
                </dd>
              </div>
              {project.priority && (
                <div>
                  <dt className="text-xs text-muted-foreground">Priority</dt>
                  <dd className="text-sm text-foreground capitalize mt-0.5">{project.priority}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-muted-foreground">Created</dt>
                <dd className="text-sm text-foreground mt-0.5">{format(new Date(project.created_at), 'MMM d, yyyy')}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  )
}
