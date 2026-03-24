'use client'

import { useRef, useCallback } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DecorIcon } from '@/components/ui/decor-icon'
import { FullWidthDivider } from '@/components/ui/full-width-divider'
import { SectionBoundary } from '@/components/blueprint-layout'
import { ShineButton } from '@/components/ui/ShineButton'
import { usePageTransition } from '@/components/PageTransition'
import TextReveal from '@/components/TextReveal'

const projects = [
  {
    title: 'Zapped Co',
    category: 'Branding',
    number: '01',
    tags: ['Visual Identity', 'Strategy'],
    year: '2025',
    image: '/portfolio/zappedco/cover.jpg',
    projectId: 'zappedco',
    description:
      "Strategic brand refresh that electrified a tech startup's market presence — from concept to full identity system.",
  },
  {
    title: 'AMG Records',
    category: 'Branding',
    number: '02',
    tags: ['Logo Design', 'Brand Identity'],
    year: '2026',
    image: '/portfolio/amg-records/cover.jpg',
    projectId: 'amg-records',
    description:
      'A bold visual identity for a record label pushing boundaries in sound and culture.',
  },
  {
    title: 'OgaTicket',
    category: 'Development',
    number: '03',
    tags: ['Web Design', 'UX/UI'],
    year: '2026',
    image: '/portfolio/ogaticket/cover.png',
    projectId: 'ogaticket',
    description: "End-to-end digital platform for Africa's next-gen event ticketing experience.",
  },
  {
    title: 'Hatch Startup Nation',
    category: 'Branding',
    number: '04',
    tags: ['Brand Identity', 'Strategy'],
    year: '2025',
    image: '/portfolio/hatch-startup-nation/cover.jpg',
    projectId: 'hatch-startup-nation',
    description: 'Crafting the identity for an incubator nurturing the next wave of founders.',
  },
  {
    title: 'Prospry',
    category: 'Branding',
    number: '05',
    tags: ['Visual Identity', 'Logo Design'],
    year: '2025',
    image: '/portfolio/prospry/cover.png',
    projectId: 'prospry',
    description: 'A clean, prosperous visual system for a fintech brand built on trust.',
  },
]

/* ─── Project cell with spotlight hover ─── */
function ProjectCell({
  project,
  index,
  className,
}: {
  project: (typeof projects)[0]
  index: number
  className?: string
}) {
  const cellRef = useRef<HTMLDivElement>(null)
  const { navigateTo } = usePageTransition()

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = cellRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`)
  }, [])

  return (
    <motion.div
      ref={cellRef}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseMove={handleMouseMove}
      onClick={() => navigateTo(`/work/${project.projectId}`)}
      className={cn(
        'group relative flex flex-col justify-between p-8 md:p-10 aspect-square bg-background cursor-pointer transition-colors duration-500 overflow-hidden',
        className,
      )}
    >
      {/* Spotlight image reveal */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `url(${project.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          WebkitMaskImage:
            'radial-gradient(circle 150px at var(--spot-x, 50%) var(--spot-y, 50%), black 0%, transparent 100%)',
          maskImage:
            'radial-gradient(circle 150px at var(--spot-x, 50%) var(--spot-y, 50%), black 0%, transparent 100%)',
        }}
      />

      {/* Spotlight gold glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle 120px at var(--spot-x, 50%) var(--spot-y, 50%), oklch(0.72 0.12 75 / 0.05) 0%, transparent 100%)',
        }}
      />

      {/* Top row */}
      <div className="relative z-10 flex justify-between items-start">
        <span className="text-muted-foreground/60 font-mono text-xs uppercase tracking-widest">
          {project.number}
        </span>
        <span className="text-primary text-xs uppercase tracking-[0.2em]">{project.category}</span>
      </div>

      {/* Bottom content */}
      <div className="relative z-10">
        <span className="text-muted-foreground/30 font-mono text-[10px] tracking-wider block mb-3">
          {project.year}
        </span>
        <h3 className="text-2xl font-display uppercase tracking-tighter group-hover:text-primary transition-colors duration-500 mb-3">
          {project.title}
        </h3>
        <p className="text-body text-muted-foreground/40 text-xs leading-relaxed mb-5 line-clamp-2">
          {project.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] text-muted-foreground/25 uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all duration-500">
            <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Page ─── */
export default function WorkPageContent() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-mono">06</span>
            <div className="w-12 h-px bg-white/20" />
            <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase">
              Portfolio
            </span>
          </div>

          <TextReveal
            className="text-4xl md:text-5xl lg:text-6xl font-display uppercase tracking-tighter"
            highlight={['Work']}
          >
            Selected Work
          </TextReveal>

          <motion.p
            className="text-body text-muted-foreground/50 text-base md:text-lg max-w-lg mt-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Brand transformations, creative projects, and the stories behind them.
          </motion.p>
        </div>
      </section>

      <SectionBoundary />

      {/* Project grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="relative">
            <DecorIcon className="size-4" position="top-left" />
            <DecorIcon className="size-4" position="top-right" />
            <DecorIcon className="size-4" position="bottom-left" />
            <DecorIcon className="size-4" position="bottom-right" />

            <FullWidthDivider className="-top-px" />

            <div className="grid grid-cols-1 md:grid-cols-3 border">
              {projects.map((project, i) => (
                <ProjectCell
                  key={project.projectId}
                  project={project}
                  index={i}
                  className={cn(
                    // Row 1 (0-2): bottom border on all screens
                    i < 3 && 'border-b',
                    // Row 2 (3-4): bottom border mobile only
                    i >= 3 && i < 5 && 'border-b md:border-b-0',
                    // Right borders for non-last-in-row (desktop)
                    i % 3 !== 2 && 'md:border-r',
                    // Alternate background on diagonal
                    (i === 1 || i === 3) && 'bg-secondary dark:bg-secondary/30',
                  )}
                />
              ))}

              {/* CTA cell */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col items-center justify-center p-8 md:p-10 aspect-square bg-background"
              >
                <span className="text-muted-foreground/30 font-mono text-[10px] uppercase tracking-[0.2em] mb-4">
                  Got a vision?
                </span>
                <h3 className="text-heading text-xl md:text-2xl text-foreground text-center mb-6">
                  Let&apos;s talk.
                </h3>
                <ShineButton href="/get-started" size="sm">
                  Start a Project
                </ShineButton>
              </motion.div>
            </div>

            <FullWidthDivider className="-bottom-px" />
          </div>
        </div>
      </section>

      <SectionBoundary />

      {/* Bottom CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
          >
            <div>
              <p className="text-mono text-muted-foreground/30 text-[10px] uppercase tracking-[0.2em] mb-3">
                Like what you see?
              </p>
              <p className="text-heading text-2xl md:text-4xl text-foreground max-w-md">
                Let&apos;s build something worth remembering.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <ShineButton href="/get-started" size="md">
                Start a Project
              </ShineButton>
              <ShineButton href="/services" size="md" variant="ghost">
                View Services
              </ShineButton>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
