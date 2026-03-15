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
  '/portfolio': 'Portfolio',
  '/pricing': 'Pricing',
  '/get-started': 'Get Started',
  '/vision': 'Vision',
  '/brand-builder': 'Brand Builder',
  '/brand-avatar': 'Brand Avatar',
  '/intake': 'Intake',
}

function getRouteName(path: string): string {
  if (ROUTE_NAMES[path]) return ROUTE_NAMES[path]
  // Handle dynamic routes like /blog/[slug]
  if (path.startsWith('/blog/')) return 'Blog'
  if (path.startsWith('/portal')) return 'Portal'
  // Fallback: capitalize the last segment
  const segment = path.split('/').filter(Boolean).pop() || 'Page'
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
const BAR_COUNT = 10

// ─── Provider + Overlay ────────────────────────────────────────────
export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [targetRoute, setTargetRoute] = useState<string | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const barsRef = useRef<(HTMLDivElement | null)[]>([])
  const labelRef = useRef<HTMLDivElement>(null)
  const noiseRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const pendingHref = useRef<string | null>(null)

  const navigateTo = useCallback(
    (href: string) => {
      // Skip if same page or already transitioning
      if (href === pathname || isTransitioning) return
      // Skip hash-only links
      if (href.startsWith('#') || (href.startsWith('/#') && pathname === '/')) return

      setIsTransitioning(true)
      setTargetRoute(href)
      pendingHref.current = href
    },
    [pathname, isTransitioning],
  )

  // Run animation when transition starts
  useEffect(() => {
    if (!isTransitioning || !targetRoute) return

    const bars = barsRef.current.filter(Boolean) as HTMLDivElement[]
    const label = labelRef.current
    const overlay = overlayRef.current
    const noise = noiseRef.current
    if (!bars.length || !label || !overlay || !noise) return

    // Make overlay visible
    overlay.style.visibility = 'visible'

    // Randomize bar order for staggered entrance
    const shuffledIndices = Array.from({ length: bars.length }, (_, i) => i).sort(
      () => Math.random() - 0.5,
    )
    const shuffledBars = shuffledIndices.map((i) => bars[i])

    const tl = gsap.timeline()
    tlRef.current = tl

    // Reset
    gsap.set(bars, { scaleY: 0, transformOrigin: 'bottom center' })
    gsap.set(label, { opacity: 0, y: 20 })
    gsap.set(noise, { opacity: 0 })

    // 1. Bars animate up (random stagger) to form solid block
    tl.to(shuffledBars, {
      scaleY: 1,
      duration: 0.5,
      ease: 'power3.inOut',
      stagger: { each: 0.04 },
    })

    // 2. Noise fades in on top
    tl.to(noise, { opacity: 0.15, duration: 0.25, ease: 'power2.out' }, '-=0.15')

    // 3. Route name animates in
    tl.to(label, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power3.out',
    }, '-=0.1')

    // 4. Hold
    tl.to({}, { duration: 0.35 })

    // 5. Navigate — then exit animation plays after pathname change
    tl.call(() => {
      if (pendingHref.current) {
        router.push(pendingHref.current)
      }
    })

    return () => {
      tl.kill()
    }
  }, [isTransitioning, targetRoute, router])

  // Detect pathname change → play exit animation
  useEffect(() => {
    if (!isTransitioning || !pendingHref.current) return
    // Only exit when we've actually navigated
    if (pathname !== pendingHref.current) return

    const bars = barsRef.current.filter(Boolean) as HTMLDivElement[]
    const label = labelRef.current
    const overlay = overlayRef.current
    const noise = noiseRef.current
    if (!bars.length || !label || !overlay || !noise) return

    // Kill any running entrance timeline
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

    // Randomize exit order
    const shuffledIndices = Array.from({ length: bars.length }, (_, i) => i).sort(
      () => Math.random() - 0.5,
    )
    const shuffledBars = shuffledIndices.map((i) => bars[i])

    // 1. Label fades out
    exitTl.to(label, { opacity: 0, y: -15, duration: 0.25, ease: 'power2.in' })

    // 2. Bars slide up and out (random stagger)
    exitTl.to(shuffledBars, {
      scaleY: 0,
      transformOrigin: 'top center',
      duration: 0.45,
      ease: 'power3.inOut',
      stagger: { each: 0.04 },
    }, '-=0.1')

    // 3. Noise fades out
    exitTl.to(noise, { opacity: 0, duration: 0.2 }, '-=0.3')

    return () => {
      exitTl.kill()
    }
  }, [pathname, isTransitioning])

  const routeName = targetRoute ? getRouteName(targetRoute) : ''

  return (
    <TransitionContext.Provider value={{ navigateTo, isTransitioning }}>
      {children}

      {/* Transition overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9000] pointer-events-none"
        style={{ visibility: 'hidden' }}
        aria-hidden="true"
      >
        {/* Bars container */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: BAR_COUNT }).map((_, i) => (
            <div
              key={i}
              ref={(el) => { barsRef.current[i] = el }}
              className="h-full flex-1"
              style={{
                backgroundColor: 'oklch(0.07 0 0)',
                transform: 'scaleY(0)',
                transformOrigin: 'bottom center',
              }}
            />
          ))}
        </div>

        {/* Noise texture overlay (same as the global Noise component) */}
        <div
          ref={noiseRef}
          className="absolute inset-0 mix-blend-screen"
          style={{ opacity: 0 }}
        >
          <svg className="absolute inset-0 h-full w-full">
            <filter id="transitionNoiseFilter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#transitionNoiseFilter)" />
          </svg>
        </div>

        {/* Route name label */}
        <div
          ref={labelRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0 }}
        >
          <span className="font-sans text-2xl md:text-4xl font-semibold uppercase text-foreground">
            {routeName}
          </span>
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
  const hrefString = typeof href === 'string' ? href : href.pathname || '/'

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let hash links and external links work normally
    if (hrefString.startsWith('http') || hrefString.startsWith('mailto:')) return
    if (hrefString.startsWith('#')) return
    // For /#contact type links on the home page, let it scroll
    if (hrefString.startsWith('/#')) return

    e.preventDefault()
    navigateTo(hrefString)
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}
