'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import TextReveal from '@/components/TextReveal'
import { usePageTransition } from '@/components/PageTransition'

const projects = [
  {
    title: 'Zapped Co',
    category: 'Branding',
    tags: ['Visual Identity', 'Strategy', '2025'],
    image: '/portfolio/zappedco/cover.jpg',
    projectId: 'zappedco',
  },
  {
    title: 'AMG Records',
    category: 'Branding',
    tags: ['Logo Design', 'Brand Identity', '2026'],
    image: '/portfolio/amg-records/cover.jpg',
    projectId: 'amg-records',
  },
  {
    title: 'OgaTicket',
    category: 'Development',
    tags: ['Web Design', 'UX/UI', '2026'],
    image: '/portfolio/ogaticket/cover.png',
    projectId: 'ogaticket',
  },
]

function StackCard({ project, index, total }: { project: typeof projects[0]; index: number; total: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { navigateTo } = usePageTransition()
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"]
  })

  const topOffset = `calc(15vh + ${index * 40}px)`
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1 - (total - index) * 0.02])
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.7])

  return (
    <div className="sticky" style={{ top: topOffset }}>
      <motion.div
        ref={cardRef}
        style={{ scale }}
        className="relative bg-black border border-white/10 p-4 md:p-8 mb-24 origin-top group hover-target shadow-2xl shadow-black cursor-pointer"
        onClick={() => navigateTo(`/work/${project.projectId}`)}
      >
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-black z-50 pointer-events-none"
        />

        <div className="flex flex-col md:flex-row gap-8 relative z-10">
          {/* Image */}
          <div className="w-full md:w-2/3 relative overflow-hidden aspect-[16/9] bg-white/[0.02]">
            <img
              src={project.image}
              alt={`${project.title} — ${project.category} project by The Coast`}
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="w-full md:w-1/3 flex flex-col justify-between py-4">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-primary text-xs tracking-[0.2em] uppercase font-mono">
                  0{index + 1}
                </span>
                <span className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                  {project.category}
                </span>
              </div>

              <h3 className="text-4xl md:text-5xl font-display uppercase tracking-tighter mb-8 group-hover:text-primary transition-colors duration-500">
                {project.title}
              </h3>

              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 border border-white/10 text-white/60 text-[10px] uppercase tracking-widest rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-12 md:mt-0">
              <span
                className="text-xs uppercase tracking-[0.2em] border-b border-white/20 text-white/60 pb-1 group-hover:text-primary group-hover:border-primary transition-colors"
              >
                View Case Study
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function Portfolio() {
  return (
    <section className="py-32 bg-black relative px-4" id="work">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-primary text-xs tracking-[0.3em] uppercase font-mono">05</span>
              <div className="w-12 h-px bg-white/20" />
              <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase">Portfolio</span>
            </div>
            <TextReveal
              className="text-4xl md:text-5xl lg:text-6xl font-display uppercase tracking-tighter mb-6"
              highlight={["Works"]}
            >
              Selected Works
            </TextReveal>
          </div>
        </motion.div>

        <div className="relative max-w-6xl mx-auto pb-32">
          {projects.map((project, index) => (
            <StackCard
              key={project.title}
              project={project}
              index={index}
              total={projects.length}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
