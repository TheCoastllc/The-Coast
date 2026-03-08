'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useClientAuth } from '@/hooks/use-client-auth'
import StatsCard from '@/components/portal/StatsCard'
import ProjectCard from '@/components/portal/ProjectCard'
import UpdatesFeed from '@/components/portal/UpdatesFeed'
import {
  FolderKanban,
  FileCheck,
  CalendarDays,
  Crown,
  PlusCircle,
  FileText,
  Loader2,
} from 'lucide-react'

export default function PortalDashboard() {
  const { client } = useClientAuth()

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['portal-projects', client?.id],
    queryFn: async () => {
      const res = await fetch('/api/portal/projects')
      if (!res.ok) throw new Error('Failed to fetch projects')
      return res.json()
    },
    enabled: !!client,
  })

  const { data: pendingFiles } = useQuery({
    queryKey: ['portal-pending-files', client?.id],
    queryFn: async () => {
      const res = await fetch('/api/portal/files?status=pending_review')
      if (!res.ok) throw new Error('Failed to fetch files')
      return res.json()
    },
    enabled: !!client,
  })

  const { data: monthlyRequests } = useQuery({
    queryKey: ['portal-monthly-requests', client?.id],
    queryFn: async () => {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)
      const res = await fetch(`/api/portal/requests?since=${startOfMonth.toISOString()}`)
      if (!res.ok) throw new Error('Failed to fetch requests')
      return res.json()
    },
    enabled: !!client,
  })

  const { data: recentUpdates } = useQuery({
    queryKey: ['portal-updates', client?.id],
    queryFn: async () => {
      const res = await fetch('/api/portal/updates?limit=5')
      if (!res.ok) throw new Error('Failed to fetch updates')
      const updates = await res.json()
      return updates.map((update: any) => ({
        id: update.id,
        message: update.message,
        created_at: update.createdAt,
        project: typeof update.project === 'object'
          ? { id: update.project.id, title: update.project.title }
          : { id: update.project, title: '' },
      }))
    },
    enabled: !!client,
  })

  const activeProjects = projects?.filter((p: any) =>
    ['pending', 'in_progress', 'review', 'revision'].includes(p.status)
  ) || []

  const tierColors: Record<string, string> = {
    starter: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    pro: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    ultimate: 'bg-primary/20 text-primary border-primary/30',
    custom: 'bg-muted text-foreground border-border',
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Welcome back, {client?.contactName}!
        </h1>
        <p className="text-muted-foreground mt-1">{client?.businessName}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Active Projects"
          value={activeProjects.length}
          icon={<FolderKanban className="h-5 w-5" />}
          variant="primary"
        />
        <StatsCard
          title="Pending Review"
          value={pendingFiles?.length || 0}
          subtitle="Files awaiting approval"
          icon={<FileCheck className="h-5 w-5" />}
          variant={pendingFiles?.length ? 'warning' : 'default'}
        />
        <StatsCard
          title="This Month"
          value={monthlyRequests?.length || 0}
          subtitle="Requests submitted"
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Subscription</p>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${tierColors[client?.subscriptionTier || ''] || tierColors.custom}`}
              >
                {client?.subscriptionTier
                  ? client.subscriptionTier.charAt(0).toUpperCase() + client.subscriptionTier.slice(1)
                  : 'Not set'}
              </span>
            </div>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Crown className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Active Projects</h2>
            {projects && projects.length > 0 && (
              <Link href="/portal/projects" className="text-sm text-primary hover:underline">
                View All
              </Link>
            )}
          </div>

          {projectsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : activeProjects.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-medium">No active projects</p>
              <p className="text-sm text-muted-foreground mt-1">Submit a request to start your first project</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {activeProjects.slice(0, 4).map((project: any) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  serviceType={project.serviceType}
                  status={project.status}
                  dueDate={project.dueDate}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <UpdatesFeed updates={recentUpdates || []} />

          <div className="bg-card border border-border rounded-xl p-6 space-y-3">
            <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
            <Link
              href="/portal/submit-request"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              Submit New Request
            </Link>
            <Link
              href="/portal/files"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 border border-border text-foreground rounded-lg text-sm font-medium hover:border-primary hover:bg-primary/10 transition-all"
            >
              <FileText className="h-4 w-4" />
              View All Files
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
