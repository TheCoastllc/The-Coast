'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import Link from 'next/link'

// ─── Route name mapping ────────────────────────────────────────────
const ROUTE_NAMES: Record<string, string> = {
  '/': 'Home',
  '/services': 'Services',
  '/work': 'Work',
  '/blog': 'Blog',
  '/about': 'About',
  '/pricing': 'Pricing',
  '/get-started': 'Get Started',
  '/vision': 'Vision',
  '/brand-builder': 'Brand Builder',
  '/brand-avatar': 'Brand Avatar',
  '/offers': 'Offers',
  '/intake': 'Intake',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Service',
}

function getRouteName(path: string): string {
  // Strip query/hash so "/blog?page=2" still matches.
  const cleanPath = path.split('?')[0].split('#')[0]
  if (ROUTE_NAMES[cleanPath]) return ROUTE_NAMES[cleanPath]
  if (cleanPath.startsWith('/blog/category/')) return 'Blog'
  if (cleanPath.startsWith('/blog/')) {
    const slug = cleanPath.slice('/blog/'.length).replace(/\/$/, '')
    if (!slug) return 'Blog'
    return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }
  if (cleanPath.startsWith('/portal')) return 'Portal'
  const segment = cleanPath.split('/').filter(Boolean).pop() || 'Page'
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
}

// ─── Context ───────────────────────────────────────────────────────
type TransitionContextValue = {
  navigateTo: (href: string) => void
  isTransitioning: boolean
}

const TransitionContext = createContext<TransitionContextValue>({
  navigateTo: () => { },
  isTransitioning: false,
})

export const usePageTransition = () => useContext(TransitionContext)

// ─── Config ────────────────────────────────────────────────────────
const BAR_COUNT = 5

