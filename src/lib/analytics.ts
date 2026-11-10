/**
 * Google Analytics 4 configuration.
 *
 * Single source of truth for the GA4 Measurement ID, shared by the gtag
 * bootstrap (src/app/(frontend)/layout.tsx), the consent banner
 * (src/components/CookieBanner.tsx), and the SPA route tracker
 * (src/components/analytics/RouteAnalytics.tsx).
 *
 * The Measurement ID is a public, client-side value (it ships in the HTML),
 * so it is fine to hardcode here. GTM was removed in favour of a single
 * direct GA4 tag to avoid double-counting pageviews.
 */
export const GA_MEASUREMENT_ID = 'G-ZWSD7VN3DD'

type EventParams = Record<string, string | number | boolean | undefined>

/**
 * One call for conversion events from the main site. Pushes to the GTM
 * dataLayer, fires the GA4 event via gtag, and mirrors `generate_lead` to the
 * Meta Pixel (which holds its queue until the CookieBanner grants consent).
 * Window-guarded, so it is safe to import from shared code.
 */
export function trackEvent(name: string, params: EventParams = {}) {
  if (typeof window === 'undefined') return
  const w = window as Window & {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
  try {
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({ event: name, ...params })
    w.gtag?.('event', name, params)
    if (name === 'generate_lead') w.fbq?.('track', 'Lead', params)
  } catch {}
}
