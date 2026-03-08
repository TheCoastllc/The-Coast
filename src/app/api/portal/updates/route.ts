import { getPortalClient } from '@/lib/portal-auth'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(request: Request) {
  const client = await getPortalClient(request)
  if (!client) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config: configPromise })
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '5', 10)

  // Get client's project IDs
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

  const result = await payload.find({
    collection: 'project-updates',
    where: {
      project: { in: projectIds },
      isInternal: { equals: false },
    },
    sort: '-createdAt',
    limit,
    depth: 1, // populate project
    overrideAccess: true,
  })

  return Response.json(result.docs)
}
