'use client'

import { motion } from 'motion/react'
import { SectionBoundary } from '@/components/blueprint-layout'
import { ShineButton } from '@/components/ui/ShineButton'

const projectNames: Record<string, string> = {
  'amg-records': 'AMG Records',
  ogaticket: 'OgaTicket',
  'hatch-startup-nation': 'Hatch Startup Nation',
  prospry: 'Prospry',
}

export default function UnderConstructionPage({ projectId }: { projectId: string }) {
  const name = projectNames[projectId] ?? projectId

  return (
    <>
      <section className="relative min-h-[70vh] flex flex-col justify-center pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-6xl mx-auto w-full px-6 md:px-12">
          <motion.span
            className="text-mono text-[10px] tracking-[0.3em] text-primary/60 block mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            Case Study
          </motion.span>

          <motion.h1
            className="text-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {name}
          </motion.h1>

          <motion.div
            className="mt-8 max-w-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="border border-dashed border-border/40 p-6 md:p-8">
              <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary/50 block mb-3">
                Under Construction
              </span>
              <p className="text-body text-muted-foreground/60 text-sm md:text-base leading-relaxed mb-6">
                We&apos;re putting the finishing touches on this case study. Check back soon to see
                the full story behind this project.
              </p>
              <div className="flex flex-wrap gap-3">
                <ShineButton href="/work" size="sm">
                  Back to Work
                </ShineButton>
                <ShineButton href="/get-started" size="sm" variant="ghost">
                  Start a Project
                </ShineButton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <SectionBoundary />
    </>
  )
}
