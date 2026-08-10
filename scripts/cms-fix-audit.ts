/**
 * One-off remediation for the two CMS findings in the Aug 2026 QA audit.
 * Everything else from that audit was fixed in code and is already live; these
 * two live in the production database, so they need this script (or the same
 * edits by hand in the Payload admin).
 *
 *   TD-006  Six media records carry raw AI image-generation prompts as their
 *           public `alt` text. One (id 27) is a bare chatgpt.com conversation
 *           link, rendered on the /blog index. Replacements below were written
 *           by looking at each image, not by paraphrasing its prompt.
 *   TD-007  Terms of Service section 18.4 asserts marks for "Colony Manager",
 *           a product name that no longer exists (it is Colony / Colony+ANT),
 *           and names sibling products with no context, so they read on this
 *           site as unrelated companies.
 *
 * Usage (from the repo root) - two commands, no env juggling:
 *   vercel env pull .env.prod --environment=production --yes
 *   npx tsx scripts/cms-fix-audit.ts --dry     # print before/after, write nothing
 *   npx tsx scripts/cms-fix-audit.ts          # apply
 *
 * This file loads .env.prod itself on purpose. Sourcing it by hand is a trap in
 * zsh: `. .env.prod` searches $PATH for a name with no slash and fails with
 * "no such file or directory" even though the file is right there.
 *
 * Safe to re-run: it is idempotent and only touches these seven rows.
 * After applying, redeploy (or save any post in the admin) so the blog pages
 * revalidate: vercel deploy --prod --yes
 */
import { config as loadEnv } from 'dotenv'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@libsql/client'

const DRY = process.argv.includes('--dry')

// Resolve the env file from the REPO ROOT, not the shell's cwd, so this runs
// correctly from anywhere (including a fresh terminal sitting in ~).
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
console.log(ENV_FILE ? `env: ${ENV_FILE}` : 'env: process environment')
if (url.startsWith('file:')) {
  console.error(`DATABASE_URL points at a local file (${url}). This must run against production.`)
  process.exit(1)
}

const db = createClient({ url, authToken })

/** Descriptions written from viewing each image. */
const ALT_FIXES: Record<number, string> = {
  2: 'A navy hardcover brand style guide titled Brand Identity and System resting closed on a concrete ledge, beside an open copy showing a typography page, a black pen and a burnt-orange Pantone swatch card.',
  27: 'A dark two-part diagram: a finished website design labelled Visible Layer above, and the same screens shown as wireframe blueprints labelled Hidden Structure below.',
  33: 'Article cover for Brand Identity vs Design vs Strategy: the headline in white on black, tagged Design, Identity and Strategy, beside a black-and-white photo of a man gesturing mid-explanation.',
  34: 'Abstract dark artwork: an orange diamond mark at the centre of concentric orange rings, over a field of fine swirling lines.',
  35: 'Abstract dark artwork: an orange diamond mark at the centre of concentric orange rings, over a field of fine swirling lines.',
  36: 'Overhead view of a marketing planning session: sticky notes arranged in columns for objectives, audience, messaging, channels and metrics, beside printed competitor profiles and a laptop showing a quarterly overview.',
}

const TOS_FIND = 'The Coast, Autonomous Nexus Technology, Colony Manager, and related marks are protected.'
const TOS_REPLACE =
  'The Coast, Autonomous Nexus Technology, Colony, and related marks are protected. Autonomous Nexus Technology and Colony are affiliated products of the same owner.'

const OFFENDING =
  /https?:\/\/|hyper-realistic|photorealistic|no plastic skin|--ar|\b8k\b|1200x630|Editorial hero image|midjourney|dall-?e|stable diffusion/i

async function fixAlt() {
  console.log('\n=== TD-006  media alt text ===')
  let changed = 0
  for (const [idStr, next] of Object.entries(ALT_FIXES)) {
    const id = Number(idStr)
    const res = await db.execute({ sql: 'SELECT id, filename, alt FROM media WHERE id = ?', args: [id] })
    const row = res.rows[0] as unknown as { id: number; filename: string; alt: string } | undefined
    if (!row) {
      console.log(`  [${id}] not found - skipped`)
      continue
    }
    if (row.alt === next) {
      console.log(`  [${id}] ${row.filename} - already correct`)
      continue
    }
    console.log(`\n  [${id}] ${row.filename}`)
    console.log(`    before: ${String(row.alt).slice(0, 130)}`)
    console.log(`    after : ${next.slice(0, 130)}`)
    if (!DRY) {
      await db.execute({
        sql: 'UPDATE media SET alt = ?, updated_at = ? WHERE id = ?',
        args: [next, new Date().toISOString(), id],
      })
    }
    changed++
  }
  console.log(`\n  ${changed} record(s) ${DRY ? 'would change' : 'updated'}`)
}

async function fixTos() {
  console.log('\n=== TD-007  Terms of Service 18.4 ===')
  const res = await db.execute('SELECT id, content FROM terms_of_service LIMIT 1')
  const row = res.rows[0] as unknown as { id: number; content: string } | undefined
  if (!row) {
    console.log('  terms_of_service row not found - skipped')
    return
  }
  const raw = String(row.content)
  if (!raw.includes(TOS_FIND)) {
    console.log(raw.includes('Colony,') ? '  already corrected' : '  clause not found - inspect by hand')
    return
  }
  console.log(`  before: ${TOS_FIND}`)
  console.log(`  after : ${TOS_REPLACE}`)
  if (!DRY) {
    await db.execute({
      sql: 'UPDATE terms_of_service SET content = ?, updated_at = ? WHERE id = ?',
      args: [raw.replace(TOS_FIND, TOS_REPLACE), new Date().toISOString(), row.id],
    })
  }
}

async function verify() {
  console.log('\n=== verify ===')
  const media = await db.execute('SELECT id, filename, alt FROM media')
  const bad = (media.rows as unknown as { id: number; filename: string; alt: string }[]).filter(
    (r) => r.alt && OFFENDING.test(String(r.alt))
  )
  console.log(`  media rows with prompt-like or URL alt text: ${bad.length} (want 0)`)
  for (const r of bad) console.log(`    still bad: [${r.id}] ${r.filename}`)
  const tos = await db.execute('SELECT content FROM terms_of_service LIMIT 1')
  const raw = String((tos.rows[0] as unknown as { content?: string } | undefined)?.content ?? '')
  console.log(`  ToS still names "Colony Manager": ${raw.includes('Colony Manager')} (want false)`)
}

async function run() {
  console.log(DRY ? 'DRY RUN - nothing will be written' : 'APPLYING to production')
  await fixAlt()
  await fixTos()
  await verify()
  if (!DRY) console.log('\nNow redeploy so the blog pages revalidate: vercel deploy --prod --yes')
}

run()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
