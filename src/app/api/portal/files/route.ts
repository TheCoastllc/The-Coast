import { getPortalClient } from '@/lib/portal-auth'
import { getPayload } from 'payload'
import type { Where } from 'payload'
import configPromise from '@payload-config'

export async function GET(request: Request) {
  const client = await getPortalClient(request)
  if (!client) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config: configPromise })
  const { searchParams } = new URL(request.url)
  const projectFilter = searchParams.get('project')
  const statusFilter = searchParams.get('status')

  // First get all client's project IDs
  const projects = await payload.find({
    collection: 'projects',
    where: { client: { equals: client.id } },
    overrideAccess: true,
    limit: 1000,
  })
  const projectIds = projects.docs.map((p) => p.id)

  if (projectIds.length === 0) {
    return Response.json([])
  }

  // Build where clause for files
  const conditions: Where[] = []
  if (projectFilter) {
    conditions.push({ project: { equals: projectFilter } })
  } else {
    conditions.push({ project: { in: projectIds } })
  }
  if (statusFilter) {
    conditions.push({ status: { equals: statusFilter } })
  }
  const where: Where = conditions.length === 1 ? conditions[0] : { and: conditions }

  const result = await payload.find({
    collection: 'project-files',
    where,
    sort: '-createdAt',
    overrideAccess: true,
    depth: 1, // populate project relationship
  })

  return Response.json(result.docs)
}
