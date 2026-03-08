import { getPortalClient } from '@/lib/portal-auth'

export async function GET(request: Request) {
  const client = await getPortalClient(request)
  if (!client) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return Response.json(client)
}
