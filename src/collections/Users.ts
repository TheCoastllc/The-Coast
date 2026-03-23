import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Administration',
    defaultColumns: ['email', 'fullName', 'authorTitle'],
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
    {
      name: 'authorTitle',
      type: 'text',
      label: 'Title / Role',
      admin: {
        description: 'e.g. "Lead Designer at The Coast"',
      },
    },
    {
      name: 'authorBio',
      type: 'textarea',
      label: 'Author Bio',
      maxLength: 300,
      admin: {
        description: 'Short bio shown below blog posts (max 300 characters).',
      },
    },
  ],
}
