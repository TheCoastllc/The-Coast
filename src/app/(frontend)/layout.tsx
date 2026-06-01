import React from 'react'
import './styles.css'
import type { Metadata } from 'next'
import { Inter, Anton, Cormorant_Garamond, JetBrains_Mono } from 'next/font/google'
import QueryProvider from '@/components/QueryProvider'
import Preloader from '@/components/Preloader'
import CustomCursor from '@/components/CustomCursor'
import Noise from '@/components/Noise'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { PageTransitionProvider } from '@/components/PageTransition'
import { CookieBanner } from '@/components/CookieBanner'
import { Toaster } from 'sonner'
import { PREMIUM_KEYS } from '@/lib/premium'

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
      <head>
        {/* Premium pairing: PP Editorial New (display serif) + PP Neue Montreal (body grotesk).
            Loaded via Fontshare CDN (Pangram Pangram, free for commercial use).
            CSP whitelisted in next.config.mjs. Inter + Anton stay as fallbacks. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin=""
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="preconnect"
          href="https://cdn.fontshare.com"
          crossOrigin=""
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=neue-montreal@400,500,600,700&f[]=editorial-new@200,400,500,700&display=swap"
        />
      </head>
      <body suppressHydrationWarning className="ocean" data-premium={PREMIUM_KEYS.join(' ')}>
        <Preloader />
        <Noise />
        <QueryProvider>
          <PageTransitionProvider>
            <Header />
            {children}
            <Footer />
          </PageTransitionProvider>
        </QueryProvider>
        <CustomCursor />
        <CookieBanner />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
