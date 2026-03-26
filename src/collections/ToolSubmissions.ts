import type { CollectionConfig } from 'payload'

export const ToolSubmissions: CollectionConfig = {
  slug: 'tool-submissions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'company', 'tool', 'score', 'resultTier', 'createdAt'],
    group: 'Intake & Requests',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'company', type: 'text' },
    { name: 'role', type: 'text' },
    {
      name: 'tool',
      type: 'select',
      required: true,
      options: [
        { label: 'Brand Quiz', value: 'brand-quiz' },
        { label: 'Brand Checklist', value: 'brand-checklist' },
        { label: '3-Second Test', value: '3-second-test' },
      ],
    },
    { name: 'score', type: 'number' },
    {
      name: 'resultTier',
      type: 'text',
      admin: { description: 'Quiz tier, checklist band, or test outcome' },
    },
    {
      name: 'answers',
      type: 'json',
      admin: { description: 'Tool-specific response data' },
    },
  ],
}
