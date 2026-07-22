/* CMS brand sweep: posts + FAQ global. "The Coast" -> "The Coast Global"
 * except: "The Coast LLC" and "The Coast Global" (already done).
 * Gallery excluded (section keys are matched lowercase in code).
 * DRY_RUN=1 lists matches without writing. */
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const DRY = process.env.DRY_RUN === '1'
const PAT = /The Coast(?! Global| LLC)/g

function walk(node: unknown, hits: string[], path = ''): unknown {
  if (typeof node === 'string') {
    if (PAT.test(node)) {
      PAT.lastIndex = 0
      hits.push(`${path}: ${node.slice(0, 110)}`)
      return node.replace(PAT, 'The Coast Global')
    }
    return node
  }
  if (Array.isArray(node)) return node.map((v, i) => walk(v, hits, `${path}[${i}]`))
  if (node && typeof node === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(node)) {
      // never rewrite ids, slugs, or URLs
      if (['id', 'slug', 'url', 'src', 'href'].includes(k)) out[k] = v
      else out[k] = walk(v, hits, path ? `${path}.${k}` : k)
    }
    return out
  }
  return node
}

const run = async () => {
  const payload = await getPayload({ config: configPromise })

  // posts
  const { docs } = await payload.find({ collection: 'posts', limit: 1000, depth: 0 })
  let changed = 0
  for (const doc of docs as any[]) {
    const hits: string[] = []
    const next = walk(
      { title: doc.title, excerpt: doc.excerpt, directAnswer: doc.directAnswer, content: doc.content },
      hits,
      `post:${doc.slug}`
    ) as any
    if (hits.length) {
      changed++
      console.log(`\n--- post ${doc.slug} (${hits.length} hits)`)
      hits.forEach((h) => console.log('  ' + h))
      if (!DRY) {
        // send only fields that actually changed, so untouched fields with
        // legacy validation issues do not block the update
        const data: Record<string, unknown> = {}
        for (const k of ['title', 'excerpt', 'directAnswer', 'content'] as const) {
          if (JSON.stringify((doc as any)[k]) !== JSON.stringify(next[k])) data[k] = next[k]
        }
        try {
          await payload.update({ collection: 'posts', id: doc.id, data, context: { scriptUpdate: true } })
          console.log('  UPDATED ' + Object.keys(data).join(','))
        } catch (e) {
          console.log('  FAILED ' + doc.slug + ': ' + String(e).slice(0, 160))
        }
      }
    }
  }

  // FAQ global
  try {
    const faq = (await payload.findGlobal({ slug: 'faq' as any, depth: 0 })) as any
    const hits: string[] = []
    const { id: _id, ...rest } = faq
    const next = walk(rest, hits, 'faq') as any
    if (hits.length) {
      console.log(`\n--- FAQ global (${hits.length} hits)`)
      hits.forEach((h) => console.log('  ' + h))
      if (!DRY) {
        await payload.updateGlobal({ slug: 'faq' as any, data: next })
        console.log('  UPDATED')
      }
    }
  } catch (e) {
    console.log('FAQ global: ' + String(e).slice(0, 120))
  }

  console.log(`\n${DRY ? 'DRY RUN' : 'APPLIED'}: ${changed} posts with matches`)
  process.exit(0)
}
run()
