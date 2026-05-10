import type { CollectionConfig } from 'payload'
import { isAdmin, isAuthenticated } from '@/lib/payload-access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    // Public read is required — Payload's /api/media/file/:name endpoint serves
    // images on public pages. Restricting read here blocks those requests with 403.
    // Use admin.hidden below to keep the collection out of the non-admin sidebar.
    read: () => true,
    // Any authenticated user can upload (so members can add cover images to posts).
    create: isAuthenticated,
    update: isAuthenticated,
    // Delete stays admin-only to prevent members removing images other posts depend on.
    delete: isAdmin,
  },
  admin: {
    group: 'Content',
    // Hide the Media collection from non-admin users in the sidebar
    hidden: ({ user }) => (user as any)?.role !== 'admin',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
