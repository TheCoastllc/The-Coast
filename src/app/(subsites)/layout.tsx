import React from 'react'
import '../(frontend)/styles.css'
import { Inter, Anton, Cormorant_Garamond, JetBrains_Mono } from 'next/font/google'
import Noise from '@/components/Noise'
import CustomCursor from '@/components/CustomCursor'

// Same faces as the main site so /cbi (and other subsites) match the brand:
// these define --font-inter / --font-cormorant / --font-jetbrains, which the
// Tailwind @theme maps to font-sans / font-serif / font-mono.
const anton = Anton({ subsets: ['latin'], weight: ['400'], variable: '--font-anton', display: 'swap' })
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-inter', display: 'swap' })
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-cormorant', display: 'swap' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jetbrains', display: 'swap' })

export default function SubsitesLayout(props: { children: React.ReactNode }) {
    const { children } = props
    return (
        <html
            lang="en"
            className={`dark ${inter.variable} ${anton.variable} ${cormorant.variable} ${jetbrains.variable}`}
        >
            <body>
                <Noise />
                {children}
                <CustomCursor />
            </body>
        </html>
    )
}
