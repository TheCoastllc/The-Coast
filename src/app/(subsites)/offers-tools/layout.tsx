import type { Metadata } from 'next'
import { Footer } from '@/components/footer'

const SITE_URL = 'https://offers.coastglobal.org'

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: 'Coast Brand Lab - Interactive Brand Diagnostics',
        template: '%s | Coast Brand Lab',
    },

    description:
        'Coast Brand Lab: three interactive brand diagnostic tools for founders and marketing teams. Run the brand quiz, score consistency across 25 checkpoints, and take the 3-second first-impressions test - all free, all instant.',

    keywords: [
        'brand quiz',
        'brand consistency checklist',
        'brand test',
        'brand diagnostic',
        'free brand tools',
        'brand audit',
        'The Coast Global',
    ],

    authors: [{ name: 'The Coast Global', url: 'https://coastglobal.org' }],
    creator: 'The Coast Global',
    publisher: 'The Coast Global',

    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: SITE_URL,
        siteName: 'The Coast Global',
        title: 'Coast Brand Lab - Interactive Brand Diagnostics',
        description:
            'Three interactive brand diagnostic tools: quiz your brand strength, audit your consistency, and test your first impressions - all free.',
        images: [
            {
                url: '/preview.jpg',
                width: 1600,
                height: 900,
                alt: 'The Coast Global - Free Brand Tools',
                type: 'image/jpeg',
            },
        ],
    },

    twitter: {
        card: 'summary_large_image',
        site: '@TheCoastHQ',
        creator: '@TheCoastHQ',
        title: 'Coast Brand Lab - Interactive Brand Diagnostics',
        description:
            'Three interactive brand diagnostic tools from The Coast Global: quiz, consistency audit, and the 3-second test.',
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
    /* The tool screens shipped with NO footer at all - the only way out of a
       quiz was a single relative "Back to Offers" link, so every tool page was
       a dead end with no route back to the site, no contact and no legal links.
       Same minimal footer the cbi subsite uses, so the two now match. */
    return (
        <>
            {children}
            <Footer variant="minimal" />
        </>
    )
}