// ─── Provider + Overlay ────────────────────────────────────────────
export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [targetRoute, setTargetRoute] = useState<string | null>(null)

  const overlayRef = useRef<HTMLDivElement>(null)
  const barsRef = useRef<(HTMLDivElement | null)[]>([])
  const labelContainerRef = useRef<HTMLDivElement>(null)
  const subLabelRef = useRef<HTMLParagraphElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const noiseRef = useRef<HTMLDivElement>(null)

  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const pendingHref = useRef<string | null>(null)

  const navigateTo = useCallback(
    (href: string) => {
      if (href === pathname || isTransitioning) return
      if (href.startsWith('#') || (href.startsWith('/#') && pathname === '/')) return

      setIsTransitioning(true)
      setTargetRoute(href)
      pendingHref.current = href
    },
    [pathname, isTransitioning],
  )

  // ─── ENTRANCE ANIMATION ──────────────────────────────────────────
  useEffect(() => {
    if (!isTransitioning || !targetRoute) return

    const bars = barsRef.current.filter(Boolean) as HTMLDivElement[]
    const labelContainer = labelContainerRef.current
    const subLabel = subLabelRef.current
    const label = labelRef.current
    const overlay = overlayRef.current
    const noise = noiseRef.current

    if (!bars.length || !label || !overlay || !noise || !labelContainer || !subLabel) return

    overlay.style.visibility = 'visible'

    const tl = gsap.timeline()
    tlRef.current = tl

    // Reset properties
    gsap.set(bars, { scaleY: 0, transformOrigin: 'bottom center' })
    gsap.set(labelContainer, { opacity: 0 })
    gsap.set(subLabel, { opacity: 0, y: 10 })
    gsap.set(label, { yPercent: 120 })
    gsap.set(noise, { opacity: 0 })

    // 1. Bars sweep up from left to right
    tl.to(bars, {
      scaleY: 1,
      duration: 0.8,
      ease: 'expo.inOut',
      stagger: 0.08,
    })

    // 2. Noise fades in slightly
    tl.to(noise, { opacity: 0.12, duration: 0.4, ease: 'power2.out' }, '-=0.4')

    // 3. Label container fades in
    tl.to(labelContainer, { opacity: 1, duration: 0.1 }, '-=0.5')

    // 4. Sub-label fades & slides up
    tl.to(subLabel, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5')

    // 5. Main Route text elegantly unmasks from the bottom
    tl.to(label, {
      yPercent: 0,
      duration: 0.8,
      ease: 'expo.out',
    }, '-=0.6')

    // 6. Hold & Read duration
    tl.to({}, { duration: 0.4 })

    // 7. Fire router push
    tl.call(() => {
      if (pendingHref.current) {
        router.push(pendingHref.current)
      }
    })

    return () => { tl.kill() }
  }, [isTransitioning, targetRoute, router])

  // ─── EXIT ANIMATION ──────────────────────────────────────────────
  useEffect(() => {
    if (!isTransitioning || !pendingHref.current || pathname !== pendingHref.current) return

    const bars = barsRef.current.filter(Boolean) as HTMLDivElement[]
    const label = labelRef.current
    const subLabel = subLabelRef.current
    const overlay = overlayRef.current
    const noise = noiseRef.current

    if (!bars.length || !label || !overlay || !noise || !subLabel) return

    if (tlRef.current) {
      tlRef.current.kill()
      tlRef.current = null
    }

    const exitTl = gsap.timeline({
      onComplete: () => {
        overlay.style.visibility = 'hidden'
        setIsTransitioning(false)
        setTargetRoute(null)
        pendingHref.current = null
      },
    })

    // 1. Sub-label fades out
    exitTl.to(subLabel, { opacity: 0, y: -10, duration: 0.4, ease: 'power2.inOut' })

    // 2. Main text masks away by sliding up
    exitTl.to(label, {
      yPercent: -120,
      duration: 0.6,
      ease: 'expo.inOut'
    }, '<')

    // 3. Bars slide up and out, staggered left to right
    exitTl.to(bars, {
      scaleY: 0,
      transformOrigin: 'top center',
      duration: 0.8,
      ease: 'expo.inOut',
      stagger: 0.08,
    }, '-=0.4')

    // 4. Noise fades out
    exitTl.to(noise, { opacity: 0, duration: 0.3 }, '-=0.6')

    return () => { exitTl.kill() }
  }, [pathname, isTransitioning])

  const routeName = targetRoute ? getRouteName(targetRoute) : ''

  return (
    <TransitionContext.Provider value={{ navigateTo, isTransitioning }}>
      {children}

      {/* Transition overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-9999 pointer-events-none flex"
        style={{ visibility: 'hidden' }}
        aria-hidden="true"
      >
        {/* Overlapping Shutter Bars (Fixes Sub-pixel gaps) */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: BAR_COUNT }).map((_, i) => (
            <div
              key={i}
              ref={(el) => { barsRef.current[i] = el }}
              // Add a left border to all panels EXCEPT the first one
              className={`absolute top-0 bottom-0 `}
              style={{
                left: `${i * (100 / BAR_COUNT)}%`,
                // Adding + 2px physically forces the panels to overlap and kills the gap
                width: `calc(${100 / BAR_COUNT}% + 2px)`,
                backgroundColor: '#0a0a0a',
                transform: 'scaleY(0)',
                transformOrigin: 'bottom center',
                willChange: 'transform',
              }}
            />
          ))}
        </div>

        {/* Noise texture overlay */}
        <div
          ref={noiseRef}
          className="absolute inset-0 mix-blend-screen pointer-events-none"
          style={{ opacity: 0 }}
        >
          <svg className="absolute inset-0 h-full w-full">
            <filter id="transitionNoiseFilter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.75"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#transitionNoiseFilter)" />
          </svg>
        </div>

        {/* Cinematic Route Label */}
        <div
          ref={labelContainerRef}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6 md:px-12"
          style={{ opacity: 0 }}
        >
          {/* Sub-label for editorial feel */}
          <p
            ref={subLabelRef}
            className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-white/50 mb-3 sm:mb-4 text-center"
          >
            Destination
          </p>

          {/* Mask container for main text */}
          <div className="overflow-hidden pb-2 max-w-5xl w-full">
            <span
              ref={labelRef}
              className={`block font-sans font-medium tracking-tight text-white text-center leading-[1.05] text-balance ${
                routeName.length > 40
                  ? 'text-2xl sm:text-3xl md:text-5xl'
                  : routeName.length > 20
                  ? 'text-3xl sm:text-5xl md:text-6xl'
                  : 'text-4xl sm:text-6xl md:text-7xl'
              }`}
              style={{ willChange: 'transform' }}
            >
              {routeName}
            </span>
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  )
}

// ─── TransitionLink ────────────────────────────────────────────────
type TransitionLinkProps = Omit<React.ComponentProps<typeof Link>, 'onClick'> & {
  children?: React.ReactNode
}

export function TransitionLink({ href, children, ...props }: TransitionLinkProps) {
  const { navigateTo } = usePageTransition()
  const pathname = usePathname()
  const hrefString = typeof href === 'string' ? href : href.pathname || '/'

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (hrefString.startsWith('http') || hrefString.startsWith('mailto:')) return
    if (hrefString.startsWith('#')) return
    if (hrefString.startsWith('/#')) return

    // Same-pathname navigations (query/hash changes only) — skip transition,
    // let Next's Link handle it. The overlay finishes by matching pathname,
    // which never changes when only the query updates.
    const targetPath = hrefString.split('?')[0].split('#')[0]
    if (targetPath === pathname) return

    e.preventDefault()
    navigateTo(hrefString)
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}