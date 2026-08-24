import type { LedgerBrand } from '@/components/TrustedLedger'

/**
 * Hardcoded fallback for the TrustedLedger when the Payload `trusted-by`
 * global is empty (fresh installs, local dev without a populated DB).
 *
 * The canonical list comes from David's brief. Edit the Payload global to
 * change what's actually shown in production - this list only kicks in when
 * Payload returns zero entries.
 *
 * Every brand carries `logo` - its REAL mark harvested from the live site
 * (David: "use their logos from their websites"), normalised to
 * white-on-transparent in public/clients/ by scripts/process-logos.ts.
 *
 * Roster updated: removed Duda, Global Finance Group, Hatch SN. Added Dada
 * Global Finance (our build, dadaglobalfin.com), The World Is Yours Inc and
 * Gifted Touch Therapeutic Massage; New Era Aesthetics now links to its case
 * study. OgaTicket, AMG Records and Zapped Co sit at the bottom. All brands
 * render as typographic wordmarks.
 */
export const TRUSTED_BRANDS_FALLBACK: LedgerBrand[] = [
  {
    id: 'troi',
    logo: '/clients/troi.png',
    logoAspect: 0.8,
    name: 'TROI Trading & Tech',
    wordmark: 'TROI',
    category: 'FINANCE · AI',
    year: 2025,
    url: 'https://troitradingandtech.com',
  },
  {
    id: 'kando',
    logo: '/clients/kando.png',
    logoAspect: 0.97,
    name: 'Kando Elite Health',
    wordmark: 'Kando',
    category: 'HEALTHCARE · CONCIERGE',
    year: 2025,
    url: 'https://kandoelitehealth.com',
  },
  {
    id: 'new-era-aesthetics',
    logo: '/clients/new-era-aesthetics.png',
    logoAspect: 1.63,
    name: 'New Era Aesthetics',
    wordmark: 'New Era',
    category: 'MEDICAL TECH · IDENTITY',
    year: 2025,
    url: 'https://neweraaesthetics.com',
    caseStudySlug: 'new-era-aesthetics',
  },
  {
    id: 'world-is-yours',
    logo: '/clients/world-is-yours.png',
    logoAspect: 18.71,
    name: 'The World Is Yours Inc',
    wordmark: 'The World Is Yours',
    category: 'REAL ESTATE · FINANCE',
    year: 2026,
    url: 'https://theworldisyoursinc.com',
    caseStudySlug: 'world-is-yours',
  },
  {
    id: 'gifted-touch',
    logo: '/clients/gifted-touch.png',
    logoAspect: 1,
    name: 'Gifted Touch Therapeutic Massage',
    wordmark: 'Gifted Touch',
    category: 'WELLNESS · WEB',
    year: 2026,
    url: 'https://giftedtouch.org',
    caseStudySlug: 'gifted-touch',
  },
  {
    id: 'omotunde-hospital',
    logo: '/clients/omotunde-hospital.png',
    logoAspect: 1,
    name: 'Omotunde Hospital',
    wordmark: 'Omotunde Hospital',
    category: 'HEALTHCARE',
    year: 2026,
    caseStudySlug: 'omotunde-hospital',
  },
  {
    id: 'iamd-health',
    logo: '/clients/iamd-health.png',
    logoAspect: 2.16,
    name: 'iAMD Health',
    wordmark: 'iAMD Health',
    category: 'HEALTHCARE',
    year: 2026,
    caseStudySlug: 'iamd-health',
  },
  {
    id: 'ogaticket',
    logo: '/clients/ogaticket.png',
    logoAspect: 7.25,
    name: 'OgaTicket',
    wordmark: 'OgaTicket',
    category: 'WEB · PRODUCT',
    year: 2024,
    caseStudySlug: 'ogaticket',
  },
  {
    id: 'amg-records',
    logo: '/clients/amg-records.png',
    logoAspect: 2.53,
    name: 'AMG Records',
    wordmark: 'AMG Records',
    category: 'BRAND IDENTITY',
    year: 2024,
    caseStudySlug: 'amg-records',
  },
  {
    id: 'zapped',
    logo: '/clients/zapped.png',
    logoAspect: 3.8,
    name: 'Zapped Co',
    wordmark: 'Zapped Co',
    category: 'REBRAND · 15+ DELIVERABLES',
    year: 2024,
    caseStudySlug: 'zappedco',
  },
]
