/**
 * One-time bootstrap script: promote a user to admin by email.
 *
 * Usage:
 *   bun run scripts/make-admin.ts <email>
 *   bun run scripts/make-admin.ts Hello@coastglobal.org
 *
 * Requires env vars: DATABASE_URL, DATABASE_AUTH_TOKEN, PAYLOAD_SECRET
 * These are read from .env.local automatically when run with bun.
 */
import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'

const email = process.argv[2]

if (!email) {
  console.error('Usage: bun run scripts/make-admin.ts <email>')
  process.exit(1)
}

async function run() {
  await payload.init({ config })

  const { docs } = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })

  if (!docs.length) {
    console.error(`No user found with email: ${email}`)
    process.exit(1)
  }

  const user = docs[0] as any
  console.log(`Found: ${user.fullName ?? user.email} — current role: ${user.role ?? '(unset)'}`)

  await payload.update({
    collection: 'users',
    id: user.id,
    data: { role: 'admin' },
    overrideAccess: true,
  })

  console.log(`✓ ${user.fullName ?? user.email} is now admin`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
