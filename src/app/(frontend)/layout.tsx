import React from 'react'
import './styles.css'
import type { Metadata, Viewport } from 'next'
import { Inter, Anton, Cormorant_Garamond, JetBrains_Mono } from 'next/font/google'
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
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

// Ocean redesign display + mono faces (ported from coast-site)
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
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
  viewportFit: 'cover',
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: 'The Coast | Full-Stack Creative Ecosystem',
    template: '%s | The Coast',
  },

  description:
    'At The Coast®, we’ve built an end-to-end ecosystem for the visionaries behind the brands. Whether we’re crafting your brand guidelines, managing your digital marketing, or producing cinematic digital experiences, we’re here to help you scale. We turn visions into empires.',

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
        alt: 'The Coast — Brand Design Studio',
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
    <html lang="en" className={`dark ${inter.variable} ${anton.variable} ${cormorant.variable} ${jetbrains.variable} relative`}>
      <body suppressHydrationWarning className="ocean" data-premium={PREMIUM_KEYS.join(' ')}>
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
