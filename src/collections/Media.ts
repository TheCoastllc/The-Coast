import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/lib/payload-access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true, // public — served as image assets across the site
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
