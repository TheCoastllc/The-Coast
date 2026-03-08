import { getPortalClient } from '@/lib/portal-auth'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: Request) {
  const client = await getPortalClient(request)
  if (!client) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config: configPromise })

  await payload.update({
    collection: 'clients',
    id: client.id,
    data: { status: 'active' },
    overrideAccess: true,
  })

  return Response.json({ success: true })
}
