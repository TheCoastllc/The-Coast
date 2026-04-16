import { revalidatePath } from 'next/cache'
import type { CollectionConfig } from 'payload'

const estimateReadingTime = (content: any): number => {
  if (!content?.root?.children) return 1
  const extractText = (node: any): string => {
    if (node.text) return node.text
    if (node.children) return node.children.map(extractText).join(' ')
    return ''
  }
  const text = extractText(content.root)
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 230))
}

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidatePath('/')
        revalidatePath('/blog')
        if (doc.slug) revalidatePath(`/blog/${doc.slug}`)
        if (doc.category) revalidatePath(`/blog/category/${doc.category}`)
      },
    ],
    beforeChange: [
      ({ data, operation }) => {
        if (!data) return data

        // Auto-generate slug from title
        if (data.title && (!data.slug || operation === 'create')) {
          data.slug = slugify(data.title)
        }

        // Auto-generate reading time from content
        if (data.content) {
          data.readingTime = estimateReadingTime(data.content)
        }

        // Auto-set publishedAt when status changes to published
        if (data.status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Auto-generated from title. Edit to customize.',
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Auto-set when published. Override to schedule.',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Brand Strategy', value: 'brand-strategy' },
        { label: 'Visual Identity', value: 'visual-identity' },
        { label: 'Logo Design', value: 'logo-design' },
        { label: 'Web Design', value: 'web-design' },
        { label: 'Social Media', value: 'social-media' },
        { label: 'Creative Direction', value: 'creative-direction' },
        { label: 'Case Study', value: 'case-study' },
        { label: 'Industry Insights', value: 'industry-insights' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'readingTime',
      label: 'Reading Time (min)',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Auto-calculated from content.',
        readOnly: true,
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 280,
      admin: {
        description: 'Brief summary shown on blog cards and SEO meta.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      admin: {
        position: 'sidebar',
        description: 'Select the author of this post. Leave blank to show "The Coast" as byline.',
      },
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        description: 'Add relevant tags for filtering.',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
  ],
}
