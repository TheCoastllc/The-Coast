import type { CollectionConfig } from 'payload'

export const GoogleReviews: CollectionConfig = {
  slug: 'google-reviews',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'rating', 'displayOrder'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'initial', type: 'text', required: true },
    { name: 'color', type: 'text', required: true },
    { name: 'category', type: 'text', required: true },
    { name: 'text', type: 'textarea', required: true },
    { name: 'rating', type: 'number', required: true, min: 1, max: 5 },
    { name: 'displayOrder', type: 'number', defaultValue: 0 },
  ],
}
