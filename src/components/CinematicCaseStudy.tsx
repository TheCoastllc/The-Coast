'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from 'motion/react'
import { CASE_STUDIES, CASE_STUDY_ORDER, type CaseStudyMeta } from '@/lib/case-studies'
import '@/styles/cinematic.css'

interface Props {
  projectId: string
}

// ── Section anchors used by the sticky nav ──
const SECTIONS = [
  { id: 'palette', num: '01', label: 'Palette' },
  { id: 'moments', num: '02', label: 'UI Moments' },
  { id: 'motion', num: '03', label: 'Motion' },
  { id: 'stats', num: '04', label: 'Numbers' },
  { id: 'stack', num: '05', label: 'Stack' },
] as const

// Decide swatch label color based on luminance
function isLight(hex: string): boolean {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 155
}

// Detect a leading numeric portion in a stat value (e.g. "10", "32", "6+", "$400K")
// and split it from any trailing text. Used to animate the counter portion only.
function parseStat(value: string): { num: number; suffix: string; prefix: string; isNumeric: boolean } {
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)([^\d]*.*)?$/)
  if (!match) return { num: 0, suffix: '', prefix: '', isNumeric: false }
  return {
    prefix: match[1] || '',
    num: parseFloat(match[2]),
    suffix: match[3] || '',
    isNumeric: true,
  }
}

// ── Animated stat number (counts up when in view) ──
function StatValue({ value }: { value: string }) {
  const parsed = parseStat(value)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const mv = useMotionValue(0)
  const rounded = useTransform(mv, (latest) => {
    if (parsed.num >= 100) return Math.round(latest).toLocaleString()
    if (parsed.num >= 10) return Math.round(latest).toString()
    return latest.toFixed(parsed.num % 1 === 0 ? 0 : 1)
  })

  useEffect(() => {
    if (inView && parsed.isNumeric) {
      const controls = animate(mv, parsed.num, {
        duration: 1.6,
        ease: [0.16, 1, 0.3, 1],
      })
      return () => controls.stop()
    }
  }, [inView, parsed.isNumeric, parsed.num, mv])

  if (!parsed.isNumeric) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="cs-case-stat-value"
      >
        {value}
      </motion.div>
    )
  }

  return (
    <div ref={ref} className="cs-case-stat-value">
      {parsed.prefix}
      <motion.span>{rounded}</motion.span>
      {parsed.suffix}
    </div>
  )
}

