// One-shot generator for ~/Downloads/coast-work-kit/
// Produces:
//   - Top-level: README.md, ASSETS.md, assets.json
//   - KIT/: data.ts (URLs rewritten), components, css, INTEGRATION.md, example-usage.tsx
//
// Run from the-coast repo root:
//   node scripts/build-work-kit.mjs
//
// Safe to re-run — wipes and rebuilds the output dir each time.

import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const REPO = path.resolve(import.meta.dirname, '..')
const OUT = path.join(os.homedir(), 'Downloads', 'coast-work-kit')
const KIT = path.join(OUT, 'KIT')

const SITE = 'https://coastglobal.org'

// ─── helpers ───────────────────────────────────────────────────────────────
function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true })
}
function bytes(p) {
  try {
    return fs.statSync(p).size
  } catch {
    return null
  }
}
function fmtBytes(b) {
  if (b == null) return '—'
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`
  return `${(b / 1024 / 1024).toFixed(1)} MB`
}
function readSrc(rel) {
  return fs.readFileSync(path.join(REPO, rel), 'utf8')
}
function write(p, contents) {
  fs.writeFileSync(p, contents)
  console.log(`  wrote ${path.relative(OUT, p) || '.'} (${fmtBytes(bytes(p))})`)
}

// ─── pull the case-study data from the repo ────────────────────────────────
async function loadCaseStudies() {
  // Use a small regex-driven extractor rather than dynamic import (TS).
  // We re-parse case-studies.ts to pull what we need for ASSETS.md.
  const src = readSrc('src/lib/case-studies.ts')

  // Project IDs in display order
  const orderMatch = src.match(/CASE_STUDY_ORDER = \[([\s\S]*?)\] as const/)
  if (!orderMatch) throw new Error('Could not parse CASE_STUDY_ORDER')
  const order = [...orderMatch[1].matchAll(/'([^']+)'/g)].map((m) => m[1])

  // Pull each project block { id: {...}, } — naive but works for this file
  const projects = []
  for (const id of order) {
    // Match either bare or quoted key, followed by {...} up to next top-level entry
    const keyRe = new RegExp(`(?:^|\\n)\\s+(?:'${id}'|${id}):\\s*{`, 'm')
    const startMatch = keyRe.exec(src)
    if (!startMatch) continue
    const start = startMatch.index + startMatch[0].length - 1 // at the `{`
    // Walk braces to find the matching close
    let depth = 0
    let end = start
    for (let i = start; i < src.length; i++) {
      const ch = src[i]
      if (ch === '{') depth++
      else if (ch === '}') {
        depth--
        if (depth === 0) {
          end = i + 1
          break
        }
      }
    }
    const block = src.slice(start, end)
    const pick = (key) => {
      const m = block.match(new RegExp(`${key}:\\s*'((?:[^'\\\\]|\\\\.)*)'`))
      return m ? m[1] : undefined
    }
    const pickArr = (key) => {
      const m = block.match(new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\]`, 'm'))
      if (!m) return []
      return [...m[1].matchAll(/'([^']*)'/g)].map((x) => x[1])
    }
    const pickBool = (key) => {
      const m = block.match(new RegExp(`${key}:\\s*(true|false)`))
      return m ? m[1] === 'true' : undefined
    }
    const pickNum = (key) => {
      const m = block.match(new RegExp(`${key}:\\s*(\\d+)`))
      return m ? Number(m[1]) : undefined
    }
    const moments = []
    const momentsBlock = block.match(/moments:\s*\[([\s\S]*?)\],?\n\s+stats/)
    if (momentsBlock) {
      const items = [
        ...momentsBlock[1].matchAll(
          /\{\s*image:\s*'([^']+)'\s*,\s*caption:\s*'([^']+)'\s*\}/g,
        ),
      ]
      for (const it of items) moments.push({ image: it[1], caption: it[2] })
    }

    projects.push({
      id,
      title: pick('title'),
      ready: pickBool('ready'),
      style: pick('style'),
      client: pick('client'),
      tagline: pick('tagline'),
      category: pick('category'),
      role: pickArr('role'),
      year: pickNum('year'),
      color: pick('color'),
      textColor: pick('textColor'),
      liveUrl: pick('liveUrl'),
      stack: pickArr('stack'),
      palette: pickArr('palette'),
      moments,
      summary: pick('summary'),
    })
  }
  return projects
}

// ─── 1. wipe + recreate dirs ───────────────────────────────────────────────
fs.rmSync(OUT, { recursive: true, force: true })
ensureDir(KIT)
console.log(`→ Building kit at ${OUT}`)

// ─── 2. copy components + css verbatim ─────────────────────────────────────
fs.copyFileSync(
  path.join(REPO, 'src/components/CinematicCaseStudy.tsx'),
  path.join(KIT, 'CinematicCaseStudy.tsx'),
)
fs.copyFileSync(
  path.join(REPO, 'src/components/CinematicWorkFeed.tsx'),
  path.join(KIT, 'CinematicWorkFeed.tsx'),
)
fs.copyFileSync(
  path.join(REPO, 'src/styles/cinematic.css'),
  path.join(KIT, 'cinematic.css'),
)
console.log(
  `  copied 3 source files (${fmtBytes(bytes(path.join(KIT, 'CinematicCaseStudy.tsx')))}, ${fmtBytes(bytes(path.join(KIT, 'CinematicWorkFeed.tsx')))}, ${fmtBytes(bytes(path.join(KIT, 'cinematic.css')))})`,
)

// ─── 3. data.ts with URLs rewritten to absolute ────────────────────────────
const dataSrc = readSrc('src/lib/case-studies.ts')
const dataPortable =
  `// Auto-generated by the-coast/scripts/build-work-kit.mjs.\n` +
  `// Same data as the-coast/src/lib/case-studies.ts, but with image paths\n` +
  `// rewritten to absolute URLs on ${SITE} so assets load cross-origin.\n` +
  `//\n` +
  `// To download assets locally, run the URLs in ASSETS.md / assets.json.\n\n` +
  dataSrc.replace(/'\/portfolio\//g, `'${SITE}/portfolio/`)
write(path.join(KIT, 'data.ts'), dataPortable)

// ─── 4. ASSETS.md + assets.json ────────────────────────────────────────────
const projects = await loadCaseStudies()
const ready = projects.filter((p) => p.ready && p.style === 'cinematic')

const jsonProjects = ready.map((p) => {
  const dir = `/portfolio/${p.id}`
  const file = (rel) => {
    const abs = path.join(REPO, 'public', dir, rel)
    return { url: `${dir}/${rel}`, bytes: bytes(abs) }
  }
  return {
    id: p.id,
    client: p.client,
    tagline: p.tagline,
    category: p.category,
    year: p.year,
    color: p.color,
    textColor: p.textColor,
    liveUrl: p.liveUrl,
    summary: p.summary,
    palette: p.palette,
    videoMp4: file('video.mp4'),
    videoWebm: file('video.webm'),
    cover: file('cover.jpg'),
    hero: file('hero.jpg'),
    moments: p.moments.map((m) => ({
      caption: m.caption,
      url: m.image,
      bytes: bytes(path.join(REPO, 'public', m.image)),
    })),
  }
})

write(
  path.join(OUT, 'assets.json'),
  JSON.stringify({ baseUrl: SITE, projects: jsonProjects }, null, 2) + '\n',
)

// ASSETS.md
const assetsMd = []
assetsMd.push(`# Coast /work — Asset Manifest`)
assetsMd.push('')
assetsMd.push(
  `Every cinematic scroll video + companion image from coastglobal.org/work, with brand colors and filesizes. All URLs are live and CORS-permissive — embed directly via \`<video src>\` / \`<img src>\` on any domain, or download with \`curl\` / \`wget\`.`,
)
assetsMd.push('')
assetsMd.push(`**Base URL:** \`${SITE}\``)
assetsMd.push(`**Total projects:** ${ready.length}`)
assetsMd.push('')
assetsMd.push(`---`)
assetsMd.push('')

for (const p of jsonProjects) {
  assetsMd.push(`## ${p.client}`)
  assetsMd.push('')
  assetsMd.push(`- **ID:** \`${p.id}\``)
  assetsMd.push(`- **Brand color:** \`${p.color}\``)
  if (p.textColor) assetsMd.push(`- **On-brand text:** \`${p.textColor}\``)
  if (p.palette?.length)
    assetsMd.push(
      `- **Palette:** ${p.palette.map((c) => `\`${c}\``).join(' · ')}`,
    )
  assetsMd.push(`- **Category:** ${p.category}`)
  if (p.liveUrl) assetsMd.push(`- **Live site:** ${p.liveUrl}`)
  if (p.tagline) assetsMd.push(`- **Tagline:** ${p.tagline}`)
  assetsMd.push('')
  assetsMd.push(`| File | URL | Size |`)
  assetsMd.push(`| --- | --- | ---: |`)
  if (p.videoMp4?.bytes != null) {
    assetsMd.push(
      `| Scroll video (MP4 — universal) | [${SITE}${p.videoMp4.url}](${SITE}${p.videoMp4.url}) | ${fmtBytes(p.videoMp4.bytes)} |`,
    )
  }
  if (p.videoWebm?.bytes != null) {
    assetsMd.push(
      `| Scroll video (WEBM — web-optimized) | [${SITE}${p.videoWebm.url}](${SITE}${p.videoWebm.url}) | ${fmtBytes(p.videoWebm.bytes)} |`,
    )
  }
  assetsMd.push(
    `| Cover | [${SITE}${p.cover.url}](${SITE}${p.cover.url}) | ${fmtBytes(p.cover.bytes)} |`,
  )
  assetsMd.push(
    `| Hero | [${SITE}${p.hero.url}](${SITE}${p.hero.url}) | ${fmtBytes(p.hero.bytes)} |`,
  )
  for (const m of p.moments) {
    assetsMd.push(
      `| ${m.caption} | [${SITE}${m.url}](${SITE}${m.url}) | ${fmtBytes(m.bytes)} |`,
    )
  }
  assetsMd.push('')
}

assetsMd.push(`---`)
assetsMd.push('')
assetsMd.push(`## Quick recipes`)
assetsMd.push('')
assetsMd.push(`**Embed a video on another site (browser picks best supported source):**`)
assetsMd.push('```html')
assetsMd.push(`<video autoplay loop muted playsinline`)
assetsMd.push(`       poster="${SITE}/portfolio/troi/cover.jpg">`)
assetsMd.push(`  <source src="${SITE}/portfolio/troi/video.webm" type="video/webm">`)
assetsMd.push(`  <source src="${SITE}/portfolio/troi/video.mp4"  type="video/mp4">`)
assetsMd.push(`</video>`)
assetsMd.push('```')
assetsMd.push('')
assetsMd.push(`**Download every MP4 (for Premiere / FCP / social uploads):**`)
assetsMd.push('```bash')
assetsMd.push(`mkdir -p videos && jq -r '.projects[] | .id + " " + .videoMp4.url' assets.json |`)
assetsMd.push(`  while read id url; do curl -o "videos/$id.mp4" "${SITE}$url"; done`)
assetsMd.push('```')
assetsMd.push('')
assetsMd.push(`**Download every WEBM (for web embeds):**`)
assetsMd.push('```bash')
assetsMd.push(`mkdir -p videos && jq -r '.projects[] | .id + " " + .videoWebm.url' assets.json |`)
assetsMd.push(`  while read id url; do curl -o "videos/$id.webm" "${SITE}$url"; done`)
assetsMd.push('```')
assetsMd.push('')

write(path.join(OUT, 'ASSETS.md'), assetsMd.join('\n'))

// ─── 5. KIT/INTEGRATION.md ─────────────────────────────────────────────────
const integrationMd = `# Integration guide

This folder is a portable copy of coastglobal.org's cinematic \`/work\` presentation:
the same components, CSS, and data that render the Coast case studies.

Drop it into any modern React-based project with two small swaps.

---

## What you get

| File | What it does |
| --- | --- |
| \`CinematicCaseStudy.tsx\` | Full case-study renderer — hero, sticky section nav, palette swatches, UI moments + lightbox, scroll video, animated stat counters, stack chips, next-case link |
| \`CinematicWorkFeed.tsx\` | \`/work\` index — sticky brand-color sections, one per project, with auto-play scroll video previews |
| \`cinematic.css\` | All styles, scoped under \`.cinematic\` so it can't collide with your site CSS |
| \`data.ts\` | Case-study data + types. Image paths point at \`${SITE}/portfolio/*\` so assets stream from the live CDN |
| \`example-usage.tsx\` | Minimal \"render one case study\" example |

---

## 1. Install deps

\`\`\`bash
npm install motion
# or: pnpm add motion / yarn add motion / bun add motion
\`\`\`

That's the **only** runtime dep. (Everything else is React + CSS.)

---

## 2. Load the fonts

The components reference two CSS variables, \`--font-display\` (PP Editorial New) and
\`--font-sans\` (PP Neue Montreal). Both come from Fontshare's free CDN.

Add to your site's \`<head>\`:

\`\`\`html
<link rel="preconnect" href="https://api.fontshare.com">
<link rel="preconnect" href="https://cdn.fontshare.com" crossorigin>
<link rel="stylesheet"
  href="https://api.fontshare.com/v2/css?f[]=neue-montreal@400,500,600,700&f[]=editorial-new@200,400,500,700&display=swap">
\`\`\`

And in your global CSS:

\`\`\`css
:root {
  --font-display: 'Editorial New', Georgia, serif;
  --font-sans: 'Neue Montreal', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
}
\`\`\`

If your site has its own Content Security Policy, allow:
- \`style-src https://api.fontshare.com\`
- \`font-src https://cdn.fontshare.com https://api.fontshare.com\`

---

## 3. Framework-specific swaps

### Next.js (App Router) — works as-is

Paste the files into \`src/\` and update the two internal imports:

\`\`\`tsx
import './cinematic.css'                              // adjust if needed
import { CASE_STUDIES, CASE_STUDY_ORDER } from './data'  // was '@/lib/case-studies'
\`\`\`

Components are server-rendered with a few \`'use client'\` interactives. No other changes.

### Astro

Components stay React. Render them as islands:

\`\`\`astro
---
import { CinematicCaseStudy } from '../components/CinematicCaseStudy.tsx'
---
<CinematicCaseStudy projectId="troi" client:load />
\`\`\`

Replace \`import Link from 'next/link'\` with:

\`\`\`tsx
const Link = ({ href, children, ...rest }: any) => <a href={href} {...rest}>{children}</a>
\`\`\`

Import the CSS once from your global layout: \`import '../styles/cinematic.css'\`.

### React + Vite (or CRA, Remix, TanStack Start, etc.)

Same as Astro — swap \`next/link\` for a plain anchor. CSS import is whatever your bundler accepts (\`import './cinematic.css'\` works in Vite + most setups).

### Vanilla HTML

The components don't apply, but you can still use the **data + assets** directly:

\`\`\`html
<section style="background:#18061e; color:#f6f1e8; min-height:100vh">
  <video autoplay loop muted playsinline
         poster="${SITE}/portfolio/troi/cover.jpg"
         src="${SITE}/portfolio/troi/video.webm"
         style="width:100%; height:auto"></video>
  <h2>TROI Trading &amp; Tech</h2>
</section>
\`\`\`

See \`../ASSETS.md\` for every URL.

---

## 4. Brand swap

These colors are hard-coded in \`cinematic.css\`. To match a new brand, find/replace
globally **before** dropping the CSS in:

| Token | Current | What it is |
| --- | --- | --- |
| \`#C9A24B\` | Coast gold | All accents, eyebrow text, buttons, sticky nav highlight |
| \`#0a0a0c\` | Near-black | Page canvas / dark section bg |
| \`#F0EAD6\` | Cream | Foreground text on dark |
| \`#18061e\` | TROI purple | One of the per-project brand colors (others come from \`data.ts\`) |

Project-specific colors (TROI purple, Kando mauve, Solomon navy, etc.) come from
\`data.ts\` \`color\` field and are applied inline — change them there.

---

## 5. Asset paths

\`data.ts\` ships pointing at \`${SITE}/portfolio/*\`. Two ways to use:

**Option A — hotlink (simplest).** Leave the URLs alone. Coast serves them with
permissive CORS, so video + img tags work from any origin.

**Option B — self-host.** Download via the URLs in \`../ASSETS.md\` (or the bash
recipe at the bottom of that file), put them in your own \`/public/portfolio/\`,
then find/replace \`${SITE}/portfolio/\` → \`/portfolio/\` in \`data.ts\`.

---

## 6. Minimal usage

\`\`\`tsx
// app/work/[id]/page.tsx
import { CinematicCaseStudy } from '@/components/CinematicCaseStudy'
import './cinematic.css'

export default function Page({ params }: { params: { id: string } }) {
  return <CinematicCaseStudy projectId={params.id} />
}
\`\`\`

\`\`\`tsx
// app/work/page.tsx
import { CinematicWorkFeed } from '@/components/CinematicWorkFeed'
import './cinematic.css'

export default function Page() {
  return <CinematicWorkFeed />
}
\`\`\`

That's the whole presentation.

---

## What's missing / what to customize

- The case studies in \`data.ts\` are Coast's. Edit/replace them with your own —
  the schema is documented inline at the top of the file.
- The Fontshare stylesheet has the four weights the components use. Add more if
  your custom copy needs them.
- There's no router-side prefetch. If you care about smooth route transitions in
  Next.js, wrap the nav links in \`next/link\` (the components already do this).
`

write(path.join(KIT, 'INTEGRATION.md'), integrationMd)

// ─── 6. KIT/example-usage.tsx ──────────────────────────────────────────────
const example = `// Drop this into any React app to render a single Coast case study.
// Adjust the import paths for your project structure.

import { CinematicCaseStudy } from './CinematicCaseStudy'
import { CinematicWorkFeed } from './CinematicWorkFeed'
import './cinematic.css'

// Available project IDs (see KIT/data.ts):
// troi · kando · solomon-katsman · amg-records · ogaticket · omotunde-hospital · iamd-health

export function SingleCaseStudy() {
  return <CinematicCaseStudy projectId="troi" />
}

export function WorkFeed() {
  return <CinematicWorkFeed />
}
`
write(path.join(KIT, 'example-usage.tsx'), example)

// ─── 7. top-level README ───────────────────────────────────────────────────
const readme = `# Coast Work Kit

Everything needed to reuse coastglobal.org's cinematic \`/work\` presentation on a
new site. Two paths depending on what you want.

---

## Path A — just the videos / images

You want to drop Coast's scroll videos onto a new site, but write your own layout.

→ Read **[ASSETS.md](./ASSETS.md)** — every URL, brand color, and filesize,
  organized by project. All assets live on coastglobal.org's CDN; embed them
  directly or download with curl.

For machines: same data in **[assets.json](./assets.json)**.

---

## Path B — the full presentation

You want the same cinematic case-study renderer Coast uses — sticky brand-color
sections, scroll videos, palette swatches, UI moments + lightbox, animated stat
counters — running in your own project.

→ Read **[KIT/INTEGRATION.md](./KIT/INTEGRATION.md)** — install steps and the
  one find-and-replace each common framework needs.

Files in \`KIT/\`:
- \`CinematicCaseStudy.tsx\` — full case-study renderer (~490 lines)
- \`CinematicWorkFeed.tsx\` — \`/work\` index page (~190 lines)
- \`cinematic.css\` — all styles, scoped under \`.cinematic\`
- \`data.ts\` — case-study data + types
- \`example-usage.tsx\` — minimal render example
- \`INTEGRATION.md\` — read this first

---

## How to hand this to a new Claude Code chat

\`\`\`bash
cd ~/Downloads/coast-work-kit
claude
\`\`\`

Then tell it:

> Read README.md. I'm building a new site and want to incorporate the assets
> and/or components from \`/work\`. Help me set this up in <framework>.

Or just drag-drop \`ASSETS.md\` (Path A) or \`KIT/INTEGRATION.md\` (Path B) into
a fresh chat as the seed message.

---

## Source

Generated from \`/Users/davidcoast/Downloads/the-coast\` on $(date +%Y-%m-%d).
Live site: <https://coastglobal.org/work>.
`
write(path.join(OUT, 'README.md'), readme)

console.log(`\n✓ Done. Open: ${OUT}`)
