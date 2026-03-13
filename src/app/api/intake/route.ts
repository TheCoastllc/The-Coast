import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { sendAdminNotification } from '@/lib/notifications'

export async function POST(request: Request) {
  const body = await request.json()
  const payload = await getPayload({ config: configPromise })

  const doc = await payload.create({
    collection: 'intake-submissions',
    data: {
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      businessName: body.businessName,
      website: body.website,
      businessDescription: body.businessDescription,
      idealCustomer: body.idealCustomer,
      servicesInterested: body.servicesInterested,
      brandVibes: body.brandVibes,
      colorPreferences: body.colorPreferences,
      colorsToAvoid: body.colorsToAvoid,
      brandsAdmired: body.brandsAdmired,
      budget: body.budget,
      timeline: body.timeline,
      additionalVision: body.additionalVision,
    },
    overrideAccess: true,
  })

  // Send notification email
  try {
    await sendAdminNotification(
      `New Brand Intake: ${body.fullName} - ${body.businessName}`,
      `<h2>New Brand Intake Submission</h2>
      <p><strong>Name:</strong> ${body.fullName}</p>
      <p><strong>Email:</strong> ${body.email}</p>
      <p><strong>Business:</strong> ${body.businessName}</p>
      <p><strong>Services:</strong> ${Array.isArray(body.servicesInterested) ? body.servicesInterested.join(', ') : ''}</p>
      <p><strong>Budget:</strong> ${body.budget || 'Not specified'}</p>
      <p><strong>Timeline:</strong> ${body.timeline || 'Not specified'}</p>`,
    )
  } catch (err) {
    return Response.json({ error: 'Failed to send intake notification' + err }, { status: 500 })
  }

  return Response.json(doc)
}
