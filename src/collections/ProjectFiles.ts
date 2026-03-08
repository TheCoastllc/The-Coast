import type { CollectionConfig } from 'payload'
import { sendAdminNotification } from '@/lib/notifications'

export const ProjectFiles: CollectionConfig = {
  slug: 'project-files',
  admin: {
    useAsTitle: 'fileName',
    defaultColumns: ['fileName', 'project', 'status', 'createdAt'],
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation }) => {
        if (operation === 'update' && previousDoc?.status !== doc.status) {
          try {
            await sendAdminNotification(
              `File Status Updated: ${doc.fileName}`,
              `<h2>File Status Change</h2>
              <p><strong>File:</strong> ${doc.fileName}</p>
              <p><strong>Status:</strong> ${doc.status}</p>
              <p><strong>Feedback:</strong> ${doc.clientFeedback || 'None'}</p>`,
            )
          } catch (err) {
            console.error('Failed to send file notification:', err)
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
    { name: 'project', type: 'relationship', relationTo: 'projects', required: true, index: true },
    { name: 'fileName', type: 'text', required: true },
    { name: 'fileType', type: 'text' },
    { name: 'fileSize', type: 'number' },
    { name: 'fileUrl', type: 'text' },
    { name: 'file', type: 'upload', relationTo: 'media' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending_review',
      options: [
        { label: 'Pending Review', value: 'pending_review' },
        { label: 'Approved', value: 'approved' },
        { label: 'Revision Requested', value: 'revision_requested' },
      ],
    },
    { name: 'clientFeedback', type: 'textarea' },
  ],
}
