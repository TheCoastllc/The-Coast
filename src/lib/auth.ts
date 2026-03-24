import { betterAuth } from 'better-auth'
import { LibsqlDialect } from '@libsql/kysely-libsql'

const dialect = new LibsqlDialect({
  url: process.env.DATABASE_URL || '',
  authToken: process.env.DATABASE_AUTH_TOKEN || '',
})

export const auth = betterAuth({
  database: {
    dialect,
    type: 'sqlite',
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAfter: 60 * 60 * 24, // refresh after 1 day
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL || 'http://localhost:3000'],
})
