'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { useClientAuth } from '@/hooks/use-client-auth'
import { toast } from 'sonner'
import { Download, Loader2, File, Image, CheckCircle, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const statusConfig: Record<string, { label: string; className: string }> = {
  pending_review: { label: 'Pending Review', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  approved: { label: 'Approved', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  revision_requested: { label: 'Revision Requested', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
}

function formatFileSize(bytes: number): string {
  if (!bytes) return '—'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export default function FilesPage() {
  const { client } = useClientAuth()
  const queryClient = useQueryClient()
  const [projectFilter, setProjectFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const { data: projects } = useQuery({
    queryKey: ['portal-projects-list'],
    queryFn: async () => {
      const { data, error } = await supabase.from('projects').select('id, title').order('title')
      if (error) throw error
      return data
    },
    enabled: !!client,
  })

  const { data: files, isLoading } = useQuery({
    queryKey: ['portal-all-files', projectFilter, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('project_files')
        .select('*, projects(id, title)')
        .order('created_at', { ascending: false })
      if (projectFilter !== 'all') query = query.eq('project_id', projectFilter)
      if (statusFilter !== 'all') query = query.eq('status', statusFilter)
      const { data, error } = await query
      if (error) throw error
      return data
    },
    enabled: !!client,
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
      queryClient.invalidateQueries({ queryKey: ['portal-all-files'] })
      toast.success(action === 'approved' ? 'File approved!' : 'Revision requested')
    },
    onError: () => toast.error('Action failed'),
  })

  const selectClass = 'px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50'

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Files</h1>
          <p className="text-muted-foreground mt-1">All deliverables across your projects</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className={selectClass}>
          <option value="all">All Projects</option>
          {projects?.map((p: any) => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
          <option value="all">All Status</option>
          <option value="pending_review">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="revision_requested">Revision Requested</option>
        </select>
        {(projectFilter !== 'all' || statusFilter !== 'all') && (
          <button
            onClick={() => { setProjectFilter('all'); setStatusFilter('all') }}
            className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : !files || files.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <File className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No files yet</h2>
          <p className="text-muted-foreground">Deliverables will appear here once your team uploads them.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file: any) => {
            const isImage = file.file_type?.startsWith('image/')
            const statusInfo = statusConfig[file.status] || statusConfig.pending_review
            return (
              <div key={file.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  {isImage ? <Image className="h-5 w-5 text-muted-foreground" /> : <File className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{file.file_name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {file.projects?.title && (
                      <span className="text-xs text-muted-foreground">{file.projects.title}</span>
                    )}
                    <span className="text-xs text-muted-foreground">{formatFileSize(file.file_size)}</span>
                    <span className="text-xs text-muted-foreground">{format(new Date(file.created_at), 'MMM d, yyyy')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full border', statusInfo.className)}>
                    {statusInfo.label}
                  </span>
                  {file.status === 'pending_review' && (
                    <>
                      <button
                        onClick={() => fileActionMutation.mutate({ fileId: file.id, action: 'approved' })}
                        className="p-1.5 text-green-400 border border-green-500/30 rounded hover:bg-green-500/10 transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          const feedback = prompt('Revision notes:')
                          if (feedback) fileActionMutation.mutate({ fileId: file.id, action: 'revision_requested', feedback })
                        }}
                        className="p-1.5 text-red-400 border border-red-500/30 rounded hover:bg-red-500/10 transition-colors"
                        title="Request revision"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  {file.file_url && (
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-muted-foreground hover:text-foreground border border-border rounded hover:border-primary/50 transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
