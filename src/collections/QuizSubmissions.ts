import type { CollectionConfig } from 'payload'

export const QuizSubmissions: CollectionConfig = {
  slug: 'quiz-submissions',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'score', 'resultTier', 'createdAt'],
    group: 'Intake & Requests',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'email', type: 'email', required: true },
    { name: 'score', type: 'number', required: true, min: 0, max: 30 },
    {
      name: 'resultTier',
      type: 'select',
      required: true,
      options: [
        { label: 'Invisible', value: 'invisible' },
        { label: 'Inconsistent', value: 'inconsistent' },
        { label: 'Established', value: 'established' },
      ],
    },
    {
      name: 'answers',
      type: 'json',
      admin: { description: 'Array of selected answer indices (0-3) per question' },
    },
  ],
}
