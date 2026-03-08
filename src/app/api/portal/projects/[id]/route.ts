import { getPortalClient } from '@/lib/portal-auth'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const client = await getPortalClient(request)
  if (!client) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const payload = await getPayload({ config: configPromise })

  const project = await payload.findByID({
    collection: 'projects',
    id,
    overrideAccess: true,
  })

  if (!project || project.client !== client.id) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  return Response.json(project)
}
