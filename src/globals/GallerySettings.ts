import { isAuthenticated } from '@/lib/payload-access'
import { revalidatePath } from 'next/cache'
import type { GlobalConfig } from 'payload'

/**
 * Gallery Settings - the outbound links the gallery subdomain drives traffic to.
 * Admin-editable so David can change the Pinterest profile / Shopify store URL
 * without a deploy. Read publicly; only logged-in users can edit.
 */
export const GallerySettings: GlobalConfig = {
  slug: 'gallery-settings',
  label: 'Gallery Settings',
  admin: {
    group: 'Content',
    description: 'The Pinterest and Shopify links shown on gallery.coastglobal.org.',
  },
  access: {
    read: () => true,
    update: isAuthenticated,
  },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidatePath('/gallery')
        } catch {
          // safe to ignore outside a Next server context
        }
      },
    ],
  },
  fields: [
    {
      name: 'pinterestUrl',
      type: 'text',
      label: 'Pinterest profile URL',
      defaultValue: 'https://pin.it/nW5MRvKEz',
      admin: { description: 'Full URL to the Pinterest profile/board.' },
      validate: (v: string | null | undefined) =>
        !v || /^https?:\/\//.test(v) ? true : 'Enter a full URL starting with https://',
    },
    {
      name: 'shopifyUrl',
      type: 'text',
      label: 'Shopify store URL',
      admin: { description: 'Full URL to the Shopify store. Leave blank to hide the Shop link.' },
      validate: (v: string | null | undefined) =>
        !v || /^https?:\/\//.test(v) ? true : 'Enter a full URL starting with https://',
    },
  ],
}
