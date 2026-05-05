import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/lib/payload-access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    // Images are served via Cloudinary URLs directly — not via the Payload read API.
    // Restricting read here only hides Media from the admin sidebar for non-admins.
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  admin: {
    group: 'Content',
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
