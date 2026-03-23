import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { GlobalConfig } from 'payload'

export const TermsOfService: GlobalConfig = {
  slug: 'terms-of-service',
  label: 'Terms of Service',
  admin: {
    group: 'Legal Pages',
    description: 'Content for the /terms page. Edit here to update the live Terms of Service.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'lastUpdated',
      type: 'date',
      label: 'Last Updated',
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: { pickerAppearance: 'dayOnly' },
        description: 'Date displayed at the top of the Terms of Service page.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Terms of Service Content',
      editor: lexicalEditor(),
      admin: {
        description: 'Full Terms of Service text. Use headings, paragraphs, and lists.',
      },
    },
  ],
}
