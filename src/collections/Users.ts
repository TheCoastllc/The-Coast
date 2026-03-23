import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'fullName',
    group: 'Administration',
    defaultColumns: ['fullName', 'email'],
  },
  auth: true,
  fields: [
    // Email added by default
    {
      name: 'fullName',
      type: 'text',
      label: 'Full Name',
      admin: {
        description: 'Display name shown as blog post author byline.',
      },
    },
  ],
}
