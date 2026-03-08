import { auth } from '@/lib/auth'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getPortalClient(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return null

  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'clients',
    where: { betterAuthUserId: { equals: session.user.id } },
    limit: 1,
    overrideAccess: true,
  })

  return docs[0] || null
}
