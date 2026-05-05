import { isAdmin } from '@/lib/payload-access'
import type { CollectionConfig } from 'payload'

export const ProjectUpdates: CollectionConfig = {
  slug: 'project-updates',
  admin: {
    useAsTitle: 'message',
    defaultColumns: ['project', 'message', 'isInternal', 'createdAt'],
    group: 'Projects & Clients',
  },
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'project', type: 'relationship', relationTo: 'projects', required: true, index: true },
    { name: 'message', type: 'textarea', required: true },
    { name: 'isInternal', type: 'checkbox', defaultValue: false },
    { name: 'createdBy', type: 'text' },
  ],
}
