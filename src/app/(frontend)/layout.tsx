import React from 'react'
import './styles.css'
import { Bebas_Neue, Space_Grotesk } from 'next/font/google'
import QueryProvider from '@/components/QueryProvider'
import Preloader from '@/components/Preloader'
import CustomCursor from '@/components/CustomCursor'
import SmoothScrolling from '@/components/SmoothScrolling'

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space',
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
    <html lang="en" className={`dark ${bebasNeue.variable} ${spaceGrotesk.variable}`}>
      <body suppressHydrationWarning>
        <Preloader />
        <CustomCursor />
        <QueryProvider>
          <SmoothScrolling>
            {children}
          </SmoothScrolling>
        </QueryProvider>
      </body>
    </html>
  )
}
