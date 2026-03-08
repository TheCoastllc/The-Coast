import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function sendAdminNotification(subject: string, html: string) {
  const payload = await getPayload({ config: configPromise })
  await payload.sendEmail({
    to: process.env.ADMIN_EMAIL || 'dev@admin.coastglobal.org',
    subject,
    html,
  })
}
