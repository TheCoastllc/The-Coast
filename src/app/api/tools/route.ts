import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { sendAdminNotification } from '@/lib/notifications'
import {
  buildChecklistAdminEmail,
  buildChecklistUserEmail,
  buildQuizAdminEmail,
  buildQuizUserEmail,
  buildTestAdminEmail,
  buildTestUserEmail,
  buildCbiAdminEmail,
  buildCbiUserEmail,
  computeCbiScore,
  computeQuizScore,
  type CbiAnswers,
} from '@/lib/email-templates'
import { z } from 'zod'
import { getTier } from '@/components/offers/brand-quiz/data/results'
import { getBand } from '@/components/offers/brand-checklist/data/scoring'
import { getWave } from '@/components/cbi/data/waves'

const TOOL_IDS = ['brand-quiz', 'brand-checklist', '3-second-test', 'cbi'] as const
type ToolId = (typeof TOOL_IDS)[number]

const toolSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email address'),
  company: z.string().max(200).optional().default(''),
  role: z.string().max(200).optional().default(''),
  tool: z.enum(TOOL_IDS),
  answers: z.unknown().optional(),
  // CBI-specific — the prototype collects name/brand/website on a dedicated intake,
  // which we map into the generic person fields (company=brand, role=website).
  brand: z.string().max(200).optional(),
  website: z.string().max(500).optional(),
})

type EmailPayload = { subject: string; html: string }

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = toolSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const { name, email, company, role, tool, answers, brand, website } = parsed.data
  const payload = await getPayload({ config: configPromise })
  const person = { name, email, company: company ?? '', role: role ?? '' }

  let score: number | undefined
  let resultTier: string | undefined
  let adminEmail: EmailPayload
  let userEmail: EmailPayload
  let storedAnswers: unknown = answers ?? null
  let storedCompany = company
  let storedRole = role

  switch (tool as ToolId) {
    case 'brand-quiz': {
      const quizAnswers = answers as (number | null)[]
      score = computeQuizScore(quizAnswers)
      const tier = getTier(score)
      resultTier = tier
      adminEmail = buildQuizAdminEmail(person, score, tier, quizAnswers)
      userEmail = buildQuizUserEmail(score, tier)
      break
    }

    case 'brand-checklist': {
      const data = answers as { score: number; band: string; yes: number; part: number; no: number }
      score = data.score
      const band = getBand(score)
      resultTier = band
      const counts = { yes: data.yes, part: data.part, no: data.no }
      adminEmail = buildChecklistAdminEmail(person, score, band, counts)
      userEmail = buildChecklistUserEmail(score, band, counts)
      break
    }

    case '3-second-test': {
      resultTier = 'completed'
      adminEmail = buildTestAdminEmail(person)
      userEmail = buildTestUserEmail()
      break
    }

    case 'cbi': {
      const cbiAnswers = (answers ?? {}) as CbiAnswers
      score = computeCbiScore(cbiAnswers)
      const wave = getWave(score)
      resultTier = wave.name
      const cbiPerson = {
        name,
        email,
        brand: brand ?? company ?? '',
        website: website ?? '',
      }
      // Mirror CBI-specific fields into the generic submission columns
      storedCompany = cbiPerson.brand
      storedRole = cbiPerson.website
      storedAnswers = cbiAnswers
      adminEmail = buildCbiAdminEmail(cbiPerson, score, cbiAnswers)
      userEmail = buildCbiUserEmail(cbiPerson, score)
      break
    }
  }

  try {
    await payload.create({
      collection: 'tool-submissions',
      data: {
        name,
        email,
        company: storedCompany,
        role: storedRole,
        tool,
        score,
        resultTier,
        answers: storedAnswers as Record<string, unknown> | null,
      },
      overrideAccess: true,
    })
  } catch (err) {
    console.error(`Failed to save ${tool} submission:`, err)
  }

  try {
    await sendAdminNotification(adminEmail!.subject, adminEmail!.html)
  } catch (err) {
    console.error(`Failed to send admin notification for ${tool}:`, err)
  }

  try {
    await payload.sendEmail({ to: email, subject: userEmail!.subject, html: userEmail!.html })
  } catch (err) {
    console.error(`Failed to send user email for ${tool}:`, err)
  }

  return Response.json({ success: true, tool, score, resultTier })
}
