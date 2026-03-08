import { getPortalClient } from '@/lib/portal-auth'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const client = await getPortalClient(request)
  if (!client) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { action, feedback } = body as {
    action: 'approved' | 'revision_requested'
    feedback?: string
  }

  const payload = await getPayload({ config: configPromise })

  // Get the file and verify ownership via project
  const file = await payload.findByID({
    collection: 'project-files',
    id,
    depth: 1,
    overrideAccess: true,
  })

  if (!file) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  // Verify the file's project belongs to this client
  const projectId = typeof file.project === 'object' ? file.project.id : file.project
  const project = await payload.findByID({
    collection: 'projects',
    id: projectId,
    overrideAccess: true,
  })

  if (!project || project.client !== client.id) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  const updated = await payload.update({
    collection: 'project-files',
    id,
    data: {
      status: action,
      clientFeedback: feedback || '',
    },
    overrideAccess: true,
  })

  return Response.json(updated)
}
