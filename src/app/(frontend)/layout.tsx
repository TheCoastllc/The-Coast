import React from 'react'
import './styles.css'
import type { Metadata } from 'next'
import { Syncopate, Inter, Space_Grotesk, Anton } from 'next/font/google'
import QueryProvider from '@/components/QueryProvider'
import Preloader from '@/components/Preloader'
import CustomCursor from '@/components/CustomCursor'
import Noise from '@/components/Noise'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { PageTransitionProvider } from '@/components/PageTransition'

const SITE_URL = 'https://coastglobal.org'

const syncopate = Syncopate({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-syncopate',
  display: 'swap',
})

const anton = Anton({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-anton',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: 'The Coast | Brand Design Studio',
    template: '%s | The Coast',
  },

  description:
    'Strategic brand design for entrepreneurs, artists, and growing businesses. Logo design, visual identity, brand strategy, and marketing assets.',

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
    <html lang="en" className={`dark ${inter.variable} ${anton.variable} ${spaceGrotesk.variable} ${syncopate.variable}`}>
      <body suppressHydrationWarning>
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
      </body>
    </html>
  )
}
