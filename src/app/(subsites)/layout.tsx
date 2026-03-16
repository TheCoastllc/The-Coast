import React from 'react'
import type { Metadata } from 'next'
import { Footer } from '@/components/footer'
import '../(frontend)/styles.css'
import Noise from '@/components/Noise'
import CustomCursor from '@/components/CustomCursor'


const SITE_URL = 'https://cbi.coastglobal.org'

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: 'The Coast | COAST BRAND INDEX',
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
        <html lang="en">
            <body>
                <Noise />

                {children}
                <Footer />
                <CustomCursor />
            </body>
        </html>
    )
}
