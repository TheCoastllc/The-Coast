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
    // SMS express-consent audit trail (Twilio toll-free A2P / CTIA).
    { name: 'smsConsentTransactional', type: 'checkbox', defaultValue: false },
    { name: 'smsConsentMarketing', type: 'checkbox', defaultValue: false },
    { name: 'smsConsentAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' }, readOnly: true } },
    { name: 'smsConsentText', type: 'textarea', admin: { readOnly: true } },
    { name: 'consentSource', type: 'text', admin: { readOnly: true } },
  ],
}
