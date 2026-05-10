import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrSelf, isAuthenticated } from '@/lib/payload-access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'fullName',
    group: 'Administration',
    defaultColumns: ['fullName', 'email', 'role'],
  },
  auth: true,
  access: {
    // Authenticated users need read access so the Posts "author" relationship
    // field can render the byline (fullName) instead of "Untitled - ID: X".
    read: isAuthenticated,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
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
      name: 'role',
      type: 'select',
      defaultValue: 'member',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Member', value: 'member' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Admin: full access. Member: Posts, FAQ, TrustedBy, Privacy, and Terms only.',
      },
      // Only admins can change roles
      access: {
        update: ({ req: { user } }) => (user as any)?.role === 'admin',
      },
    },
  ],
}
