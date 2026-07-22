import React, { Suspense } from 'react'
import './funnel.css'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Inter, Cormorant_Garamond, JetBrains_Mono } from 'next/font/google'
import { RouteAnalytics } from '@/components/analytics/RouteAnalytics'
import { GtmScript, GtmNoScript } from '@/components/analytics/Gtm'
import { MetaPixelScript, MetaPixelNoScript } from '@/components/analytics/MetaPixel'
import { GA_MEASUREMENT_ID } from '@/lib/analytics'
import { CookieBanner } from '@/components/CookieBanner'
import { OrgSchema } from '@/components/seo/OrgSchema'

const SITE_URL = 'https://coastglobal.org'

// The main site's ocean font trio, with the SAME css variable names as the
// (frontend) layout - so funnel.css and any imported site components
// (e.g. TrustedBy) resolve --font-inter/--font-cormorant/--font-jetbrains
// identically. next/font self-hosts; nothing on the critical path.
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F2EFE7',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

/**
 * Standalone root layout for conversion funnel pages (/ai). Deliberately free of
 * the ocean chrome (SeaBackdrop, HUD, cursor, Lenis) - a funnel page carries its
 * own design system and must stay lean. GA4 + Consent Mode v2 mirrors the
 * (frontend) layout exactly so strategy_session_click / generate_lead events
 * flow through the same measurement ID and consent state.
 */
export default function FunnelLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`funnel-root ${inter.variable} ${cormorant.variable} ${jetbrains.variable}`}
    >
      <body className="funnel">
        <OrgSchema />
        <GtmNoScript />
        <MetaPixelNoScript />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              wait_for_update: 500
            });
            try {
              if (localStorage.getItem('coast-cookie-consent') === 'granted') {
                gtag('consent', 'update', { analytics_storage: 'granted' });
              }
            } catch (e) {}
            gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
          `}
        </Script>
        <Script
          id="ga-base"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <GtmScript />
        <MetaPixelScript />
        <Suspense fallback={null}>
          <RouteAnalytics />
        </Suspense>

        {children}

        {/* site-signature texture: fixed grain + vignette (pure CSS, pointer-events none) */}
        <div className="fvignette" aria-hidden="true" />
        <div className="fgrain" aria-hidden="true" />

        <CookieBanner />
      </body>
    </html>
  )
}
