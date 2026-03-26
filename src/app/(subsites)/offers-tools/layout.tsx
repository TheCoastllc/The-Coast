import type { Metadata } from 'next'

const SITE_URL = 'https://offers.coastglobal.org'

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: 'Free Brand Tools | The Coast',
        template: '%s | The Coast',
    },

    description:
        'Free interactive brand diagnostic tools from The Coast. Take the brand quiz, score your brand consistency, and run the 3-second test.',

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
        title: 'Free Brand Tools | The Coast',
        description:
            'Free interactive brand diagnostic tools. Quiz your brand strength, audit your consistency, and test your first impressions.',
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
        title: 'Free Brand Tools | The Coast',
        description:
            'Free interactive brand diagnostic tools from The Coast.',
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
