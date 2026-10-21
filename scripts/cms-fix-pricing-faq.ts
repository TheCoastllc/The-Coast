/**
 * Removes the dead self-serve pricing tiers from the live FAQ.
 *
 * The "What is your pricing structure?" answer still advertises a SaaS product
 * that no longer exists: a free Starter plan "for freelancers and creative
 * beginners", a $25/month Professional plan with "unlimited projects", and a
 * $250/month Enterprise plan. It is the single loudest contradiction of the
 * premium studio positioning on the rest of the site, and it lives only in the
 * production database (the hardcoded fallback in the FAQ page never had it),
 * so it needs this script or the same edit by hand in the Payload admin.
 *
 * The replacement invents no numbers. It states the model the rest of the site
 * already describes - scope-and-value pricing, a discovery session, a written
 * fixed-scope proposal, retainers quoted per engagement - and says plainly
 * that there are no subscription tiers.
 *
 * Usage (from the repo root) - two commands, no env juggling:
 *   vercel env pull .env.prod --environment=production --yes
 *   npx tsx scripts/cms-fix-pricing-faq.ts --dry   # print before/after, write nothing
 *   npx tsx scripts/cms-fix-pricing-faq.ts         # apply
 *
 * Loads .env.prod itself on purpose: in zsh `. .env.prod` searches $PATH for a
 * slashless name and fails even though the file is right there.
 *
 * Idempotent - safe to re-run. Afterwards redeploy so /faq revalidates:
 *   vercel deploy --prod --yes
 * Remember to delete .env.prod when you are done (it holds live secrets).
 */
import { config as loadEnv } from 'dotenv'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@libsql/client'

const DRY = process.argv.includes('--dry')

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const ENV_FILE = ['.env.prod', '.env.production']
  .map((f) => join(REPO_ROOT, f))
  .find((f) => existsSync(f))
if (ENV_FILE) loadEnv({ path: ENV_FILE, override: true })

const url = (process.env.DATABASE_URL || '').replace(/^"|"$/g, '')
const authToken = (process.env.DATABASE_AUTH_TOKEN || '').replace(/^"|"$/g, '')

if (!url) {
  console.error(
    'DATABASE_URL is not set. Run this from the repo root after:\n' +
      '  vercel env pull .env.prod --environment=production --yes'
  )
  process.exit(1)
}
if (url.startsWith('file:')) {
  console.error(`DATABASE_URL points at a local file (${url}). This must run against production.`)
  process.exit(1)
}
console.log(ENV_FILE ? `env: ${ENV_FILE}` : 'env: process environment')
console.log(DRY ? 'mode: DRY RUN (no writes)\n' : 'mode: APPLY\n')

const NEW_ANSWER =
  'The Coast Global prices by scope and value, not by the hour. Every engagement opens with a ' +
  'discovery session where we map your goals, audience, competitors, and timeline, and you receive ' +
  'a written proposal with a fixed scope and a clear price - no hourly billing and no surprise ' +
  'invoices. Pricing reflects the work your brand actually needs: a standalone logo program is ' +
  'scoped differently from a full identity system with brand guidelines, website design, and launch ' +
  'collateral. For teams that need ongoing creative capacity after launch, we offer retainers sized ' +
  'to the volume and turnaround you require, quoted per engagement. We are a design studio, not a ' +
  'self-serve software product - there are no subscription tiers, and every project is custom work ' +
  'with senior attention from kickoff through launch.'

const db = createClient(authToken ? { url, authToken } : { url })

async function main() {
  // Payload stores an array field in its own table; find it rather than guessing.
  const tables = await db.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'faq%'"
  )
  const names = tables.rows.map((r) => String(r.name))
  console.log('faq tables:', names.join(', ') || '(none)')
  const table = names.find((n) => n.includes('items')) ?? names[0]
  if (!table) {
    console.error('No faq table found. Edit the FAQ global by hand in the Payload admin.')
    process.exit(1)
  }

  const rows = await db.execute(`SELECT * FROM "${table}"`)
  const stale = rows.rows.filter((r) =>
    /\$25\/month|\$250\/month|Starter plan \(free\)/i.test(String(r.answer ?? ''))
  )

  console.log(`\n${rows.rows.length} FAQ item(s); ${stale.length} carrying dead pricing tiers.\n`)
  if (stale.length === 0) {
    console.log('Nothing to do - the dead tiers are already gone.')
    return
  }

  for (const row of stale) {
    console.log('— question:', String(row.question))
    console.log('  BEFORE:', String(row.answer).slice(0, 220) + '…')
    console.log('  AFTER :', NEW_ANSWER.slice(0, 220) + '…')
    if (!DRY) {
      await db.execute({
        sql: `UPDATE "${table}" SET answer = ? WHERE id = ?`,
        args: [NEW_ANSWER, row.id as string],
      })
      console.log('  ✓ updated')
    }
  }

  console.log(
    DRY
      ? '\nDry run only - nothing written. Re-run without --dry to apply.'
      : '\nDone. Now redeploy so /faq revalidates:  vercel deploy --prod --yes'
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
