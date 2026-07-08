import React from 'react'
import Script from 'next/script'
import '../(frontend)/styles.css'
import { GtmScript, GtmNoScript } from '@/components/analytics/Gtm'
import { MetaPixelScript, MetaPixelNoScript } from '@/components/analytics/MetaPixel'
import { Inter, Anton, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { SeaBackdrop } from '@/components/chrome/SeaBackdrop'
import { HUD } from '@/components/chrome/HUD'
import { CompassRose } from '@/components/chrome/CompassRose'
import { Cursor } from '@/components/chrome/Cursor'

// Same faces as the main site so /cbi (and other subsites) match the brand:
// these define --font-inter / --font-grotesk / --font-jetbrains, which the
// Tailwind @theme maps to font-sans / font-serif / font-mono.
const anton = Anton({ subsets: ['latin'], weight: ['400'], variable: '--font-anton', display: 'swap' })
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-inter', display: 'swap' })
const grotesk = Space_Grotesk({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-grotesk', display: 'swap' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jetbrains', display: 'swap' })

export default function SubsitesLayout(props: { children: React.ReactNode }) {
    const { children } = props
    return (
        <html
            lang="en"
            className={`dark ${inter.variable} ${anton.variable} ${grotesk.variable} ${jetbrains.variable}`}
        >
            <body className="ocean">
                <GtmNoScript />
                <MetaPixelNoScript />
                {/* Consent Mode v2 defaults (all denied) so GTM tags stay gated
                    on subsites exactly like the main site. */}
                <Script id="consent-init" strategy="afterInteractive">
                    {`
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
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
                    `}
                </Script>
                <GtmScript />
                <MetaPixelScript />
                <SeaBackdrop />
                {children}
                <HUD />
                <CompassRose />
                <div className="vignette" />
                <div className="grain" />
                <Cursor />
            </body>
        </html>
    )
}
