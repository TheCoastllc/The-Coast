import React, { Suspense } from 'react'
import './styles.css'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Inter, Anton, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google'
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
import { SunArc } from '@/components/chrome/SunArc'
import { BRAND } from '@/lib/content/coast'
import { OrgSchema } from '@/components/seo/OrgSchema'

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

// Display face: Hanken Grotesk - the free twin of Aeonik, the brand book's
// typeface (swap to licensed Aeonik files via next/font/local when acquired)
const grotesk = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700', '800'],
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
    default: `${BRAND} | Branding, Growth & AI Agency`,
    template: `%s | ${BRAND}`,
  },

  description:
    'The Coast Global is a Dallas-Fort Worth agency for branding, digital growth, and AI - turning small businesses into premium-tier brands. Serving Texas, Florida, Alabama.',

  keywords: [
    'branding agency',
    'branding agency dallas',
    'brand design studio',
    'logo design',
    'visual identity',
    'brand strategy',
    'digital marketing agency',
    'lead generation',
    'ai consulting',
    'small business branding',
    'entrepreneur branding',
    'The Coast Global',
  ],

  authors: [{ name: BRAND, url: SITE_URL }],
  creator: BRAND,
  publisher: BRAND,

  appleWebApp: {
    capable: true,
    title: BRAND,
    statusBarStyle: 'black-translucent',
  },

  verification: {
    google: 'Ys1u-yhF9J4iqt83Yyt475eed4mAOEEJw0cF68iWWkA',
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: BRAND,
    title: `${BRAND} | Brand Design Studio`,
    description:
      'Strategic brand design for entrepreneurs, artists, and growing businesses. Logo design, visual identity, brand strategy, and marketing assets.',
    images: [
      {
        url: '/preview.jpg',
        width: 1600,
        height: 900,
        alt: `${BRAND} - Brand Design Studio`,
        type: 'image/jpeg',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@TheCoastHQ',
    creator: '@TheCoastHQ',
    title: `${BRAND} | Brand Design Studio`,
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
        <OrgSchema />
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
        <SunArc />
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
