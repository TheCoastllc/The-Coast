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
  const since = searchParams.get('since')

  const conditions: Where[] = [{ client: { equals: client.id } }]
  if (since) {
    conditions.push({ createdAt: { greater_than_equal: since } })
  }
  const where: Where = conditions.length === 1 ? conditions[0] : { and: conditions }

  const result = await payload.find({
    collection: 'requests',
    where,
    overrideAccess: true,
  })

  return Response.json(result.docs)
}

export async function POST(request: Request) {
  const client = await getPortalClient(request)
  if (!client) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config: configPromise })
  const body = await request.json()

  const doc = await payload.create({
    collection: 'requests',
    data: {
      client: client.id,
      title: body.title,
      description: body.description,
      serviceType: body.serviceType,
      priority: body.priority || 'normal',
    },
    overrideAccess: true,
  })

  return Response.json(doc)
}
