'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { CASE_STUDIES, CASE_STUDY_ORDER } from '@/lib/case-studies'
import { useVariant } from '@/components/visuals/useVariant'
import '@/styles/cinematic.css'

const year = new Date().getFullYear()

// Section colour treatments (preview via ?wk=). Each just sets the --section-*
// custom properties the CSS reads, so the markup/styles stay variant-agnostic.
//   accent (default) - the-coast ocean canvas + a per-client colour accent/glow
//   ocean            - pure ocean navy + gold, identical across every section
//   brand            - each client's full brand colour as the section background
export const WK_VARIANTS = ['accent', 'ocean', 'brand'] as const
type WkVariant = (typeof WK_VARIANTS)[number]

const OCEAN_BG =
  'radial-gradient(ellipse 96% 88% at 22% 4%, #0d2236 0%, #07131f 56%, #050e17 100%)'

function sectionVars(wk: WkVariant, p: { color?: string; textColor?: string }) {
  const client = p.color ?? '#C9A24B'
  if (wk === 'brand') {
    return {
      ['--section-bg' as never]: p.color ?? '#161616',
      ['--section-fg' as never]: p.textColor ?? '#f6f1e8',
      ['--section-accent' as never]: p.textColor ?? '#f6f1e8',
      ['--section-ink' as never]: p.color ?? '#0a121c',
    } as React.CSSProperties
  }
  if (wk === 'ocean') {
    return {
      ['--section-bg' as never]: OCEAN_BG,
      ['--section-fg' as never]: '#F0EAD6',
      ['--section-accent' as never]: '#C9A24B',
      ['--section-ink' as never]: '#0a121c',
    } as React.CSSProperties
  }
  // accent: ocean canvas TINTED with each client's colour (a deep, on-brand wash
  // - visible on every section, even dark clients) + a stronger colour bloom on the
  // media side, and a brightened-to-readable client colour for the small accents.
  return {
    ['--section-bg' as never]: `radial-gradient(ellipse 78% 70% at 82% 46%, color-mix(in srgb, ${client} 52%, transparent) 0%, transparent 72%), color-mix(in srgb, ${client} 24%, #08141f)`,
    ['--section-fg' as never]: '#F0EAD6',
    ['--section-accent' as never]: `color-mix(in srgb, ${client} 60%, #eaeef4)`,
    ['--section-ink' as never]: '#0a121c',
  } as React.CSSProperties
}

export default function CinematicWorkFeed() {
  const rootRef = useRef<HTMLDivElement>(null)
  const wk = useVariant('wk', WK_VARIANTS, 'accent')

  // Lazy-play hover videos on each section
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const sections = root.querySelectorAll<HTMLElement>('[data-tile]')
    const cleanups: Array<() => void> = []

    sections.forEach((section) => {
      const video = section.querySelector<HTMLVideoElement>('.t-video')
      if (!video) return
      const src = video.dataset.videoSrc
      if (!src) return
      let loaded = false
      const onEnter = () => {
        if (!loaded) {
          loaded = true
          video.src = src
          video.load()
        }
        video.play().catch(() => {})
        section.classList.add('is-playing')
      }
      const onLeave = () => {
        section.classList.remove('is-playing')
        video.pause()
      }
      section.addEventListener('mouseenter', onEnter)
      section.addEventListener('mouseleave', onLeave)
      cleanups.push(() => {
        section.removeEventListener('mouseenter', onEnter)
        section.removeEventListener('mouseleave', onLeave)
      })
    })

    return () => cleanups.forEach((fn) => fn())
  }, [])

  // Reveal-on-scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    document.querySelectorAll('[data-reveal]').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const ordered = CASE_STUDY_ORDER.map((id) => ({ id, ...CASE_STUDIES[id] }))
  const ready = ordered.filter((p) => p.ready)
  const placeholders = ordered.filter((p) => !p.ready)

  return (
    <div ref={rootRef} className="cinematic" data-wk={wk}>
      {/* Hero */}
      <section className="cs-work-hero" data-reveal>
        <h1>
          Selected <em>work.</em>
        </h1>
        <p className="sub">
          Brand transformations, cinematic web builds, and AI systems for ambitious operators and
          founders.
        </p>
      </section>

      {/* Cinematic sections — ready projects */}
      <div>
        {ready.map((p, i) => (
          <section
            key={p.id}
            className="cs-takeover-section"
            style={sectionVars(wk, p)}
            data-reveal
            data-tile
          >
            <div className="text">
              <div className="num">
                {String(i + 1).padStart(2, '0')} / {String(ordered.length).padStart(2, '0')}
              </div>
              <h3>{p.client || p.id}</h3>
              {p.tagline && <div className="tagline">{p.tagline}</div>}
              {p.summary && <p className="summary">{p.summary}</p>}
              {p.role && p.role.length > 0 && (
                <div className="roles">
                  {p.role.map((r) => (
                    <span key={r}>{r}</span>
                  ))}
                </div>
              )}
              <div className="cta-row">
                <Link href={`/work/${p.id}`} className="cta cta-primary">
                  Read case →
                </Link>
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta cta-secondary"
                  >
                    Visit live site
                  </a>
                )}
              </div>
            </div>
            <Link href={`/work/${p.id}`} className="media" aria-label={`Open ${p.client} case study`}>
              <div className="t-mockup">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="t-still"
                  src={`/portfolio/${p.id}/cover.jpg`}
                  alt={`${p.client} preview`}
                  loading="lazy"
                />
                <video
                  className="t-video"
                  data-video-src={`/portfolio/${p.id}/video.webm`}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden="true"
                />
              </div>
            </Link>
          </section>
        ))}

        {/* Placeholder sections — under-construction projects */}
        {placeholders.map((p, i) => (
          <section
            key={p.id}
            className="cs-takeover-section placeholder"
            style={sectionVars(wk, p)}
            data-reveal
          >
            <div className="text">
              <div className="num">
                {String(ready.length + i + 1).padStart(2, '0')} /{' '}
                {String(ordered.length).padStart(2, '0')}
              </div>
              <h3>{p.client || p.id}</h3>
              {p.tagline && <div className="tagline">{p.tagline}</div>}
              <div className="badge">In progress</div>
              <div className="cta-row">
                <Link href={`/work/${p.id}`} className="cta cta-secondary">
                  Preview →
                </Link>
              </div>
            </div>
            <div className="media">
              <div className="media-label">In progress · {year}</div>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
