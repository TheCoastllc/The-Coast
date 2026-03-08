import type { CollectionConfig } from 'payload'

export const EventIntakeSubmissions: CollectionConfig = {
  slug: 'event-intake-submissions',
  admin: {
    useAsTitle: 'contactName',
    defaultColumns: ['contactName', 'eventName', 'email', 'eventType', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'contactName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'eventName', type: 'text', required: true },
    { name: 'eventType', type: 'text' },
    { name: 'eventDate', type: 'date' },
    { name: 'eventLocation', type: 'text' },
    { name: 'expectedAttendees', type: 'text' },
    { name: 'servicesNeeded', type: 'json' },
    { name: 'budget', type: 'text' },
    { name: 'timeline', type: 'text' },
    { name: 'eventDescription', type: 'textarea', required: true },
    { name: 'additionalNotes', type: 'textarea' },
  ],
}
