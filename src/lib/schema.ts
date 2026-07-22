// Sitewide structured-data graph for The Coast Global.
// One multi-typed #organization node (ProfessionalService is a LocalBusiness
// subclass, so this single node IS the local-business signal) + the #website
// node, emitted on every page via <OrgSchema /> in the root layouts. Per-page
// schemas (Service, Article, Breadcrumb, FAQ) stay inline in their pages and
// reference ORG_ID - mounting the graph globally resolves those references
// on every route, not just the homepage.

import { BRAND, COMPANY } from '@/lib/content/coast'

export const SITE_URL = 'https://coastglobal.org'
export const ORG_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`

/** City-level NAP - matches the Google Business Profile (service-area
 *  business, no published street address). Keep in exact sync with GBP. */
export const NAP = {
  name: BRAND,
  telephone: '+16827020374',
  email: COMPANY.email,
  addressLocality: 'Dallas',
  addressRegion: 'TX',
  addressCountry: 'US',
} as const

/** Home metro + the three service states, most specific first. */
export const AREA_SERVED = [
  { '@type': 'City', name: 'Dallas' },
  { '@type': 'City', name: 'Fort Worth' },
  { '@type': 'Place', name: 'Dallas-Fort Worth Metroplex' },
  { '@type': 'State', name: 'Texas' },
  { '@type': 'State', name: 'Florida' },
  { '@type': 'State', name: 'Alabama' },
  { '@type': 'Country', name: 'United States' },
]

export const SAME_AS = [
  'https://www.instagram.com/coastglobal',
  'https://www.facebook.com/coastglobal',
  'https://www.linkedin.com/company/thecoastcompanylimited/',
  'https://x.com/TheCoastHQ',
  'https://www.pinterest.com/coastglobal',
]

/** The verified Google Business Profile listing (place_id from the on-site
 *  write-review link) - used for site<->GBP entity reciprocity. */
export const GOOGLE_LISTING_URL =
  'https://www.google.com/maps/place/?q=place_id:ChIJ_fjV-mLpAo4Riif8WzjsV70'

export function buildOrgGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        // ProfessionalService subclasses LocalBusiness; keeping the existing
        // #organization @id means every page's provider/about references
        // resolve against this richer node with zero edits elsewhere.
        '@type': ['ProfessionalService', 'Organization'],
        '@id': ORG_ID,
        name: BRAND,
        legalName: COMPANY.name,
        alternateName: ['The Coast', 'Coast Global'],
        url: SITE_URL,
        // true pixel dimensions of full-logo.png - >=600px wide keeps every
        // BlogPosting (which inherits this via publisher) Article-rich-result
        // eligible
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/full-logo.png`,
          width: 1145,
          height: 412,
        },
        founder: { '@type': 'Person', name: 'David Coast', url: `${SITE_URL}/about` },
        image: { '@type': 'ImageObject', url: `${SITE_URL}/preview.jpg` },
        description:
          'Branding, digital growth, and AI agency turning small businesses into premium-tier brands. Based in Dallas-Fort Worth, serving Texas, Florida, and Alabama.',
        email: NAP.email,
        telephone: NAP.telephone,
        priceRange: '$$',
        foundingDate: '2023-02',
        address: {
          '@type': 'PostalAddress',
          addressLocality: NAP.addressLocality,
          addressRegion: NAP.addressRegion,
          addressCountry: NAP.addressCountry,
        },
        areaServed: AREA_SERVED,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          telephone: NAP.telephone,
          email: NAP.email,
          availableLanguage: 'English',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Branding & Marketing',
                url: `${SITE_URL}/services`,
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Digital Growth & Lead Generation',
                url: `${SITE_URL}/services`,
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'AI Consulting & Custom Software',
                url: `${SITE_URL}/ai`,
              },
            },
          ],
        },
        // NOTE: No aggregateRating here. Google's structured-data policy forbids
        // self-serving ratings (reviews about the business, collected on its own
        // site) on Organization/LocalBusiness - they are ineligible for star rich
        // results and can trigger a manual action. Real Google reviews still
        // render on-page via ReviewsMarquee.
        sameAs: SAME_AS,
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: SITE_URL,
        name: BRAND,
        description: 'Brand design studio building unforgettable visual identities.',
        publisher: { '@id': ORG_ID },
      },
    ],
  }
}
