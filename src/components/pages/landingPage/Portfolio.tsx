'use client'

import { motion, useScroll, useMotionValueEvent } from 'motion/react'
import { useRef, useState, useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Project = {
  id: number
  title: string
  category: string
  year: string
  thumbnail?: string
  slides?: string[]
  gradient: string
  projectId: string
}

const projects: Project[] = [
  {
    id: 1,
    title: 'AMG Records',
    category: 'Branding',
    year: '2026',
    thumbnail: '/portfolio/amg-records/cover.jpg',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #e94560 100%)',
    projectId: 'amg-records',
  },
  {
    id: 2,
    title: 'Zapped Co',
    category: 'Branding',
    year: '2025',
    thumbnail: '/portfolio/zappedco/cover.jpg',
    gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    projectId: 'zappedco',
  },
  {
    id: 3,
    title: 'OgaTicket',
    category: 'Development',
    year: '2026',
    thumbnail: '/portfolio/ogaticket/cover.png',
    slides: [
      '/portfolio/ogaticket/cover.png',
      '/portfolio/ogaticket/slide-3.png',
      '/portfolio/ogaticket/slide-4.png',
    ],
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    projectId: 'ogaticket',
  },
]

// Pure CSS crossfade — no JS animation on every frame, no flicker during scroll
const SlideshowImage = ({ slides, alt }: { slides: string[]; alt: string }) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <>
      {slides.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: i === currentSlide ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
          }}
          loading="lazy"
        />
      ))}
      {slides.length > 1 && (
        <div className="absolute top-4 right-4 flex gap-1.5 z-10">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </>
  )
}

