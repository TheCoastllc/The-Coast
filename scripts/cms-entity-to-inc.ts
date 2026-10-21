/**
 * Retires "The Coast LLC" from the live legal documents.
 *
 * David owns both entities and chose The Coast Global Inc. as the single
 * public name (Oct 2026), explicitly waiving the Twilio objection. The site
 * source was swept in the same commit; the binding bodies of the Terms of
 * Service and Privacy Policy live in the production database, so they need
 * this script.
 *
 * It only ever swaps the company NAME - no other wording changes - so the
 * Twilio-approved consent structure and the partner wording keep their shape.
 *
 * Usage (from the repo root):
 *   vercel env pull .env.prod --environment=production --yes
 *   npx tsx scripts/cms-entity-to-inc.ts --dry    # show every hit, write nothing
 *   npx tsx scripts/cms-entity-to-inc.ts          # apply
 *   vercel deploy --prod --yes                    # revalidate /terms + /privacy
 *   rm .env.prod                                  # it holds live secrets
 *
 * Idempotent. Loads .env.prod itself (zsh `. .env.prod` fails on a slashless name).
 */
import { config as loadEnv } from 'dotenv'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@libsql/client'

const DRY = process.argv.includes('--dry')
const OLD = 'The Coast LLC'
const NEW = 'The Coast Global Inc.'

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const ENV_FILE = ['.env.prod', '.env.production'].map((f) => join(REPO_ROOT, f)).find((f) => existsSync(f))
if (ENV_FILE) loadEnv({ path: ENV_FILE, override: true })

const url = (process.env.DATABASE_URL || '').replace(/^"|"$/g, '')
const authToken = (process.env.DATABASE_AUTH_TOKEN || '').replace(/^"|"$/g, '')
if (!url) {
  console.error('DATABASE_URL not set. Run:\n  vercel env pull .env.prod --environment=production --yes')
  process.exit(1)
}
if (url.startsWith('file:')) {
  console.error(`DATABASE_URL points at a local file (${url}). This must run against production.`)
  process.exit(1)
}
console.log(ENV_FILE ? `env: ${ENV_FILE}` : 'env: process environment')
console.log(DRY ? 'mode: DRY RUN (no writes)\n' : 'mode: APPLY\n')

const db = createClient(authToken ? { url, authToken } : { url })

async function main() {
  // Find every table+text column actually holding the old name, rather than
  // guessing which columns the globals use.
  const tables = (await db.execute("SELECT name FROM sqlite_master WHERE type='table'"))
    .rows.map((r) => String(r.name))
    .filter((n) => !n.startsWith('sqlite_') && !n.startsWith('_litestream'))

  let hits = 0
  for (const table of tables) {
    let cols: string[]
    try {
      cols = (await db.execute(`PRAGMA table_info("${table}")`)).rows
        .filter((c) => /TEXT|CLOB|VARCHAR|JSON/i.test(String(c.type ?? '')))
        .map((c) => String(c.name))
    } catch { continue }
    if (cols.length === 0) continue

    for (const col of cols) {
      let rows
      try {
        rows = await db.execute({
          sql: `SELECT id, "${col}" AS v FROM "${table}" WHERE "${col}" LIKE ?`,
          args: [`%${OLD}%`],
        })
      } catch { continue }
      for (const row of rows.rows) {
        const before = String(row.v)
        const count = before.split(OLD).length - 1
        hits += count
        console.log(`— ${table}.${col} (id ${row.id}): ${count} occurrence(s)`)
        const i = before.indexOf(OLD)
        console.log(`    …${before.slice(Math.max(0, i - 70), i + OLD.length + 70).replace(/\s+/g, ' ')}…`)
        if (!DRY) {
          await db.execute({
            sql: `UPDATE "${table}" SET "${col}" = replace("${col}", ?, ?) WHERE id = ?`,
            args: [OLD, NEW, row.id as string],
          })
          console.log('    ✓ updated')
        }
      }
    }
  }

  console.log(`\n${hits} occurrence(s) of "${OLD}" found.`)
  console.log(DRY ? 'Dry run only - nothing written.' : 'Done. Redeploy so /terms and /privacy revalidate.')
}

main().catch((e) => { console.error(e); process.exit(1) })
