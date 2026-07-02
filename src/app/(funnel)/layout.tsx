import React, { Suspense } from 'react'
import './funnel.css'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Poppins, Lora, JetBrains_Mono } from 'next/font/google'
import { RouteAnalytics } from '@/components/analytics/RouteAnalytics'
import { GA_MEASUREMENT_ID } from '@/lib/analytics'
import { CookieBanner } from '@/components/CookieBanner'

const SITE_URL = 'https://coastglobal.org'

// Funnel design tokens call for Poppins/Lora/JetBrains (per the landing brief).
// next/font self-hosts them - no Google Fonts request on the critical path.
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  weight: ['500'],
  style: ['italic'],
  variable: '--font-lora',
  display: 'swap',
})

const jetbrainsFunnel = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-jetbrains-f',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#243A44',
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
      className={`funnel-root ${poppins.variable} ${lora.variable} ${jetbrainsFunnel.variable}`}
    >
      <body className="funnel">
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
        <Suspense fallback={null}>
          <RouteAnalytics />
        </Suspense>

        {children}

        <CookieBanner />
      </body>
    </html>
  )
}
