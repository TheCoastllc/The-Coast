import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { sendAdminNotification } from '@/lib/notifications'
import { emailShell, scoreBlock, heading, paragraph, infoBox, ctaButton } from '@/lib/email-template'
import { z } from 'zod'
import { questions } from '@/components/offers/brand-quiz/data/questions'
import { getTier, resultTiers } from '@/components/offers/brand-quiz/data/results'
import { bands, getBand } from '@/components/offers/brand-checklist/data/scoring'

const TOOL_IDS = ['brand-quiz', 'brand-checklist', '3-second-test'] as const
type ToolId = (typeof TOOL_IDS)[number]

const toolSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email address'),
  company: z.string().max(200).optional().default(''),
  role: z.string().max(200).optional().default(''),
  tool: z.enum(TOOL_IDS),
  answers: z.unknown().optional(),
})

type PersonInfo = { name: string; email: string; company: string; role: string }

// ─── Quiz helpers ───

function computeQuizScore(answers: (number | null)[]): number {
  return answers.reduce<number>((sum, ansIdx, qIdx) => {
    if (ansIdx === null) return sum
    return sum + questions[qIdx].answers[ansIdx].points
  }, 0)
}

function buildQuizUserEmail(score: number, tier: ReturnType<typeof getTier>) {
  const result = resultTiers[tier]
  const body = [
    scoreBlock({ score, total: 30, color: result.color, badge: result.badge }),
    heading(result.headline),
    ...result.body.map((p) => paragraph(p)),
    infoBox({
      title: tier === 'established' ? "What's next for your brand" : "What's typically causing this",
      items: result.causes,
      color: result.color,
    }),
    ctaButton(result.cta),
  ].join('')

  return {
    subject: `Your Brand Quiz Results — ${score}/30`,
    html: emailShell({ title: 'Brand Quiz Results', body }),
  }
}

function contactBlock(person: PersonInfo) {
  return `
<p><strong>Name:</strong> ${person.name}</p>
<p><strong>Email:</strong> <a href="mailto:${person.email}">${person.email}</a></p>
${person.company ? `<p><strong>Company:</strong> ${person.company}</p>` : ''}
${person.role ? `<p><strong>Role:</strong> ${person.role}</p>` : ''}`
}

function buildQuizAdminEmail(person: PersonInfo, score: number, tier: ReturnType<typeof getTier>, answers: (number | null)[]) {
  const result = resultTiers[tier]
  const rows = questions
    .map((q, i) => {
      const ansIdx = answers[i]
      const answer = ansIdx !== null ? q.answers[ansIdx] : null
      return `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;color:#333;vertical-align:top;width:60%;">${q.text}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;color:#666;">${answer ? `${answer.letter}. ${answer.text} (${answer.points}pts)` : 'Skipped'}</td>
      </tr>`
    })
    .join('')

  return {
    subject: `Brand Quiz: ${person.name} scored ${score}/30 (${tier})`,
    html: `
<h2>New Brand Quiz Submission</h2>
${contactBlock(person)}
<p><strong>Score:</strong> ${score} / 30</p>
<p><strong>Result:</strong> <span style="color:${result.color};font-weight:600;">${result.badge}</span></p>
<hr/>
<h3>Answer Breakdown</h3>
<table style="width:100%;border-collapse:collapse;">
  <thead><tr>
    <th style="text-align:left;padding:8px 12px;border-bottom:2px solid #ddd;font-size:12px;color:#999;text-transform:uppercase;">Question</th>
    <th style="text-align:left;padding:8px 12px;border-bottom:2px solid #ddd;font-size:12px;color:#999;text-transform:uppercase;">Answer</th>
  </tr></thead>
  <tbody>${rows}</tbody>
</table>
<hr/>
<p style="color:#888;font-size:12px;">Submitted from Brand Quiz on offers.coastglobal.org</p>`,
  }
}

// ─── Checklist helpers ───

