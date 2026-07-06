'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { GA_MEASUREMENT_ID } from '@/lib/analytics'

/**
 * Fires a GA4 page_view on every App Router client navigation.
 *
 * Why this exists: the site navigates via next/link + PageTransition + Lenis
 * (pushState, not full document loads), so GA would otherwise only ever record
 * the first load and interior routes (about, services, work, blog ...) would be
 * invisible. The initial page_view is sent by gtag('config') in the layout
 * bootstrap; this component skips its first run and then sends a page_view on
 * each subsequent route change (so the landing view is never double-counted).
 *
 * With Consent Mode v2, GA sends cookieless modeling pings for these events
 * while consent is denied, and full hits once the visitor accepts.
 *
 * Must be wrapped in <Suspense> by the caller (useSearchParams requirement).
 */
export function RouteAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirstRun = useRef(true)

  useEffect(() => {
    // gtag('config') already sent the landing page_view; skip the initial mount
    // so it is not counted twice.
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    if (typeof window === 'undefined') return
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
    if (typeof gtag !== 'function') return

    const qs = searchParams?.toString()
    const path = qs ? `${pathname}?${qs}` : pathname

    gtag('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
      send_to: GA_MEASUREMENT_ID,
    })

    // Meta Pixel SPA pageview (initial PageView fires in the pixel bootstrap)
    const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq
    if (typeof fbq === 'function') fbq('track', 'PageView')
  }, [pathname, searchParams])

  return null
}
