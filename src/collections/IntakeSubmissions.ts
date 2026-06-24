import { isAdmin } from '@/lib/payload-access'
import type { CollectionConfig } from 'payload'

export const IntakeSubmissions: CollectionConfig = {
  slug: 'intake-submissions',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'businessName', 'createdAt'],
    group: 'Intake & Requests',
  },
  access: {
    read: isAdmin,
    create: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'fullName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'businessName', type: 'text', required: true },
    { name: 'website', type: 'text' },
    { name: 'businessDescription', type: 'textarea', required: true },
    { name: 'idealCustomer', type: 'textarea' },
    { name: 'servicesInterested', type: 'json' },
    { name: 'brandVibes', type: 'json' },
    { name: 'colorPreferences', type: 'json' },
    { name: 'colorsToAvoid', type: 'text' },
    { name: 'brandsAdmired', type: 'textarea' },
    { name: 'budget', type: 'text' },
    { name: 'timeline', type: 'text' },
    { name: 'additionalVision', type: 'textarea' },
    // SMS express-consent audit trail (Twilio toll-free A2P / CTIA).
    { name: 'smsConsentTransactional', type: 'checkbox', defaultValue: false },
    { name: 'smsConsentMarketing', type: 'checkbox', defaultValue: false },
    { name: 'smsConsentAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' }, readOnly: true } },
    { name: 'smsConsentText', type: 'textarea', admin: { readOnly: true } },
    { name: 'consentSource', type: 'text', admin: { readOnly: true } },
  ],
}
