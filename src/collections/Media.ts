import type { CollectionConfig } from 'payload'
import { isAdmin, isAuthenticated } from '@/lib/payload-access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    // Public read is required — Payload's /api/media/file/:name endpoint serves
    // images on public pages. Restricting read here blocks those requests with 403.
    // Use admin.hidden below to keep the collection out of the non-admin sidebar.
    read: () => true,
    // Any authenticated user can upload (so members can add cover images to posts).
    create: isAuthenticated,
    update: isAuthenticated,
    // Delete stays admin-only to prevent members removing images other posts depend on.
    delete: isAdmin,
  },
  admin: {
    group: 'Content',
    // Hide the Media collection from non-admin users in the sidebar
    hidden: ({ user }) => (user as any)?.role !== 'admin',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe the image for screen readers and search engines. Not the prompt used to generate it.',
      },
      /* This field was required but unvalidated, so raw AI image prompts were
       * pasted in at upload time and shipped to production as the public alt
       * text - including one containing a chatgpt.com conversation link, live
       * on the blog index. An external QA audit caught it. Reject the obvious
       * tells so it cannot happen again. */
      validate: (value: unknown) => {
        if (typeof value !== 'string' || !value.trim()) return 'Alt text is required.'
        const v = value.trim()
        if (/https?:\/\//i.test(v)) return 'Alt text must not contain a URL.'
        if (v.length > 180) return 'Alt text must be under 180 characters - describe, do not prompt.'
        const promptTells = [
          'hyper-realistic',
          'photorealistic',
          'no plastic skin',
          '--ar',
          '8k',
          '4k,',
          'octane',
          'midjourney',
          'dall-e',
          'stable diffusion',
          'prompt:',
        ]
        const hit = promptTells.find((t) => v.toLowerCase().includes(t))
        if (hit) return `Alt text looks like a generation prompt (contains "${hit}"). Describe the image instead.`
        return true
      },
    },
  ],
  upload: true,
}