// Defined outside Portfolio to prevent remounting on parent state changes
const ProjectCard = ({
  project,
  mobile,
  onClick,
}: {
  project: Project
  mobile: boolean
  onClick: () => void
}) => (
  <motion.div
    key={project.id}
    initial={{ opacity: 0, y: mobile ? 30 : 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: mobile ? 0.5 : 0.6 }}
    viewport={{ once: true }}
    onClick={onClick}
    data-cursor="view"
    className={`group relative overflow-hidden cursor-pointer rounded-${mobile ? 'xl' : '2xl'} ${
      mobile
        ? 'w-full h-[300px] sm:h-[350px]'
        : 'shrink-0 w-[350px] md:w-[450px] h-[450px] md:h-[550px]'
    }`}
  >
    {project.slides ? (
      <SlideshowImage slides={project.slides} alt={project.title} />
    ) : project.thumbnail ? (
      <img
        src={project.thumbnail}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
        onError={(e) => {
          ;(e.target as HTMLImageElement).style.display = 'none'
        }}
      />
    ) : (
      <div
        className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
        style={{ background: project.gradient }}
      />
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
    <div
      className={`absolute ${mobile ? 'top-4 right-4 w-10 h-10' : 'top-6 right-6 w-12 h-12'} rounded-full bg-foreground/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ${mobile ? '' : 'transform translate-y-2 group-hover:translate-y-0'}`}
    >
      <ArrowUpRight className={`${mobile ? 'w-4 h-4' : 'w-5 h-5'} text-foreground`} />
    </div>
    <div className={`absolute bottom-0 left-0 right-0 ${mobile ? 'p-5' : 'p-6 md:p-8'}`}>
      <div className={`flex items-center gap-${mobile ? '2' : '3'} mb-${mobile ? '3' : '4'}`}>
        <span
          className={`text-mono text-foreground/80 ${mobile ? 'text-xs px-2.5 py-1' : 'px-3 py-1'} bg-foreground/10 backdrop-blur-sm rounded-full`}
        >
          {project.category}
        </span>
        <span className={`text-mono text-foreground/60 ${mobile ? 'text-xs' : ''}`}>
          {project.year}
        </span>
      </div>
      <h3
        className={`text-heading ${mobile ? 'text-xl sm:text-2xl' : 'text-2xl md:text-3xl'} text-foreground`}
      >
        {project.title}
      </h3>
    </div>
  </motion.div>
)

const Portfolio = () => {
  const router = useRouter()
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isInView, setIsInView] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setIsInView(latest > 0.1 && latest < 0.9)
  })

  useEffect(() => {
    if (isMobile) return
    const container = scrollContainerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      if (!isInView) return
      const { scrollLeft, scrollWidth, clientWidth } = container
      const maxScroll = scrollWidth - clientWidth
      const atStart = scrollLeft <= 0
      const atEnd = scrollLeft >= maxScroll - 1
      if ((e.deltaY > 0 && !atEnd) || (e.deltaY < 0 && !atStart)) {
        e.preventDefault()
        container.scrollLeft += e.deltaY
      }
    }

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container
      setScrollProgress(scrollLeft / (scrollWidth - clientWidth))
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    container.addEventListener('scroll', handleScroll)
    return () => {
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('scroll', handleScroll)
    }
  }, [isInView, isMobile])

  return (
    <section id="work" ref={sectionRef} className="py-20 md:py-32 lg:py-48 relative" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6 md:gap-8"
        >
          <div>
            <h2 className="text-heading text-3xl md:text-5xl lg:text-6xl mb-3 md:mb-4">
              Selected Work
            </h2>
            <p className="text-body text-muted-foreground max-w-md text-sm md:text-base">
              Featured projects that showcase our capabilities
            </p>
          </div>

          <div className="hidden md:flex flex-col items-end gap-3">
            <span className="text-mono text-muted-foreground flex items-center gap-2">
              Scroll horizontally
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
            <div className="w-32 h-1 bg-border rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile: Vertical stacked layout */}
      {isMobile ? (
        <div className="px-4 sm:px-6 space-y-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              mobile={true}
              onClick={() => router.push(`/work?project=${project.projectId}`)}
            />
          ))}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            onClick={() => router.push('/portfolio')}
            className="group w-full h-[200px] rounded-xl border border-border hover:border-[#C9A24B]/50 transition-colors duration-300 flex flex-col items-center justify-center cursor-pointer"
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-2 border-border group-hover:border-[#C9A24B] mx-auto mb-4 flex items-center justify-center transition-colors duration-300">
                <ArrowUpRight className="w-6 h-6 text-muted-foreground group-hover:text-[#C9A24B] transition-colors duration-300" />
              </div>
              <h3 className="text-heading text-2xl text-foreground mb-1">View All</h3>
              <span className="text-mono text-muted-foreground text-sm">24 Projects</span>
            </div>
          </motion.div>
        </div>
      ) : (
        /* Desktop: Horizontal scroll */
        <div
          ref={scrollContainerRef}
          className="flex gap-6 px-6 md:px-12 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="shrink-0 w-0 md:w-[calc((100vw-1280px)/2)]" />
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              mobile={false}
              onClick={() => router.push(`/work?project=${project.projectId}`)}
            />
          ))}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            onClick={() => router.push('/portfolio')}
            className="group shrink-0 w-[350px] md:w-[450px] h-[450px] md:h-[550px] rounded-2xl border border-border hover:border-[#C9A24B]/50 transition-colors duration-300 flex flex-col items-center justify-center cursor-pointer"
          >
            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-2 border-border group-hover:border-[#C9A24B] mx-auto mb-6 flex items-center justify-center transition-colors duration-300">
                <ArrowUpRight className="w-8 h-8 text-muted-foreground group-hover:text-[#C9A24B] transition-colors duration-300" />
              </div>
              <h3 className="text-heading text-3xl text-foreground mb-2">View All</h3>
              <span className="text-mono text-muted-foreground">24 Projects</span>
            </div>
          </motion.div>
          <div className="shrink-0 w-6 md:w-12" />
        </div>
      )}
    </section>
  )
}

export default Portfolio
