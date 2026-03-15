import React from 'react'
import './styles.css'
import { Syncopate, Inter, Space_Grotesk, Anton } from 'next/font/google'
import QueryProvider from '@/components/QueryProvider'
import Preloader from '@/components/Preloader'
import CustomCursor from '@/components/CustomCursor'
import Noise from '@/components/Noise'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import localFont from 'next/font/local'


const coast = localFont({
  src: '../../../public/fonts/Dirtyline36Daysoftype2022-Reg.ttf',
  variable: '--font-coast',
  display: 'swap',
})

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

export const metadata = {
  title: 'The Coast | Brand Design Studio',
  description:
    'Strategic brand design for entrepreneurs, artists, and growing businesses. Logo design, visual identity, brand strategy, and marketing assets.',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html lang="en" className={`dark ${coast.variable} ${inter.variable} ${anton.variable} ${spaceGrotesk.variable} ${syncopate.variable}`}>
      <body suppressHydrationWarning>
        <Preloader />
        <Noise />
        <QueryProvider>
          <Header />
          {children}
          <Footer />
        </QueryProvider>
        <CustomCursor />
      </body>
    </html>
  )
}
