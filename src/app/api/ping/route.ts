import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * GET /api/ping
 *
 * Lightweight keep-alive endpoint for the Turso remote database.
 * Called every 12 hours by the Vercel Cron job defined in vercel.json.
 * Prevents the Turso free-tier database from entering sleep mode.
 *
 * Protected by CRON_SECRET — Vercel sets the Authorization header automatically.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config: configPromise })
    // Minimal query — just checks the DB is reachable
    await payload.find({ collection: 'posts', limit: 1, depth: 0 })
    return Response.json({ ok: true, ts: new Date().toISOString() })
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
