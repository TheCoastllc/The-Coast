import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { sendAdminNotification } from '@/lib/notifications'

export async function POST(request: Request) {
  const body = await request.json()
  const payload = await getPayload({ config: configPromise })

  const doc = await payload.create({
    collection: 'event-intake-submissions',
    data: {
      contactName: body.contactName,
      email: body.email,
      phone: body.phone,
      eventName: body.eventName,
      eventType: body.eventType,
      eventDate: body.eventDate,
      eventLocation: body.eventLocation,
      expectedAttendees: body.expectedAttendees,
      servicesNeeded: body.servicesNeeded,
      budget: body.budget,
      timeline: body.timeline,
      eventDescription: body.eventDescription,
      additionalNotes: body.additionalNotes,
    },
    overrideAccess: true,
  })

  // Send notification email
  try {
    await sendAdminNotification(
      `New Experience Intake: ${body.contactName} - ${body.eventName}`,
      `<h2>New Experience/Event Intake</h2>
      <p><strong>Contact:</strong> ${body.contactName}</p>
      <p><strong>Email:</strong> ${body.email}</p>
      <p><strong>Event:</strong> ${body.eventName}</p>
      <p><strong>Type:</strong> ${body.eventType || 'Not specified'}</p>
      <p><strong>Date:</strong> ${body.eventDate || 'Not specified'}</p>
      <p><strong>Location:</strong> ${body.eventLocation || 'Not specified'}</p>`,
    )
  } catch (err) {
    console.error('Failed to send experience intake notification:', err)
  }

  return Response.json(doc)
}
