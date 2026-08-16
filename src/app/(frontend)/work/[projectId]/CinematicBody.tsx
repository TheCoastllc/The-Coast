'use client'

import Image from 'next/image'
import { Reveal } from '@/components/motion/Reveal'
import { CursorReveal } from '@/components/visuals/CursorReveal'
import { useFxMode } from '@/components/visuals/useFxMode'
import { usePointerFine, useReducedMotion } from '@/lib/perf'
import { variantForIndex } from '@/components/motion/revealVariants'
import { ShineButton } from '@/components/ui/ShineButton'
import { TransitionLink } from '@/components/PageTransition'
import { CASE_STUDIES, CASE_STUDY_ORDER, type CaseStudyMeta } from '@/lib/case-studies'
import styles from './case.module.css'

interface Props {
  projectId: string
  /** Whether /portfolio/<id>/hero.jpg exists on disk - checked on the server. */
  hasHero?: boolean
  /** Whether /portfolio/<id>/video.webm exists on disk - checked on the server. */
  hasVideo?: boolean
}

/**
 * Ocean rebuild of the old CinematicCaseStudy body. Reads the rich project
 * metadata (palette / moments / motion / stats / stack / live) from
 * case-studies.ts - the single source of truth - and renders it as glass-framed
 * sections inside ChamberShell. The hero (title / tagline / index) is supplied
 * by ChamberShell in page.tsx, so this returns body sections only.
 */
export default function CinematicBody({ projectId, hasHero = true, hasVideo = true }: Props) {
  const project = CASE_STUDIES[projectId] as CaseStudyMeta | undefined
  const fxRaw = useFxMode()
  const fine = usePointerFine()
  const reduced = useReducedMotion()
  if (!project) return null

  // ?fx=lens preview: cursor-lens over the cover (desktop/cursor only)
  const lens = fine && !reduced && fxRaw === 'lens'
  const orderedIds = CASE_STUDY_ORDER
  const idx = orderedIds.indexOf(projectId as (typeof orderedIds)[number])
  const nextId = orderedIds[(idx + 1) % orderedIds.length]
  const next = CASE_STUDIES[nextId]

  /* These paths are conventions, not guarantees: several published projects
   * ship only a cover.jpg. prospry and dada-global-finance were both requesting
   * a hero.jpg and video.webm that do not exist, 404ing on a live case study.
   * The server tells us what is actually on disk, so fall back to the cover for
   * the hero and drop the video section entirely rather than render a broken
   * player. */
  const coverUrl = `/portfolio/${projectId}/cover.jpg`
  const heroUrl = hasHero ? `/portfolio/${projectId}/hero.jpg` : coverUrl
  const videoUrl = `/portfolio/${projectId}/video.webm`

  return (
    <>
      {/* Back link + meta */}
      <section className="section">
        <TransitionLink href="/work" className={styles.back} data-cursor-label="Back">
          ← Selected Work
        </TransitionLink>

        <div className={styles.metaRow} style={{ marginTop: '2rem' }}>
          {project.category && <span className={styles.tag}>{project.category}</span>}
          {project.year && <span className={styles.tag}>{project.year}</span>}
          {project.role?.map((r) => (
            <span key={r} className={styles.tag}>
              {r}
            </span>
          ))}
        </div>

        {project.summary && <p className="prose">{project.summary}</p>}
      </section>

      {/* Hero media */}
      <section className="section">
        <Reveal variant="mask-wipe">
          {lens ? (
            <CursorReveal
              images={[{ src: heroUrl, caption: project.client ?? projectId }]}
              columns={1}
              aspect="16 / 10"
            />
          ) : (
            <div className={`glass ${styles.frame}`}>
              <Image
                src={heroUrl}
                alt={`${project.client ?? projectId} site preview`}
                fill
                sizes="(max-width: 760px) 100vw, 1080px"
                className="object-cover"
                priority
                draggable={false}
              />
            </div>
          )}
        </Reveal>
      </section>

      {/* Palette */}
      {project.palette && project.palette.length > 0 && (
        <section className="section">
          <p className="sectionLabel">01 · Palette</p>
          <div className={styles.palette}>
            {project.palette.map((hex, i) => (
              <Reveal key={hex + i} variant={variantForIndex(i)}>
                <div className={styles.swatch}>
                  <div className={styles.swatchFill} style={{ background: hex }} />
                  <span className={styles.swatchLabel}>{hex.toUpperCase()}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* UI moments */}
      {project.moments && project.moments.length > 0 && (
        <section className="section">
          <p className="sectionLabel">02 · UI moments</p>
          <div className={styles.duo}>
            {project.moments.map((m, i) => (
              <Reveal key={m.image} variant={variantForIndex(i)}>
                <span className={styles.mediaLabel}>{m.caption}</span>
                <div className={`glass ${styles.frame} ${styles.frameTall}`}>
                  <Image
                    src={m.image}
                    alt={m.caption}
                    fill
                    sizes="(max-width: 760px) 100vw, 540px"
                    className="object-cover"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* In motion - only when the project actually has a video on disk */}
      {hasVideo && (
      <section className="section">
        <p className="sectionLabel">03 · In motion</p>
        <Reveal variant="mask-wipe">
          <div className={`glass ${styles.frame} ${styles.frameVideo}`}>
            <video
              poster={coverUrl}
              src={videoUrl}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
            />
          </div>
        </Reveal>
      </section>
      )}

      {/* By the numbers */}
      {project.stats && project.stats.length > 0 && (
        <section className="section">
          <p className="sectionLabel">04 · By the numbers</p>
          <div className={styles.stats}>
            {project.stats.map((s) => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Stack */}
      {project.stack && project.stack.length > 0 && (
        <section className="section">
          <p className="sectionLabel">05 · Stack</p>
          <div className={styles.stack}>
            {project.stack.map((s) => (
              <span key={s} className={styles.stackChip}>
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Live */}
      {project.liveUrl && (
        <section className="section">
          <p className="sectionLabel">06 · Live</p>
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.liveLink}>
            Visit live site →
          </a>
          <span className={styles.liveUrl}>{project.liveUrl.replace(/^https?:\/\//, '')}</span>
        </section>
      )}

      {/* Next project */}
      {next && (
        <section className="section">
          <p className="sectionLabel">Up next</p>
          <TransitionLink href={`/work/${nextId}`} className={`glass ${styles.nextCard}`} data-glow="gold" data-cursor-label="Open">
            <div className={styles.nextMeta}>
              <span>Up next</span>
              <span>
                {String(((idx + 1) % orderedIds.length) + 1).padStart(2, '0')} /{' '}
                {String(orderedIds.length).padStart(2, '0')}
              </span>
            </div>
            <span className={styles.nextName}>{next.client || nextId}</span>
            {next.tagline && <span className={styles.nextTagline}>{next.tagline}</span>}
            <span className={styles.nextCta}>Open case →</span>
          </TransitionLink>
        </section>
      )}

      {/* CTA */}
      <section className="section">
        <p className="sectionLabel">Start a project</p>
        <h2 className="sectionTitle">Let&apos;s build something that lasts.</h2>
        <div className={styles.ctaRow}>
          <ShineButton href="/get-started" size="md">
            Start a Project
          </ShineButton>
          <ShineButton href="/work" size="md" variant="ghost">
            View All Work
          </ShineButton>
        </div>
      </section>
    </>
  )
}
