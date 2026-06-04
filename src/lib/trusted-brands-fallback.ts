import type { LedgerBrand } from '@/components/TrustedLedger'

/**
 * Hardcoded fallback for the TrustedLedger when the Payload `trusted-by`
 * global is empty (fresh installs, local dev without a populated DB).
 *
 * The canonical list comes from David's brief. Edit the Payload global to
 * change what's actually shown in production - this list only kicks in when
 * Payload returns zero entries.
 *
 * Roster updated: removed Duda, Global Finance Group, Hatch SN. Added Dada
 * Global Finance (our build, dadaglobalfin.com). OgaTicket, AMG Records and
 * Zapped Co sit at the bottom. All brands render as typographic wordmarks.
 */
export const TRUSTED_BRANDS_FALLBACK: LedgerBrand[] = [
  {
    id: 'troi',
    name: 'TROI Trading & Tech',
    wordmark: 'TROI',
    category: 'FINANCE · AI',
    year: 2025,
    url: 'https://troitradingandtech.com',
  },
  {
    id: 'kando',
    name: 'Kando Elite Health',
    wordmark: 'Kando',
    category: 'HEALTHCARE · CONCIERGE',
    year: 2025,
    url: 'https://kandoelitehealth.com',
  },
  {
    id: 'new-era-aesthetics',
    name: 'New Era Aesthetics',
    wordmark: 'New Era',
    category: 'MEDICAL TECH · IDENTITY',
    year: 2025,
    url: 'https://neweraaesthetics.com',
  },
  {
    id: 'solomon-katsman',
    name: 'Solomon Katsman',
    wordmark: 'Solomon Katsman',
    category: 'WEALTH · PERSONAL BRAND',
    year: 2025,
    url: 'https://solomonkatsman.com',
  },
  {
    id: 'dada-global-finance',
    name: 'Dada Global Finance',
    wordmark: 'Dada Global Finance',
    category: 'FINANCE · WEB',
    year: 2025,
    caseStudySlug: 'dada-global-finance',
    url: 'https://dadaglobalfin.com',
  },
  {
    id: 'omotunde-hospital',
    name: 'Omotunde Hospital',
    wordmark: 'Omotunde Hospital',
    category: 'HEALTHCARE',
    year: 2026,
    caseStudySlug: 'omotunde-hospital',
  },
  {
    id: 'iamd-health',
    name: 'iAMD Health',
    wordmark: 'iAMD Health',
    category: 'HEALTHCARE',
    year: 2026,
    caseStudySlug: 'iamd-health',
  },
  {
    id: 'ogaticket',
    name: 'OgaTicket',
    wordmark: 'OgaTicket',
    category: 'WEB · PRODUCT',
    year: 2024,
    caseStudySlug: 'ogaticket',
  },
  {
    id: 'amg-records',
    name: 'AMG Records',
    wordmark: 'AMG Records',
    category: 'BRAND IDENTITY',
    year: 2024,
    caseStudySlug: 'amg-records',
  },
  {
    id: 'zapped',
    name: 'Zapped Co',
    wordmark: 'Zapped Co',
    category: 'REBRAND · 15+ DELIVERABLES',
    year: 2024,
    caseStudySlug: 'zappedco',
  },
]
