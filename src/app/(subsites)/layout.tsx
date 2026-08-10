import React from 'react'
import Script from 'next/script'
import '../(frontend)/styles.css'
import { GtmScript, GtmNoScript } from '@/components/analytics/Gtm'
import { MetaPixelScript, MetaPixelNoScript } from '@/components/analytics/MetaPixel'
import { Inter, Anton, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google'
import { SeaBackdrop } from '@/components/chrome/SeaBackdrop'
import { Cursor } from '@/components/chrome/Cursor'
import { OrgSchema } from '@/components/seo/OrgSchema'

// Same faces as the main site so /cbi (and other subsites) match the brand:
// these define --font-inter / --font-grotesk / --font-jetbrains, which the
// Tailwind @theme maps to font-sans / font-serif / font-mono.
const anton = Anton({ subsets: ['latin'], weight: ['400'], variable: '--font-anton', display: 'swap' })
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-inter', display: 'swap' })
const grotesk = Hanken_Grotesk({ subsets: ['latin'], weight: ['500', '700', '800'], variable: '--font-grotesk', display: 'swap' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jetbrains', display: 'swap' })

export default function SubsitesLayout(props: { children: React.ReactNode }) {
    const { children } = props
    return (
        <html
            lang="en"
            className={`dark ${inter.variable} ${anton.variable} ${grotesk.variable} ${jetbrains.variable}`}
        >
            <body className="ocean">
                <OrgSchema />
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
                {/* No <HUD /> or <CompassRose /> here. They are main-site ocean
                    chrome that renders position:fixed, so on the subsites they
                    sat ON TOP of the subsite footers ("DALLAS-FORT WORTH, TX" /
                    "COASTGLOBAL.ORG / 2026" and the compass overlapping the
                    copyright and legal links on cbi. and offers.). Gallery had
                    already had to neutralise them in CSS
                    (gallery/gallery-theme.css: [data-ocean-chrome]{display:none});
                    removing them at the source fixes cbi + offers-tools too and
                    makes that CSS override redundant rather than load-bearing. */}
                <div className="vignette" />
                <div className="grain" />
                <Cursor />
            </body>
        </html>
    )
}
