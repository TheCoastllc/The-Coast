import type { CollectionConfig } from 'payload'
import { sendAdminNotification } from '@/lib/notifications'

export const Requests: CollectionConfig = {
  slug: 'requests',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'serviceType', 'priority', 'createdAt'],
    group: 'Intake & Requests',
  },
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create') {
          try {
            await sendAdminNotification(
              `New Client Request: ${doc.title}`,
              `<h2>New Service Request</h2>
              <p><strong>Title:</strong> ${doc.title}</p>
              <p><strong>Service:</strong> ${doc.serviceType || 'Not specified'}</p>
              <p><strong>Priority:</strong> ${doc.priority || 'normal'}</p>
              <p><strong>Description:</strong> ${doc.description}</p>`,
            )
          } catch (err) {
            return Response.json(
              { error: 'Failed to send request notification' + err },
              { status: 500 },
            )
          }
        }
      },
    ],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'client', type: 'relationship', relationTo: 'clients', required: true, index: true },
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    {
      name: 'serviceType',
      type: 'select',
      options: [
        { label: 'Logo Design', value: 'logo' },
        { label: 'Flyer', value: 'flyer' },
        { label: 'EPK', value: 'epk' },
        { label: 'Social Media', value: 'social' },
        { label: 'Website', value: 'website' },
        { label: 'Rebrand', value: 'rebrand' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: 'Normal', value: 'normal' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
    },
  ],
}
