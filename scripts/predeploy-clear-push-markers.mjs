/**
 * Runs in the Vercel build, before `payload migrate`.
 *
 * Production's schema was originally created via dev "push" (the one-off
 * push-schema-to-prod step), which leaves a row with batch = -1 in
 * `payload_migrations`. Payload's `migrate` command treats that marker as
 * "you pushed in dev mode" and shows an interactive "data loss" confirmation -
 * which, in a non-TTY build, silently cancels and migrate no-ops.
 *
 * Removing the batch = -1 marker lets `payload migrate` run normally. After the
 * first successful migrate (which records the baseline at batch >= 1) there is
 * nothing to clear, so this is a cheap no-op on every later deploy.
 *
 * Best-effort: never blocks a deploy. If it can't reach the DB it logs and exits 0.
 */
import { createClient } from '@libsql/client'

const url = process.env.DATABASE_URL
if (!url) {
  console.log('[predeploy] DATABASE_URL not set; skipping push-marker cleanup')
  process.exit(0)
}

const db = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN })

try {
  const table = await db.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='payload_migrations'",
  )
  if (table.rows.length === 0) {
    console.log('[predeploy] no payload_migrations table yet; nothing to clear')
    process.exit(0)
  }
  const res = await db.execute('DELETE FROM payload_migrations WHERE batch = -1')
  console.log(`[predeploy] cleared ${res.rowsAffected} dev-push marker(s) (batch=-1)`)
  process.exit(0)
} catch (err) {
  console.error('[predeploy] push-marker cleanup skipped:', err?.message || err)
  process.exit(0)
}
