'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useClientAuth } from '@/hooks/use-client-auth'
import ProjectCard from '@/components/portal/ProjectCard'
import { FolderKanban, PlusCircle, Loader2 } from 'lucide-react'

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'In Review' },
  { value: 'revision', label: 'Revision' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const serviceOptions = [
  { value: 'all', label: 'All Services' },
  { value: 'logo', label: 'Logo Design' },
  { value: 'flyer', label: 'Flyer' },
  { value: 'epk', label: 'EPK' },
  { value: 'social', label: 'Social Media' },
  { value: 'rebrand', label: 'Rebrand' },
  { value: 'website', label: 'Website' },
]

export default function ProjectsPage() {
  const { client } = useClientAuth()
  const [statusFilter, setStatusFilter] = useState('all')
  const [serviceFilter, setServiceFilter] = useState('all')

  const { data: projects, isLoading } = useQuery({
    queryKey: ['portal-all-projects', client?.id],
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

  const filteredProjects = projects?.filter((project: any) => {
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesService = serviceFilter === 'all' || project.service_type === serviceFilter
    return matchesStatus && matchesService
  }) || []

  const selectClass = 'px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50'

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Projects</h1>
          <p className="text-muted-foreground mt-1">Track progress on all your design projects</p>
        </div>
        <Link
          href="/portal/submit-request"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          New Request
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
          {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className={selectClass}>
          {serviceOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {(statusFilter !== 'all' || serviceFilter !== 'all') && (
          <button
            onClick={() => { setStatusFilter('all'); setServiceFilter('all') }}
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
      ) : filteredProjects.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <FolderKanban className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {projects?.length === 0 ? 'No projects yet' : 'No matching projects'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {projects?.length === 0
              ? 'Submit a request to get started!'
              : 'Try adjusting your filters to see more projects.'}
          </p>
          {projects?.length === 0 && (
            <Link
              href="/portal/submit-request"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              Submit Your First Request
            </Link>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project: any) => (
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

      {!isLoading && filteredProjects.length > 0 && (
        <p className="text-sm text-muted-foreground mt-4">
          Showing {filteredProjects.length} of {projects?.length} projects
        </p>
      )}
    </>
  )
}
