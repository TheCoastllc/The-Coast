import type { CollectionConfig } from 'payload'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'businessName',
    defaultColumns: ['businessName', 'contactName', 'email', 'status', 'subscriptionTier'],
    group: 'Projects & Clients',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'betterAuthUserId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Better Auth user ID linking this client to their auth account' },
    },
    { name: 'email', type: 'email', required: true, unique: true },
    { name: 'contactName', type: 'text', required: true },
    { name: 'businessName', type: 'text', required: true },
    { name: 'logoUrl', type: 'text' },
    { name: 'phone', type: 'text' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Invited', value: 'invited' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
    {
      name: 'subscriptionTier',
      type: 'select',
      options: [
        { label: 'Starter', value: 'starter' },
        { label: 'Pro', value: 'pro' },
        { label: 'Ultimate', value: 'ultimate' },
        { label: 'Custom', value: 'custom' },
      ],
    },
    { name: 'website', type: 'text' },
    { name: 'industry', type: 'text' },
    { name: 'notes', type: 'textarea' },
  ],
}
