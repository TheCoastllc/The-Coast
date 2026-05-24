'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { CASE_STUDIES, CASE_STUDY_ORDER, type CaseStudyMeta } from '@/lib/case-studies'
import '@/styles/cinematic.css'

interface Props {
  projectId: string
}

// Pick foreground for a swatch label based on its luminance
function isLight(hex: string): boolean {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 155
}

export default function CinematicCaseStudy({ projectId }: Props) {
  const project = CASE_STUDIES[projectId] as CaseStudyMeta | undefined
  const motionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Auto-play the "In motion" video when scrolled into view
  useEffect(() => {
    const section = motionRef.current
    const video = videoRef.current
    if (!section || !video) return
    const src = video.dataset.videoSrc
    if (!src) return
    let loaded = false
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (!loaded) {
              loaded = true
              video.src = src
              video.load()
            }
            video.play().catch(() => {})
            section.classList.add('is-playing')
          } else {
            video.pause()
            section.classList.remove('is-playing')
          }
        })
      },
      { threshold: 0.4 },
    )
    obs.observe(section)
    return () => obs.disconnect()
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

  if (!project) return null

  const orderedIds = CASE_STUDY_ORDER
  const idx = orderedIds.indexOf(projectId as (typeof orderedIds)[number])
  const next = CASE_STUDIES[orderedIds[(idx + 1) % orderedIds.length]]
  const nextId = orderedIds[(idx + 1) % orderedIds.length]

  const heroUrl = `/portfolio/${projectId}/hero.jpg`
  const coverUrl = `/portfolio/${projectId}/cover.jpg`
  const videoUrl = `/portfolio/${projectId}/video.webm`

  return (
    <main
      className="cinematic cs-case"
      style={
        {
          ['--case-bg' as never]: project.color ?? '#161616',
          ['--case-fg' as never]: project.textColor ?? '#f6f1e8',
        } as React.CSSProperties
      }
    >
      <div className="cs-case-breadcrumb">
        <Link href="/work">← Work</Link>
        <span className="cs-case-breadcrumb-sep">/</span>
        <span>{project.client || projectId}</span>
      </div>

      {/* Hero */}
      <section className="cs-case-hero">
        <div className="cs-case-hero-meta">
          <span>
            {String(idx + 1).padStart(2, '0')} / {String(orderedIds.length).padStart(2, '0')}
          </span>
          <span>{project.category || project.role?.[0]}</span>
          <span>{project.year}</span>
        </div>
        <h1 className="cs-case-h1">{project.client}</h1>
        {project.tagline && <p className="cs-case-tagline">{project.tagline}</p>}
        {project.role && project.role.length > 0 && (
          <div className="cs-case-roles">
            {project.role.map((r) => (
              <span key={r}>{r}</span>
            ))}
          </div>
        )}

        <div className="cs-case-hero-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroUrl} alt={`${project.client} site preview`} />
          <div className="cs-case-hero-overlay" />
        </div>
      </section>

      {/* Palette */}
      {project.palette && project.palette.length > 0 && (
        <section className="cs-case-palette" data-reveal>
          <div className="cs-case-section-label">01 · Palette</div>
          <div className="cs-case-palette-grid">
            {project.palette.map((hex) => (
              <div
                key={hex}
                className="cs-case-swatch"
                style={
                  {
                    ['--swatch' as never]: hex,
                    color: isLight(hex) ? '#0d0d0d' : '#f6f1e8',
                  } as React.CSSProperties
                }
              >
                <div className="cs-case-swatch-fill" />
                <div className="cs-case-swatch-label">{hex.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* UI moments */}
      {project.moments && project.moments.length > 0 && (
        <section className="cs-case-moments" data-reveal>
          <div className="cs-case-section-label">02 · UI moments</div>
          <div className="cs-case-moments-grid">
            {project.moments.map((m, i) => (
              <div key={m.image} className="cs-case-moment">
                <div className="cs-case-moment-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.image} alt={m.caption} loading="lazy" />
                </div>
                <div className="cs-case-moment-cap">
                  <span>{m.caption}</span>
                  <span className="cs-case-moment-cap-num">/ {String(i + 1).padStart(2, '0')}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* In motion */}
      <section className="cs-case-motion" ref={motionRef} data-reveal>
        <div className="cs-case-section-label">03 · In motion</div>
        <div className="cs-case-motion-frame">
          <div className="t-mockup">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="t-still" src={coverUrl} alt={`${project.client} preview`} loading="lazy" />
            <video
              ref={videoRef}
              className="t-video"
              data-video-src={videoUrl}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      {project.stats && project.stats.length > 0 && (
        <section className="cs-case-stats" data-reveal>
          <div className="cs-case-section-label">04 · By the numbers</div>
          <div className="cs-case-stats-grid">
            {project.stats.map((s) => (
              <div key={s.label} className="cs-case-stat">
                <div className="cs-case-stat-value">{s.value}</div>
                <div className="cs-case-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Stack */}
      {project.stack && project.stack.length > 0 && (
        <section className="cs-case-stack" data-reveal>
          <div className="cs-case-section-label">05 · Stack</div>
          <div className="cs-case-stack-list">
            {project.stack.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </section>
      )}

      {/* Live */}
      {project.liveUrl && (
        <section className="cs-case-live" data-reveal>
          <div className="cs-case-section-label">06 · Live</div>
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="cs-case-cta-link">
            Visit live site →
          </a>
          <div className="cs-case-live-url">{project.liveUrl.replace(/^https?:\/\//, '')}</div>
        </section>
      )}

      {/* Next */}
      {next && (
        <Link
          href={`/work/${nextId}`}
          className="cs-case-next"
          style={
            {
              ['--next-bg' as never]: next.color ?? '#161616',
              ['--next-fg' as never]: next.textColor ?? '#f6f1e8',
            } as React.CSSProperties
          }
        >
          <div className="cs-case-next-meta">
            <span>Up next</span>
            <span>
              {String(((idx + 1) % orderedIds.length) + 1).padStart(2, '0')} /{' '}
              {String(orderedIds.length).padStart(2, '0')}
            </span>
          </div>
          <div className="cs-case-next-name">{next.client || nextId}</div>
          {next.tagline && <div className="cs-case-next-tagline">{next.tagline}</div>}
          <div className="cs-case-next-cta">Open case →</div>
        </Link>
      )}
    </main>
  )
}
