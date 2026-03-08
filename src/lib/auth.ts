import { betterAuth } from 'better-auth'

export const auth = betterAuth({
  database: {
    type: 'sqlite',
    url: process.env.DATABASE_URL || '',
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
