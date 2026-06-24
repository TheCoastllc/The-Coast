import { revalidatePath } from 'next/cache'
import type { CollectionConfig } from 'payload'
import { isAuthenticated } from '@/lib/payload-access'

// Strip apostrophes/quotes first so "Sun's Out" -> "suns-out" not "sun-s-out".
const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/['‘’"“”]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const httpsOnly = (value: string | null | undefined): true | string =>
  !value || /^https?:\/\//.test(value) ? true : 'Enter a full URL starting with https://'

/**
 * Gallery - curated artwork and creatives shown on gallery.coastglobal.org.
 * CMS-managed (Payload + Cloudinary): each item relates to the existing
 * Cloudinary-backed `media` collection, so no Cloudinary config changes are
 * needed. Mirrors Posts' status/access/hook pattern.
 */
export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'status', 'order'],
    group: 'Content',
    description: 'Artwork and creatives shown on the gallery subdomain. Drag/order with the "Order" field.',
  },
  access: {
    read: () => true, // public gallery - matches Posts/Media
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidatePath('/gallery')
        } catch {
          // revalidatePath needs a Next server context - safe to ignore in scripts
        }
      },
    ],
    beforeChange: [
      ({ data, operation }) => {
        if (!data) return data
        if (data.title && (!data.slug || operation === 'create')) {
          data.slug = slugify(data.title)
        }
        if (data.status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Auto-generated from the title.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'The artwork. Upload to the Media library - Cloudinary stores and serves it.',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      admin: { description: 'Optional. Shown in the lightbox and on hover.' },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Artwork', value: 'artwork' },
        { label: 'Illustration', value: 'illustration' },
        { label: 'Photography', value: 'photography' },
        { label: 'Brand', value: 'brand' },
        { label: 'Product', value: 'product' },
        { label: 'Other', value: 'other' },
      ],
      admin: { position: 'sidebar', description: 'Optional legacy tag. Sections (below) drive grouping.' },
    },
    {
      name: 'section',
      type: 'text',
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Section/collection this piece belongs to (set from its Drive subfolder name). Groups the gallery into labeled blocks.',
      },
    },
    {
      name: 'tags',
      type: 'array',
      admin: { description: 'Optional tags for future filtering.' },
      fields: [{ name: 'tag', type: 'text' }],
    },
    {
      name: 'shopUrl',
      type: 'text',
      label: 'Shopify product URL',
      validate: httpsOnly,
      admin: { description: 'Optional. Shows a "Shop this" button in the lightbox.' },
    },
    {
      name: 'pinUrl',
      type: 'text',
      label: 'Pinterest pin URL',
      validate: httpsOnly,
      admin: { description: 'Optional. Shows a "View on Pinterest" button in the lightbox.' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first. Ties break by newest.',
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
      admin: { position: 'sidebar', description: 'Only admins can publish or unpublish.' },
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
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Auto-set when first published.',
      },
    },
    {
      name: 'driveFileId',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        hidden: true,
        readOnly: true,
        description: 'Google Drive source file id - used to avoid re-importing on auto-sync.',
      },
    },
  ],
}
