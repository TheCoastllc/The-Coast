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
            description: 'Brand name. Shown as a fallback if no logo is provided.',
          },
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: {
            description:
              'Optional logo image. Prefer transparent PNG or SVG. Will be rendered at a consistent height.',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: false,
          admin: {
            description: 'Optional link to the brand website.',
          },
        },
        { name: 'published', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
