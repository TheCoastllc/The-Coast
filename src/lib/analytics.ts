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
