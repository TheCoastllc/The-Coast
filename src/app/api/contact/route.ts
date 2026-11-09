import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { sendAdminNotification } from '@/lib/notifications'
import { z } from 'zod'

/** Mirrors CONTACT_TOPICS in components/contact/ContactForm.tsx. Unknown
 *  values are kept verbatim so a future option never gets dropped. */
const TOPIC_LABELS: Record<string, string> = {
  brand: 'Brand identity',
  website: 'Website',
  marketing: 'Growth marketing',
  ai: 'AI & automation',
  other: 'Something else',
}

/** Submissions faster than this (ms from form mount to submit) are bots. */
const MIN_ELAPSED_MS = 3000

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().trim().email('Invalid email address').max(320),
  message: z.string().trim().min(1, 'Message is required').max(5000),
  company: z.string().trim().max(200).optional(),
  topic: z.string().trim().max(40).optional(),
  /** honeypot - the form hides this field, so any value means a bot */
  website: z.string().max(500).optional(),
  /** ms between the form mounting and submit */
  elapsed: z.number().int().nonnegative().optional(),
})

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c)

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

  const { name, email, message, company, topic, website, elapsed } = result.data

  // Bots get a quiet 200: nothing stored, nothing emailed, nothing to learn from.
  const isBot = (website && website.length > 0) || (typeof elapsed === 'number' && elapsed < MIN_ELAPSED_MS)
  if (isBot) return Response.json({ success: true })

  const topicLabel = topic ? (TOPIC_LABELS[topic] ?? topic) : undefined
  // The collection only has name/email/message; fold the optional context into
  // the stored message so no schema migration is needed.
  const context = [topicLabel && `Topic: ${topicLabel}`, company && `Company: ${company}`].filter(Boolean)
  const stored = context.length ? `${context.join('\n')}\n\n${message}` : message

  let id: string | number
  try {
    const payload = await getPayload({ config: configPromise })
    const doc = await payload.create({
      collection: 'contact-submissions',
      data: { name, email, message: stored },
      overrideAccess: true,
    })
    id = doc.id
  } catch (err) {
    console.error('Failed to store contact submission:', err)
    return Response.json({ error: 'Could not save your message' }, { status: 500 })
  }

  try {
    await sendAdminNotification(
      `New inquiry${topicLabel ? ` - ${topicLabel}` : ''}: ${name}`,
      `<h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${esc(name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${esc(email)}">${esc(email)}</a></p>
      ${company ? `<p><strong>Company:</strong> ${esc(company)}</p>` : ''}
      ${topicLabel ? `<p><strong>Topic:</strong> ${esc(topicLabel)}</p>` : ''}
      <hr/>
      <p><strong>Message:</strong></p>
      <p>${esc(message).replace(/\n/g, '<br/>')}</p>
      <hr/>
      <p style="color:#888;font-size:12px;">Submitted from coastglobal.org/contact</p>`,
    )
  } catch (err) {
    console.error('Failed to send contact notification:', err)
  }

  return Response.json({ success: true, id })
}
