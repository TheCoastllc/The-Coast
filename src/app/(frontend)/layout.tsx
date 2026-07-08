import React, { Suspense } from 'react'
import './styles.css'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Inter, Anton, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { RouteAnalytics } from '@/components/analytics/RouteAnalytics'
import { GtmScript, GtmNoScript } from '@/components/analytics/Gtm'
import { MetaPixelScript, MetaPixelNoScript } from '@/components/analytics/MetaPixel'
import { GA_MEASUREMENT_ID } from '@/lib/analytics'
import QueryProvider from '@/components/QueryProvider'
import { Nav } from '@/components/chrome/Nav'
import { ScrollThread } from '@/components/chrome/ScrollThread'
import { Cursor } from '@/components/chrome/Cursor'
import { HUD } from '@/components/chrome/HUD'
import { CompassRose } from '@/components/chrome/CompassRose'
import { CardLampGlow } from '@/components/chrome/CardLampGlow'
import { SeaParallax } from '@/components/chrome/SeaParallax'
import { LenisProvider } from '@/components/motion/LenisProvider'
import { Footer } from '@/components/chrome/Footer'
import { PageTransitionProvider } from '@/components/PageTransition'
import { CookieBanner } from '@/components/CookieBanner'
import { Toaster } from 'sonner'
import { PREMIUM_KEYS } from '@/lib/premium'
import { SeaBackdrop } from '@/components/chrome/SeaBackdrop'

const SITE_URL = 'https://coastglobal.org'

const anton = Anton({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-anton',
  display: 'swap',
  // Not rendered on the homepage (ocean scope uses Cormorant for --font-display);
  // only /studio + /offers use Anton. Don't preload it on every page's critical path.
  preload: false,
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

// Display face: Space Grotesk 700 (the Higgsfield-anchored bold voice)
const grotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-grotesk',
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
  viewportFit: 'cover',
  maximumScale: 5,
  // Matches the dark ocean UI (html.dark / body.ocean) for mobile browser chrome.
  themeColor: '#0a1420',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: 'The Coast | Full-Stack Creative Ecosystem',
    template: '%s | The Coast',
  },

  description:
    'The Coast is an end-to-end brand studio: brand identity, digital marketing, and cinematic content that helps founders scale and turn visions into empires.',

  keywords: [
    'brand design studio',
    'logo design',
    'visual identity',
    'brand strategy',
    'brand identity',
    'marketing assets',
    'small business branding',
    'entrepreneur branding',
    'The Coast',
  ],

  authors: [{ name: 'The Coast', url: SITE_URL }],
  creator: 'The Coast',
  publisher: 'The Coast',

  appleWebApp: {
    capable: true,
    title: 'The Coast',
    statusBarStyle: 'black-translucent',
  },

  verification: {
    google: 'Ys1u-yhF9J4iqt83Yyt475eed4mAOEEJw0cF68iWWkA',
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'The Coast',
    title: 'The Coast | Brand Design Studio',
    description:
      'Strategic brand design for entrepreneurs, artists, and growing businesses. Logo design, visual identity, brand strategy, and marketing assets.',
    images: [
      {
        url: '/preview.jpg',
        width: 1600,
        height: 900,
        alt: 'The Coast - Brand Design Studio',
        type: 'image/jpeg',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@TheCoastHQ',
    creator: '@TheCoastHQ',
    title: 'The Coast | Brand Design Studio',
    description:
      'Strategic brand design for entrepreneurs, artists, and growing businesses.',
    images: ['/preview.jpg'],
  },

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

  alternates: {
    canonical: SITE_URL,
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html lang="en" className={`dark ${inter.variable} ${anton.variable} ${grotesk.variable} ${jetbrains.variable} relative`}>
      <body suppressHydrationWarning className="ocean" data-premium={PREMIUM_KEYS.join(' ')}>
        <GtmNoScript />
        <MetaPixelNoScript />
        {/* Google Analytics 4 with Consent Mode v2.
            gtag loads on every page (no cookies until consent), defaults all
            storage to 'denied', and restores a prior 'granted' choice. config
            sends the initial page_view; RouteAnalytics sends a page_view on each
            subsequent App Router client navigation. The CookieBanner flips
            analytics_storage via gtag('consent','update'). */}
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

        <SeaBackdrop />
        <QueryProvider>
          <PageTransitionProvider>
            <Nav />
            {children}
            <Footer />
          </PageTransitionProvider>
        </QueryProvider>
        <HUD />
        <ScrollThread />
        <CompassRose />
        <div className="vignette" />
        <div className="grain" />
        <Cursor />
        <CardLampGlow />
        <SeaParallax />
        <LenisProvider />
        <CookieBanner />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
