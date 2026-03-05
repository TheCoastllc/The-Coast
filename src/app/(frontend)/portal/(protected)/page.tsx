'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
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
      if (!client) return []
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', client.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!client,
  })

  const { data: pendingFiles } = useQuery({
    queryKey: ['portal-pending-files', client?.id],
    queryFn: async () => {
      if (!client) return []
      const { data, error } = await supabase
        .from('project_files')
        .select('*, projects!inner(client_id)')
        .eq('projects.client_id', client.id)
        .eq('status', 'pending_review')
      if (error) throw error
      return data
    },
    enabled: !!client,
  })

  const { data: monthlyRequests } = useQuery({
    queryKey: ['portal-monthly-requests', client?.id],
    queryFn: async () => {
      if (!client) return []
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)
      const { data, error } = await supabase
        .from('requests')
        .select('id')
        .eq('client_id', client.id)
        .gte('created_at', startOfMonth.toISOString())
      if (error) throw error
      return data
    },
    enabled: !!client,
  })

  const { data: recentUpdates } = useQuery({
    queryKey: ['portal-updates', client?.id],
    queryFn: async () => {
      if (!client) return []
      const { data, error } = await supabase
        .from('project_updates')
        .select('id, message, created_at, project_id, projects!inner(id, title, client_id)')
        .eq('projects.client_id', client.id)
        .eq('is_internal', false)
        .order('created_at', { ascending: false })
        .limit(5)
      if (error) throw error
      return data.map((update: any) => ({
        id: update.id,
        message: update.message,
        created_at: update.created_at,
        project: { id: update.projects.id, title: update.projects.title },
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
          Welcome back, {client?.contact_name}!
        </h1>
        <p className="text-muted-foreground mt-1">{client?.business_name}</p>
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
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${tierColors[client?.subscription_tier || ''] || tierColors.custom}`}
              >
                {client?.subscription_tier
                  ? client.subscription_tier.charAt(0).toUpperCase() + client.subscription_tier.slice(1)
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
                  serviceType={project.service_type}
                  status={project.status}
                  dueDate={project.due_date}
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
