import type { CollectionConfig } from 'payload'

export const IntakeSubmissions: CollectionConfig = {
  slug: 'intake-submissions',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'businessName', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'fullName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'businessName', type: 'text', required: true },
    { name: 'website', type: 'text' },
    { name: 'businessDescription', type: 'textarea', required: true },
    { name: 'idealCustomer', type: 'textarea' },
    { name: 'servicesInterested', type: 'json' },
    { name: 'brandVibes', type: 'json' },
    { name: 'colorPreferences', type: 'json' },
    { name: 'colorsToAvoid', type: 'text' },
    { name: 'brandsAdmired', type: 'textarea' },
    { name: 'budget', type: 'text' },
    { name: 'timeline', type: 'text' },
    { name: 'additionalVision', type: 'textarea' },
  ],
}
