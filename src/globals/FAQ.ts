import { revalidatePath } from 'next/cache'
import type { GlobalConfig } from 'payload'

export const FAQ: GlobalConfig = {
  slug: 'faq',
  label: 'FAQ',
  admin: {
    group: 'Content',
    description: 'Manage frequently asked questions displayed on the site.',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      () => {
        revalidatePath('/faq')
        revalidatePath('/')
      },
    ],
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'FAQ Items',
      labels: { singular: 'Question', plural: 'Questions' },
      admin: {
        description: 'Add, reorder, or remove FAQ entries. Drag to reorder.',
        initCollapsed: true,
        components: {
          RowLabel: '@/components/PayloadAdmin/FAQRowLabel#FAQRowLabel',
        },
      },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
        {
          name: 'category',
          type: 'select',
          options: [
            { label: 'General', value: 'general' },
            { label: 'Pricing', value: 'pricing' },
            { label: 'Process', value: 'process' },
            { label: 'Support', value: 'support' },
          ],
          defaultValue: 'general',
        },
        { name: 'published', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
