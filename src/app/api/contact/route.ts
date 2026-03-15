import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { sendAdminNotification } from '@/lib/notifications'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required').max(5000),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const result = contactSchema.safeParse(body)
  if (!result.success) {
    return Response.json(
      { error: 'Validation failed', details: result.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const { name, email, message } = result.data

  const payload = await getPayload({ config: configPromise })

  const doc = await payload.create({
    collection: 'contact-submissions',
    data: { name, email, message },
    overrideAccess: true,
  })

  try {
    await sendAdminNotification(
      `New Contact Form Submission from ${name}`,
      `<h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <hr/>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br/>')}</p>
      <hr/>
      <p style="color:#888;font-size:12px;">Submitted from the Contact Us form on coastglobal.org</p>`,
    )
  } catch (err) {
    console.error('Failed to send contact notification:', err)
  }

  return Response.json({ success: true, id: doc.id })
}
