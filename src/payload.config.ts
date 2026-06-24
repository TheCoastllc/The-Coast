import { sqliteAdapter } from '@payloadcms/db-sqlite'
import {
  lexicalEditor,
  FixedToolbarFeature,
  EXPERIMENTAL_TableFeature,
  TextStateFeature,
  defaultColors,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Gallery } from './collections/Gallery'
import { PrivacyPolicy } from './globals/PrivacyPolicy'
import { TermsOfService } from './globals/TermsOfService'
import { GallerySettings } from './globals/GallerySettings'
import { Clients } from './collections/Clients'
import { Projects } from './collections/Projects'
import { ProjectFiles } from './collections/ProjectFiles'
import { ProjectUpdates } from './collections/ProjectUpdates'
import { Requests } from './collections/Requests'
import { IntakeSubmissions } from './collections/IntakeSubmissions'
import { EventIntakeSubmissions } from './collections/EventIntakeSubmissions'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { ToolSubmissions } from './collections/ToolSubmissions'
import { FAQ as FAQGlobal } from './globals/FAQ'
import { TrustedBy } from './globals/TrustedBy'

import { resendAdapter } from '@payloadcms/email-resend'
import { cloudinaryStorage } from 'payload-cloudinary'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'https://coastglobal.org',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- The Coast',
      description: 'Brand management hub for The Coast — content, clients, and projects in one place.',
      icons: [{ rel: 'icon', type: 'image/png', url: '/logolight.png' }],
    },
    components: {
      graphics: {
        Logo: '@/components/PayloadAdmin/CMSLogo#CMSLogo',
        Icon: '@/components/PayloadAdmin/CMSIcon#CMSIcon',
      },
    },
  },
  email: resendAdapter({
    defaultFromAddress: process.env.RESEND_FROM || 'dev@admin.coastglobal.org',
    defaultFromName: 'The Coast',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  collections: [
    Users,
    Media,
    Posts,
    Gallery,
    Clients,
    Projects,
    ProjectFiles,
    ProjectUpdates,
    Requests,
    IntakeSubmissions,
    EventIntakeSubmissions,
    ContactSubmissions,
    ToolSubmissions,
  ],
  globals: [PrivacyPolicy, TermsOfService, FAQGlobal, TrustedBy, GallerySettings],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
      EXPERIMENTAL_TableFeature(),
      TextStateFeature({
        state: {
          color: {
            ...defaultColors.background,
            ...defaultColors.text,
          },
        },
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    // Dev syncs schema via push. On Vercel, migrations are the source of truth
    // (applied at build by `payload migrate`), so push stays off there - which
    // also avoids re-recording dev-push markers. VERCEL is set by the platform.
    push: process.env.VERCEL ? false : process.env.NODE_ENV !== 'production',
    client: {
      url: process.env.DATABASE_URL || '',
      authToken: process.env.DATABASE_AUTH_TOKEN || '',
    },
  }),
  sharp,
  plugins: [
    cloudinaryStorage({
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
        api_key: process.env.CLOUDINARY_API_KEY || '',
        api_secret: process.env.CLOUDINARY_API_SECRET || '',
      },
      collections: { media: true },
      folder: 'payload-media',
      disableLocalStorage: true,
    }),
  ],
})
