import type { Metadata } from 'next'

const SITE_URL = 'https://offers.coastglobal.org'

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: 'The Coast Brand Lab — Interactive Brand Diagnostics',
        template: '%s | The Coast Brand Lab',
    },

    description:
        'The Coast Brand Lab: three interactive brand diagnostic tools for founders and marketing teams. Run the brand quiz, score consistency across 25 checkpoints, and take the 3-second first-impressions test — all free, all instant.',

    keywords: [
        'brand quiz',
        'brand consistency checklist',
        'brand test',
        'brand diagnostic',
        'free brand tools',
        'brand audit',
        'The Coast',
    ],

    authors: [{ name: 'The Coast', url: 'https://coastglobal.org' }],
    creator: 'The Coast',
    publisher: 'The Coast',

    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: SITE_URL,
        siteName: 'The Coast',
        title: 'The Coast Brand Lab — Interactive Brand Diagnostics',
        description:
            'Three interactive brand diagnostic tools: quiz your brand strength, audit your consistency, and test your first impressions — all free.',
        images: [
            {
                url: '/preview.jpg',
                width: 1600,
                height: 900,
                alt: 'The Coast — Free Brand Tools',
                type: 'image/jpeg',
            },
        ],
    },

    twitter: {
        card: 'summary_large_image',
        site: '@TheCoastHQ',
        creator: '@TheCoastHQ',
        title: 'The Coast Brand Lab — Interactive Brand Diagnostics',
        description:
            'Three interactive brand diagnostic tools from The Coast: quiz, consistency audit, and the 3-second test.',
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

export default function OffersLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
