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
  const fields = searchParams.get('fields')

  const result = await payload.find({
    collection: 'projects',
    where: { client: { equals: client.id } },
    sort: '-createdAt',
    overrideAccess: true,
  })

  if (fields === 'id,title') {
    return Response.json(result.docs.map((p) => ({ id: p.id, title: p.title })))
  }

  return Response.json(result.docs)
}
