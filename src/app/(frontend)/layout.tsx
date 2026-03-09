import React from 'react'
import './styles.css'
import { Syncopate, Inter } from 'next/font/google'
import QueryProvider from '@/components/QueryProvider'
import Preloader from '@/components/Preloader'
import CustomCursor from '@/components/CustomCursor'
import SmoothScrolling from '@/components/SmoothScrolling'
import Noise from '@/components/Noise'

const syncopate = Syncopate({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-syncopate',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'The Coast | Brand Design Studio',
  description:
    'Strategic brand design for entrepreneurs, artists, and growing businesses. Logo design, visual identity, brand strategy, and marketing assets.',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html lang="en" className={`dark ${syncopate.className} ${inter.variable}`}>
      <body suppressHydrationWarning>
        <Preloader />
        <CustomCursor />
        <Noise />
        <QueryProvider>
          <SmoothScrolling>
            {children}
          </SmoothScrolling>
        </QueryProvider>
      </body>
    </html>
  )
}
