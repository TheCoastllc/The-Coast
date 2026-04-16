import { revalidatePath } from 'next/cache'
import type { GlobalConfig } from 'payload'

export const PrivacyPolicy: GlobalConfig = {
  slug: 'privacy-policy',
  label: 'Privacy Policy',
  admin: {
    group: 'Legal Pages',
    description: 'Content for the /privacy page. Edit here to update the live Privacy Policy.',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      () => {
        revalidatePath('/privacy')
      },
    ],
  },
  fields: [
    {
      name: 'lastUpdated',
      type: 'date',
      label: 'Last Updated',
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: { pickerAppearance: 'dayOnly' },
        description: 'Date displayed at the top of the Privacy Policy page.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Privacy Policy Content',
      admin: {
        description: 'Full Privacy Policy text. Use headings, paragraphs, and lists.',
      },
    },
  ],
}
