import { revalidatePath } from 'next/cache'
import type { CollectionConfig } from 'payload'
import { isAuthenticated } from '@/lib/payload-access'

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

// Strip apostrophes/quotes before replacing other non-alphanumeric chars so
// "can't" → "cant" instead of "can-t"
const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/['''"""]/g, '')
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
    read: () => true, // public — blog posts are publicly readable
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidatePath('/')
          revalidatePath('/blog')
          revalidatePath('/llms.txt')
          if (doc.slug) revalidatePath(`/blog/${doc.slug}`)
          if (doc.category) revalidatePath(`/blog/category/${doc.category}`)
        } catch {
          // revalidatePath requires a Next.js server context — safe to ignore in scripts
        }
      },
    ],
    beforeChange: [
      ({ data, operation, req }) => {
        if (!data) return data

        // Auto-assign author on create. Non-admins always get themselves;
        // admins default to themselves but can pick another user.
        if (operation === 'create' && req.user?.id) {
          const isAdmin = (req.user as any).role === 'admin'
          if (!isAdmin || !data.author) {
            data.author = req.user.id
          }
        }

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
      validate: (value: string | null | undefined, { req }: { req: any }) => {
        if (req?.context?.scriptUpdate) return true
        const trimmed = value?.trim() ?? ''
        if (!trimmed) return 'Title is required — give your post a clear, descriptive headline.'
        if (trimmed.length < 10) return `Title is only ${trimmed.length} characters. Aim for at least 10 so it reads like a real headline.`
        if (trimmed.length > 120) return `Title is ${trimmed.length} characters — keep it under 120 so it doesn't get truncated in search results.`
        return true
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Auto-generated from title. Admins can edit to customize.',
        position: 'sidebar',
        readOnly: true,
      },
      access: {
        update: ({ req: { user } }) => (user as any)?.role === 'admin',
      },
      validate: (value: string | null | undefined, { req }: { req: any }) => {
        if (req?.context?.scriptUpdate) return true
        const trimmed = value?.trim() ?? ''
        if (!trimmed) return 'Slug is missing — it\'s normally generated from the title. Make sure the title isn\'t empty.'
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed)) {
          return 'Slug must be lowercase letters, numbers, and single hyphens only (e.g. "my-post-title"). No spaces, capitals, or special characters.'
        }
        return true
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
        description: 'Only admins can publish or unpublish posts.',
      },
      access: {
        create: ({ req: { user } }) => (user as any)?.role === 'admin',
        update: ({ req: { user } }) => (user as any)?.role === 'admin',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Auto-set when published. Admins can override to schedule.',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        readOnly: true,
      },
      access: {
        update: ({ req: { user } }) => (user as any)?.role === 'admin',
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
      validate: (value: string | null | undefined, { req }: { req: any }) => {
        if (req?.context?.scriptUpdate) return true
        if (!value) return 'Pick a category in the sidebar — it controls where this post shows up on the blog.'
        return true
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
      access: {
        update: () => false,
      },
    },
    {
      name: 'directAnswer',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'GEO answer box — write a direct answer to the post\'s core question in ≤50 words. Renders as a highlighted summary before the article.',
      },
      validate: (value: string | null | undefined, { req }: { req: any }) => {
        if (req?.context?.scriptUpdate) return true
        const trimmed = value?.trim() ?? ''
        if (!trimmed) return 'Direct answer is required. Write ≤50 words answering the post\'s core question — this is what AI search engines (ChatGPT, Perplexity, Google AI Overviews) cite.'
        const wordCount = trimmed.split(/\s+/).filter(Boolean).length
        if (wordCount > 50) return `Direct answer is ${wordCount} words — keep it ≤50 for AI engines to cite cleanly.`
        return true
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 280,
      admin: {
        description: 'Brief summary shown on blog cards and SEO meta description (120–160 chars ideal).',
      },
      validate: (value: string | null | undefined, { req }: { req: any }) => {
        if (req?.context?.scriptUpdate) return true
        const trimmed = value?.trim() ?? ''
        if (!trimmed) return 'Excerpt is required — it becomes the SEO meta description and shows on blog cards.'
        if (trimmed.length < 120) return `Excerpt is ${trimmed.length} chars — needs at least 120 for a meaningful SEO meta description (120–160 ideal).`
        return true
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      validate: (value: any, { req }: { req: any }) => {
        if (req?.context?.scriptUpdate) return true
        if (!value) return 'Cover image is required — pick one from the Media library, or ask an admin to upload a new image first.'
        return true
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      validate: (value: any, { req }: { req: any }) => {
        if (req?.context?.scriptUpdate) return true
        if (!value || !value.root) return 'Post content is empty — write the body of your post in the editor below.'
        const extractText = (node: any): string => {
          if (node?.text) return node.text
          if (node?.children) return node.children.map(extractText).join(' ')
          return ''
        }
        const wordCount = extractText(value.root).trim().split(/\s+/).filter(Boolean).length
        if (wordCount === 0) return 'Post content is empty — write the body of your post in the editor below.'
        if (wordCount < 50) return `Post body is only ${wordCount} word${wordCount === 1 ? '' : 's'} — write at least 50 words for a meaningful article.`
        return true
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      defaultValue: ({ user }) => user?.id,
      admin: {
        position: 'sidebar',
        description: 'Pre-filled with you on create. Only admins can reassign.',
      },
      access: {
        create: ({ req: { user } }) => (user as any)?.role === 'admin',
        update: ({ req: { user } }) => (user as any)?.role === 'admin',
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
