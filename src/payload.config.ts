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
import { PrivacyPolicy } from './globals/PrivacyPolicy'
import { TermsOfService } from './globals/TermsOfService'
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
    defaultFromAddress: 'dev@admin.coastglobal.org',
    defaultFromName: 'The Coast',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  collections: [
    Users,
    Media,
    Posts,
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
  globals: [PrivacyPolicy, TermsOfService, FAQGlobal, TrustedBy],
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
    push: true,
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