function buildChecklistUserEmail(score: number, band: ReturnType<typeof getBand>, counts: { yes: number; part: number; no: number }) {
  const info = bands[band]
  const body = [
    scoreBlock({ score, total: 50, color: info.color, badge: info.label }),
    `<div style="text-align:center;padding:24px 0;">
      <span style="color:#28A77A;font-weight:600;margin:0 12px;">${counts.yes} Yes</span>
      <span style="color:#C9A24B;font-weight:600;margin:0 12px;">${counts.part} Partial</span>
      <span style="color:#D94F3D;font-weight:600;margin:0 12px;">${counts.no} No</span>
    </div>`,
    paragraph(info.description),
    ctaButton('Get Your Free Brand Audit'),
  ].join('')

  return {
    subject: `Your Brand Checklist Score — ${score}/50`,
    html: emailShell({ title: 'Brand Checklist Results', body }),
  }
}

function buildChecklistAdminEmail(person: PersonInfo, score: number, band: ReturnType<typeof getBand>, counts: { yes: number; part: number; no: number }) {
  const info = bands[band]
  return {
    subject: `Brand Checklist: ${person.name} scored ${score}/50 (${info.label})`,
    html: `
<h2>New Brand Checklist Submission</h2>
${contactBlock(person)}
<p><strong>Score:</strong> ${score} / 50</p>
<p><strong>Band:</strong> <span style="color:${info.color};font-weight:600;">${info.label} (${info.range})</span></p>
<p><strong>Breakdown:</strong> ${counts.yes} Yes, ${counts.part} Partial, ${counts.no} No</p>
<hr/>
<p style="color:#888;font-size:12px;">Submitted from Brand Checklist on offers.coastglobal.org</p>`,
  }
}

// ─── 3-Second Test helpers ───

function buildTestUserEmail() {
  const body = [
    heading('Thanks for completing the 3-Second Test'),
    paragraph("You now know the five elements customers judge in the first three seconds. The question is: does your brand pass?"),
    paragraph("If you're not certain, that uncertainty is the answer. Our team can run a full brand audit and give you specific, actionable recommendations."),
    infoBox({
      title: 'The 5 Elements',
      items: ['Visual Hierarchy', 'Colour Psychology', 'Typography Confidence', 'Spatial Clarity', 'Instant Credibility'],
    }),
    ctaButton('Get Your Free Brand Audit'),
  ].join('')

  return {
    subject: 'Your 3-Second Brand Test — What We Found',
    html: emailShell({ title: '3-Second Brand Test', body }),
  }
}

function buildTestAdminEmail(person: PersonInfo) {
  return {
    subject: `3-Second Test: ${person.name} completed the test`,
    html: `
<h2>New 3-Second Test Submission</h2>
${contactBlock(person)}
<p>User completed the 3-Second Brand Test and submitted their email for follow-up.</p>
<hr/>
<p style="color:#888;font-size:12px;">Submitted from 3-Second Test on offers.coastglobal.org</p>`,
  }
}

// ─── Route handler ───

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

  const { name, email, company, role, tool, answers } = parsed.data
  const payload = await getPayload({ config: configPromise })
  const person: PersonInfo = { name, email, company: company ?? '', role: role ?? '' }

  let score: number | undefined
  let resultTier: string | undefined
  let adminEmail: { subject: string; html: string }
  let userEmail: { subject: string; html: string }

  switch (tool) {
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
  }

  // Store in database
  await payload.create({
    collection: 'tool-submissions',
    data: { name, email, company, role, tool, score, resultTier, answers: (answers ?? null) as Record<string, unknown> | null },
    overrideAccess: true,
  })

  // Send admin notification
  try {
    await sendAdminNotification(adminEmail!.subject, adminEmail!.html)
  } catch (err) {
    console.error(`Failed to send admin notification for ${tool}:`, err)
  }

  // Send user email
  try {
    await payload.sendEmail({ to: email, subject: userEmail!.subject, html: userEmail!.html })
  } catch (err) {
    console.error(`Failed to send user email for ${tool}:`, err)
  }

  return Response.json({ success: true, tool, score, resultTier })
}