export default function CinematicCaseStudy({ projectId }: Props) {
  const project = CASE_STUDIES[projectId] as CaseStudyMeta | undefined
  const motionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [activeSection, setActiveSection] = useState<string>('palette')
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

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

  // Reveal-on-scroll for [data-reveal] elements
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

  // Scroll-spy: track which section is centered to highlight the sticky nav
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top || 0) - (b.boundingClientRect.top || 0))[0]
        if (visible) {
          const id = (visible.target as HTMLElement).dataset.section
          if (id) setActiveSection(id)
        }
      },
      { threshold: 0.25, rootMargin: '-80px 0px -50% 0px' },
    )
    document.querySelectorAll('[data-section]').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [project])

  // Lightbox keyboard navigation
  useEffect(() => {
    if (lightboxIdx === null) return
    const handler = (e: KeyboardEvent) => {
      if (!project?.moments) return
      if (e.key === 'Escape') setLightboxIdx(null)
      if (e.key === 'ArrowLeft' && lightboxIdx > 0) setLightboxIdx(lightboxIdx - 1)
      if (e.key === 'ArrowRight' && lightboxIdx < project.moments.length - 1)
        setLightboxIdx(lightboxIdx + 1)
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [lightboxIdx, project])

  if (!project) return null

  const orderedIds = CASE_STUDY_ORDER
  const idx = orderedIds.indexOf(projectId as (typeof orderedIds)[number])
  const next = CASE_STUDIES[orderedIds[(idx + 1) % orderedIds.length]]
  const nextId = orderedIds[(idx + 1) % orderedIds.length]

  const heroUrl = `/portfolio/${projectId}/hero.jpg`
  const coverUrl = `/portfolio/${projectId}/cover.jpg`
  const videoUrl = `/portfolio/${projectId}/video.webm`

  // Which sections actually exist for this project (filters nav)
  const availableSections = SECTIONS.filter((s) => {
    if (s.id === 'palette') return project.palette && project.palette.length > 0
    if (s.id === 'moments') return project.moments && project.moments.length > 0
    if (s.id === 'motion') return true
    if (s.id === 'stats') return project.stats && project.stats.length > 0
    if (s.id === 'stack') return project.stack && project.stack.length > 0
    return false
  })

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
      {/* Subtle page color wash — bleeds project brand into top of page */}
      <div className="cs-case-page-wash" aria-hidden="true" />

      <div className="cs-case-breadcrumb">
        <Link href="/work">← Work</Link>
        <span className="cs-case-breadcrumb-sep">/</span>
        <span>{project.client || projectId}</span>
      </div>

      {/* Sticky section nav */}
      <nav className="cs-case-nav" aria-label="Case study sections">
        <div className="cs-case-nav-inner">
          {availableSections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`cs-case-nav-link ${activeSection === s.id ? 'is-active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              <span className="cs-case-nav-num">{s.num}</span>
              <span className="cs-case-nav-label">{s.label}</span>
            </a>
          ))}
        </div>
      </nav>

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
        <section className="cs-case-palette" id="palette" data-section="palette" data-reveal>
          <div className="cs-case-section-label">01 · Palette</div>
          <div className="cs-case-palette-grid">
            {project.palette.map((hex, i) => (
              <motion.div
                key={hex + i}
                className="cs-case-swatch"
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={
                  {
                    ['--swatch' as never]: hex,
                    color: isLight(hex) ? '#0d0d0d' : '#f6f1e8',
                  } as React.CSSProperties
                }
              >
                <div className="cs-case-swatch-fill" />
                <div className="cs-case-swatch-label">{hex.toUpperCase()}</div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* UI moments */}
      {project.moments && project.moments.length > 0 && (
        <section className="cs-case-moments" id="moments" data-section="moments" data-reveal>
          <div className="cs-case-section-label">02 · UI moments</div>
          <div className="cs-case-moments-grid">
            {project.moments.map((m, i) => (
              <button
                key={m.image}
                type="button"
                className="cs-case-moment cs-case-moment-button"
                onClick={() => setLightboxIdx(i)}
                aria-label={`Open ${m.caption} in lightbox`}
              >
                <div className="cs-case-moment-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.image} alt={m.caption} loading="lazy" />
                  <div className="cs-case-moment-zoom" aria-hidden="true">↗</div>
                </div>
                <div className="cs-case-moment-cap">
                  <span>{m.caption}</span>
                  <span className="cs-case-moment-cap-num">/ {String(i + 1).padStart(2, '0')}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* In motion */}
      <section
        className="cs-case-motion"
        id="motion"
        data-section="motion"
        ref={motionRef}
        data-reveal
      >
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
        <section className="cs-case-stats" id="stats" data-section="stats" data-reveal>
          <div className="cs-case-section-label">04 · By the numbers</div>
          <div className="cs-case-stats-grid">
            {project.stats.map((s) => (
              <div key={s.label} className="cs-case-stat">
                <StatValue value={s.value} />
                <div className="cs-case-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Stack */}
      {project.stack && project.stack.length > 0 && (
        <section className="cs-case-stack" id="stack" data-section="stack" data-reveal>
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
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cs-case-cta-link"
          >
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

      {/* Lightbox modal for UI moments */}
      <AnimatePresence>
        {lightboxIdx !== null && project.moments && (
          <motion.div
            key="lightbox"
            className="cs-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightboxIdx(null)}
          >
            <button
              type="button"
              className="cs-lightbox-close"
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIdx(null)
              }}
              aria-label="Close lightbox"
            >
              ×
            </button>
            <motion.img
              key={project.moments[lightboxIdx].image}
              src={project.moments[lightboxIdx].image}
              alt={project.moments[lightboxIdx].caption}
              className="cs-lightbox-img"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="cs-lightbox-cap">
              <span>{project.moments[lightboxIdx].caption}</span>
              <span className="cs-lightbox-cap-num">
                {String(lightboxIdx + 1).padStart(2, '0')} / {String(project.moments.length).padStart(2, '0')}
              </span>
            </div>
            {project.moments.length > 1 && (
              <div className="cs-lightbox-nav">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setLightboxIdx(lightboxIdx > 0 ? lightboxIdx - 1 : project.moments!.length - 1)
                  }}
                  aria-label="Previous moment"
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setLightboxIdx((lightboxIdx + 1) % project.moments!.length)
                  }}
                  aria-label="Next moment"
                >
                  Next →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
