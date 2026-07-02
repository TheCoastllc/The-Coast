'use client'

/**
 * Funnel CTA mechanics for /ai (per CLAUDE-CODE-BRIEF):
 * - every CTA opens Calendly in a new tab
 * - utm_* params on the page URL are forwarded onto the Calendly link so booked
 *   calls attribute back to the ad that drove them (Calendly utm passthrough)
 * - every click pushes a GTM-ready dataLayer event and, since the site already
 *   loads GA4 (gtag), fires the matching generate_lead standard event. No pixel
 *   IDs are hardcoded here - events ride whatever the layout loads.
 */

export const CALENDLY_URL = 'https://calendly.com/davidcoast-coastglobal/30min'

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const

export type CtaLocation =
  | 'nav'
  | 'hero'
  | 'pricing_blueprint'
  | 'pricing_advisory'
  | 'pricing_build'
  | 'pricing_custom'
  | 'final'

/** Calendly link with the current page's utm_* params forwarded. */
export function calendlyUrl(): string {
  if (typeof window === 'undefined') return CALENDLY_URL
  try {
    const here = new URLSearchParams(window.location.search)
    const out = new URL(CALENDLY_URL)
    for (const key of UTM_KEYS) {
      const value = here.get(key)
      if (value) out.searchParams.set(key, value)
    }
    return out.toString()
  } catch {
    return CALENDLY_URL
  }
}

/** Single conversion-event helper used by every CTA on the page. */
export function trackCTA(location: CtaLocation): void {
  if (typeof window === 'undefined') return
  const w = window as typeof window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event: 'strategy_session_click', cta_location: location })
  if (typeof w.gtag === 'function') {
    w.gtag('event', 'generate_lead', { cta_location: location })
  }
}
