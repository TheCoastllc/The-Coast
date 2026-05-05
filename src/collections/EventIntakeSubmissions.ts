import { isAdmin } from '@/lib/payload-access'
import type { CollectionConfig } from 'payload'

export const EventIntakeSubmissions: CollectionConfig = {
  slug: 'event-intake-submissions',
  admin: {
    useAsTitle: 'contactName',
    defaultColumns: ['contactName', 'eventName', 'email', 'eventType', 'createdAt'],
    group: 'Intake & Requests',
  },
  access: {
    read: isAdmin,
    create: () => true,
    update: isAdmin,
    delete: isAdmin,
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
