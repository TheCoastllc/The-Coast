import type { Metadata } from 'next'
import { Footer } from '@/components/footer'

const SITE_URL = 'https://cbi.coastglobal.org'

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: 'The Coast | COAST BRAND INDEX',
        template: '%s | The Coast',
    },

    description:
        'How strong is your wave? The Coast Brand Index scores your brand across five pillars and twenty criteria and gives you a Wave Rating in under two minutes — free.',

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
        title: 'How Strong Is Your Wave? — The Coast Brand Index',
        description:
            'Score your brand across five pillars and twenty criteria and get your Wave Rating in under two minutes. Free, instant, built to show you exactly where to sharpen.',
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
        title: 'How Strong Is Your Wave? — The Coast Brand Index',
        description:
            'Score your brand across five pillars and twenty criteria. Get your Wave Rating in under two minutes — free.',
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

export default function CbiLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Footer variant="minimal" />
        </>
    )
}
