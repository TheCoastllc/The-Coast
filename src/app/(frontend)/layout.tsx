import React from 'react'
import './styles.css'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import NoiseLayer from '@/components/NoiseLayer'
import BlurLayer from '@/components/BlurLayer'


const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100','200','300','400', '500', '600', '700', '800', '900'],
  variable: '--font-geist',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100','200','300','400', '500', '600', '700', '800', '900'],
  variable: '--font-geist-mono',
})


export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning >
      <body className={`${geistMono.variable} ${geist.className} text-sm`}>
        <main>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            // disableTransitionOnChange
          >
            <NoiseLayer />
            <BlurLayer />
          {children}
          </ThemeProvider>
        </main>
      </body>
    </html>
  )
}
