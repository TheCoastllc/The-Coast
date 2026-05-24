import { isAuthenticated } from '@/lib/payload-access'
import { revalidatePath } from 'next/cache'
import type { GlobalConfig } from 'payload'

export const TrustedBy: GlobalConfig = {
  slug: 'trusted-by',
  label: 'Trusted By',
  admin: {
    group: 'Content',
    description:
      'Manage the brands shown in the "Trusted By" sections (hero marquee and dedicated section). Each entry can be a text name, a logo image, or both.',
  },
  access: {
    read: () => true,
    update: isAuthenticated,
  },
  hooks: {
    afterChange: [
      () => {
        revalidatePath('/')
      },
    ],
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Brands',
      labels: { singular: 'Brand', plural: 'Brands' },
      admin: {
        description:
          'Add, reorder, or remove brands. Provide a name, a logo, or both. Logos are rendered at a consistent size.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Brand name. Shown as a typographic wordmark by default.',
          },
        },
        {
          name: 'wordmark',
          type: 'text',
          required: false,
          admin: {
            description:
              'Optional display override (e.g. abbreviated form). Leave blank to use the name as-is.',
          },
        },
        {
          name: 'category',
          type: 'text',
          required: false,
          admin: {
            description:
              'Short descriptor of the work, shown as a mono tag. Example: "BRANDING · WEB".',
          },
        },
        {
          name: 'year',
          type: 'number',
          required: false,
          admin: {
            description: 'Year of engagement (or most recent collaboration).',
          },
        },
        {
          name: 'caseStudySlug',
          type: 'text',
          required: false,
          admin: {
            description:
              'If set, the card links to /work/[slug]. Matches an entry in src/lib/case-studies.ts.',
          },
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: {
            description:
              'Optional logo image. Kept for backwards compatibility — the TrustedLedger redesign prefers typographic wordmarks.',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: false,
          admin: {
            description: 'Optional external link to the brand website.',
          },
        },
        { name: 'published', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
