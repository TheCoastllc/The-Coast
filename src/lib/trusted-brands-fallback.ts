import type { LedgerBrand } from '@/components/TrustedLedger'

/**
 * Hardcoded fallback for the TrustedLedger when the Payload `trusted-by`
 * global is empty (fresh installs, local dev without a populated DB).
 *
 * The canonical list comes from David's brief. Edit the Payload global to
 * change what's actually shown in production — this list only kicks in when
 * Payload returns zero entries.
 *
 * Roster locked: 10 brands (May 2026 update).
 * - Removed: Happreneurs
 * - Added: TROI, Kando, New Era Aesthetics, Solomon Katsman
 * - The Coast itself is intentionally NOT in the list (per Q1).
 * - All brands render as typographic wordmarks (per Q2). No logo PNGs needed.
 */
export const TRUSTED_BRANDS_FALLBACK: LedgerBrand[] = [
  {
    id: 'duda',
    name: 'Duda',
    wordmark: 'Duda',
    category: 'BRAND SYSTEM',
    year: 2024,
  },
  {
    id: 'global-finance-group',
    name: 'Global Finance Group',
    wordmark: 'Global Finance',
    category: 'IDENTITY · WEB',
    year: 2023,
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
    id: 'ogaticket',
    name: 'OgaTicket',
    wordmark: 'OgaTicket',
    category: 'WEB · PRODUCT',
    year: 2024,
    caseStudySlug: 'ogaticket',
  },
  {
    id: 'zapped',
    name: 'Zapped Co',
    wordmark: 'Zapped Co',
    category: 'REBRAND · 15+ DELIVERABLES',
    year: 2024,
    caseStudySlug: 'zappedco',
  },
  {
    id: 'hatch-startup-nation',
    name: 'Hatch Startup Nation',
    wordmark: 'Hatch SN',
    category: 'IDENTITY · INCUBATOR',
    year: 2023,
    caseStudySlug: 'hatch-startup-nation',
  },
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
]
