// Internal download hub for cinematic scroll videos + companion assets.
// Lives at /studio - noindex, intended for The Coast team.

import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import { CASE_STUDIES, CASE_STUDY_ORDER, type CaseStudyMeta } from '@/lib/case-studies'

export const metadata: Metadata = {
  title: 'Studio - Asset Downloads | The Coast',
  description: 'Internal download hub for cinematic scroll videos and case study assets.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://coastglobal.org/studio' },
}

// ── helpers ──────────────────────────────────────────────────────────────

const PUBLIC_DIR = path.join(process.cwd(), 'public')

function fileBytes(publicPath: string): number | null {
  try {
    const abs = path.join(PUBLIC_DIR, publicPath.replace(/^\//, ''))
    return fs.statSync(abs).size
  } catch {
    return null
  }
}

function formatBytes(b: number | null): string {
  if (b == null) return ' - '
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`
  return `${(b / 1024 / 1024).toFixed(1)} MB`
}

interface ProjectAssets {
  id: string
  meta: CaseStudyMeta
  files: { label: string; href: string; size: string; kind: 'video' | 'image' }[]
  mp4Href: string | null
  mp4Size: string
  webmHref: string | null
  webmSize: string
  // Preferred preview source for the inline <video> player. Webm renders fine
  // in Chrome/Firefox/Safari ≥14, and is smaller than mp4 here.
  previewHref: string | null
  coverHref: string | null
}

function buildAssets(id: string, meta: CaseStudyMeta): ProjectAssets {
  const dir = `/portfolio/${id}`
  const candidates: { label: string; rel: string; kind: 'video' | 'image' }[] = [
    { label: 'Scroll video (.mp4)', rel: 'video.mp4', kind: 'video' },
    { label: 'Scroll video (.webm)', rel: 'video.webm', kind: 'video' },
    { label: 'Cover image', rel: 'cover.jpg', kind: 'image' },
    { label: 'Hero image', rel: 'hero.jpg', kind: 'image' },
  ]
  // Pull caption-based moment files from the case study moments[] (already
  // declared in case-studies.ts) so each project lists exactly its moments.
  for (const m of meta.moments ?? []) {
    const fname = m.image.split('/').pop() ?? ''
    candidates.push({ label: m.caption, rel: fname, kind: 'image' })
  }

  const files = candidates
    .map((c) => {
      const href = `${dir}/${c.rel}`
      const bytes = fileBytes(href)
      if (bytes == null) return null
      return { label: c.label, href, size: formatBytes(bytes), kind: c.kind }
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  const mp4File = files.find((f) => f.href.endsWith('.mp4')) ?? null
  const webmFile = files.find((f) => f.href.endsWith('.webm')) ?? null
  const coverFile = files.find((f) => f.label === 'Cover image') ?? null

  return {
    id,
    meta,
    files,
    mp4Href: mp4File?.href ?? null,
    mp4Size: mp4File?.size ?? ' - ',
    webmHref: webmFile?.href ?? null,
    webmSize: webmFile?.size ?? ' - ',
    previewHref: webmFile?.href ?? mp4File?.href ?? null,
    coverHref: coverFile?.href ?? null,
  }
}

// Only cinematic, ready projects have scroll videos
const projects: ProjectAssets[] = CASE_STUDY_ORDER
  .map((id) => ({ id, meta: CASE_STUDIES[id] }))
  .filter(({ meta }) => meta.ready && meta.style === 'cinematic')
  .map(({ id, meta }) => buildAssets(id, meta))

export default function StudioPage() {
  const totalVideos = projects.filter((p) => p.mp4Href || p.webmHref).length

  return (
    <main
      style={{
        background: '#0a0a0c',
        color: '#F0EAD6',
        minHeight: '100vh',
        fontFamily: 'var(--font-sans)',
        paddingTop: '120px',
        paddingBottom: '120px',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 32px',
        }}
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <header style={{ marginBottom: '72px' }}>
          <div
            style={{
              fontFamily:
                "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
              fontSize: '11px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#E6B24D',
              marginBottom: '20px',
            }}
          >
            The Coast · Studio · Internal use
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(48px, 7vw, 96px)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              margin: 0,
              color: '#F0EAD6',
            }}
          >
            Asset{' '}
            <em
              style={{
                fontStyle: 'italic',
                color: '#E6B24D',
                fontWeight: 300,
              }}
            >
              downloads.
            </em>
          </h1>
          <p
            style={{
              marginTop: '24px',
              maxWidth: '680px',
              fontSize: '17px',
              lineHeight: 1.55,
              color: 'rgba(240, 234, 214, 0.7)',
            }}
          >
            Cinematic scroll videos and full asset bundles for every live
            Coast case study. Each project ships both <strong style={{color:'#E6B24D'}}>.mp4</strong>{' '}
            (universal - Premiere, Final Cut, iMovie, social uploads) and{' '}
            <strong style={{color:'#E6B24D'}}>.webm</strong> (smaller, web embeds).
            Use the per-file download buttons. {totalVideos} videos available.
          </p>

          {/* anchor nav */}
          <div
            style={{
              marginTop: '40px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              fontFamily:
                "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
              fontSize: '11px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            {projects.map((p, i) => (
              <a
                key={p.id}
                href={`#${p.id}`}
                style={{
                  padding: '8px 14px',
                  border: '1px solid rgba(201, 162, 75, 0.3)',
                  borderRadius: '999px',
                  color: '#E6B24D',
                  textDecoration: 'none',
                  background: 'rgba(201, 162, 75, 0.04)',
                }}
              >
                {String(i + 1).padStart(2, '0')} · {p.meta.client}
              </a>
            ))}
          </div>
        </header>

        {/* ── Project cards ──────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
          {projects.map((p, idx) => (
            <ProjectCard key={p.id} project={p} index={idx} />
          ))}
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer
          style={{
            marginTop: '120px',
            paddingTop: '32px',
            borderTop: '1px solid rgba(201, 162, 75, 0.18)',
            fontFamily:
              "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
            fontSize: '11px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: 'rgba(240, 234, 214, 0.4)',
          }}
        >
          Internal use only · The Coast ·{' '}
          <a href="/work" style={{ color: '#E6B24D' }}>
            ← Back to /work
          </a>
          {' · '}
          <a href="/studio/logout" style={{ color: '#E6B24D' }}>
            Sign out
          </a>
        </footer>
      </div>
    </main>
  )
}

// ── Project card ─────────────────────────────────────────────────────────

function ProjectCard({
  project,
  index,
}: {
  project: ProjectAssets
  index: number
}) {
  const { id, meta, files, mp4Href, mp4Size, webmHref, webmSize, previewHref } =
    project
  const brand = meta.color ?? '#E6B24D'

  return (
    <section
      id={id}
      style={{
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(201, 162, 75, 0.14)',
        borderRadius: '4px',
        padding: '40px',
        scrollMarginTop: '120px',
      }}
    >
      {/* eyebrow row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontFamily:
            "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
          fontSize: '11px',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: 'rgba(240, 234, 214, 0.5)',
          marginBottom: '20px',
        }}
      >
        <span style={{ color: '#E6B24D' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span>{meta.category}</span>
        <span>·</span>
        <span>{meta.year}</span>
        <span
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          Brand
          <span
            aria-hidden
            style={{
              display: 'inline-block',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: brand,
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          />
          <code style={{ color: 'rgba(240,234,214,0.8)' }}>{brand}</code>
        </span>
      </div>

      {/* title row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          alignItems: 'end',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 4.2vw, 56px)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              margin: 0,
              color: '#F0EAD6',
            }}
          >
            {meta.client}
          </h2>
          <p
            style={{
              marginTop: '10px',
              marginBottom: 0,
              fontSize: '15px',
              color: 'rgba(240, 234, 214, 0.6)',
              maxWidth: '560px',
            }}
          >
            {meta.tagline}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {mp4Href && (
            <a
              href={mp4Href}
              download
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 22px',
                background: '#E6B24D',
                color: '#0a0a0c',
                fontFamily:
                  "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
                fontSize: '12px',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: '2px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                justifyContent: 'center',
              }}
            >
              ↓ MP4 · {mp4Size}
            </a>
          )}
          {webmHref && (
            <a
              href={webmHref}
              download
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 22px',
                background: 'transparent',
                color: '#E6B24D',
                fontFamily:
                  "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
                fontSize: '11px',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: '2px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                border: '1px solid rgba(201, 162, 75, 0.4)',
                justifyContent: 'center',
              }}
            >
              ↓ WEBM · {webmSize}
            </a>
          )}
        </div>
      </div>

      {/* preview + file list */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: '32px',
          alignItems: 'start',
        }}
      >
        {/* video preview */}
        {previewHref ? (
          <div
            style={{
              position: 'relative',
              aspectRatio: '16 / 10',
              background: brand,
              overflow: 'hidden',
              borderRadius: '2px',
            }}
          >
            <video
              poster={project.coverHref ?? undefined}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            >
              {webmHref && <source src={webmHref} type="video/webm" />}
              {mp4Href && <source src={mp4Href} type="video/mp4" />}
            </video>
          </div>
        ) : (
          <div
            style={{
              aspectRatio: '16 / 10',
              background: brand,
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: meta.textColor ?? '#fff',
              fontFamily:
                "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              opacity: 0.7,
            }}
          >
            No video available
          </div>
        )}

        {/* file table */}
        <div>
          <div
            style={{
              fontFamily:
                "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
              fontSize: '10px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: 'rgba(240, 234, 214, 0.45)',
              marginBottom: '14px',
            }}
          >
            {files.length} files · /portfolio/{id}/
          </div>
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {files.map((f) => (
              <li
                key={f.href}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(201, 162, 75, 0.08)',
                  fontSize: '13px',
                }}
              >
                <span
                  style={{
                    color: 'rgba(240, 234, 214, 0.88)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '6px',
                      background:
                        f.kind === 'video' ? '#E6B24D' : 'rgba(240,234,214,0.4)',
                      borderRadius: '50%',
                      marginRight: '10px',
                      verticalAlign: 'middle',
                    }}
                  />
                  {f.label}
                </span>
                <span
                  style={{
                    fontFamily:
                      "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
                    fontSize: '11px',
                    color: 'rgba(240, 234, 214, 0.5)',
                    letterSpacing: '0.5px',
                  }}
                >
                  {f.size}
                </span>
                <a
                  href={f.href}
                  download
                  style={{
                    fontFamily:
                      "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
                    fontSize: '10px',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: '#E6B24D',
                    textDecoration: 'none',
                    padding: '6px 12px',
                    border: '1px solid rgba(201, 162, 75, 0.3)',
                    borderRadius: '2px',
                  }}
                >
                  ↓ Save
                </a>
              </li>
            ))}
          </ul>

          {meta.liveUrl && (
            <a
              href={meta.liveUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-block',
                marginTop: '18px',
                fontFamily:
                  "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
                fontSize: '11px',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: 'rgba(240, 234, 214, 0.55)',
                textDecoration: 'none',
              }}
            >
              View live site ↗
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
