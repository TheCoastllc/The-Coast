import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { sendAdminNotification } from '@/lib/notifications'
import { z } from 'zod'
import { questions } from '@/components/offers/brand-quiz/data/questions'
import { getTier, resultTiers } from '@/components/offers/brand-quiz/data/results'
import { bands, getBand } from '@/components/offers/brand-checklist/data/scoring'

const TOOL_IDS = ['brand-quiz', 'brand-checklist', '3-second-test'] as const
type ToolId = (typeof TOOL_IDS)[number]

const toolSchema = z.object({
  email: z.string().email('Invalid email address'),
  tool: z.enum(TOOL_IDS),
  answers: z.unknown().optional(),
})

const TOOL_LABELS: Record<ToolId, string> = {
  'brand-quiz': 'Brand Quiz',
  'brand-checklist': 'Brand Consistency Checklist',
  '3-second-test': 'The 3-Second Test',
}

// ─── Quiz helpers ───

function computeQuizScore(answers: (number | null)[]): number {
  return answers.reduce<number>((sum, ansIdx, qIdx) => {
    if (ansIdx === null) return sum
    return sum + questions[qIdx].answers[ansIdx].points
  }, 0)
}

function buildQuizUserEmail(score: number, tier: ReturnType<typeof getTier>) {
  const result = resultTiers[tier]
  return {
    subject: `Your Brand Quiz Results — ${score}/30`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#0D1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <img src="https://coastglobal.org/logo.png" alt="The Coast" width="40" height="40" style="opacity:0.8;" />
      <p style="color:#C9A24B;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin-top:12px;">Brand Quiz Results</p>
    </div>
    <div style="text-align:center;padding:32px 0;border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);">
      <span style="font-size:48px;font-weight:700;color:${result.color};">${score}</span>
      <span style="font-size:24px;font-weight:300;color:rgba(255,255,255,0.3);"> / 30</span>
      <div style="margin-top:12px;">
        <span style="display:inline-block;background:${result.color}20;color:${result.color};font-size:10px;letter-spacing:2px;text-transform:uppercase;padding:4px 12px;border-radius:2px;">${result.badge}</span>
      </div>
    </div>
    <h2 style="color:#ffffff;font-size:22px;font-weight:600;text-align:center;margin:28px 0 16px;line-height:1.3;">${result.headline}</h2>
    ${result.body.map((p) => `<p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.7;margin:0 0 12px;">${p}</p>`).join('')}
    <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);padding:24px;margin:24px 0;">
      <h3 style="color:#ffffff;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">
        ${tier === 'established' ? "What's next for your brand" : "What's typically causing this"}
      </h3>
      <ul style="list-style:none;padding:0;margin:0;">
        ${result.causes.map((c) => `<li style="color:rgba(255,255,255,0.5);font-size:13px;line-height:1.6;padding:4px 0 4px 16px;position:relative;"><span style="position:absolute;left:0;top:11px;width:6px;height:6px;border-radius:50%;background:${result.color};"></span>${c}</li>`).join('')}
      </ul>
    </div>
    <div style="text-align:center;margin:32px 0;">
      <a href="https://coastglobal.org/get-started" style="display:inline-block;background:#C9A24B;color:#0D1117;font-size:13px;font-weight:600;letter-spacing:0.5px;padding:14px 28px;text-decoration:none;border-radius:2px;">${result.cta} &rarr;</a>
    </div>
    ${emailFooter()}
  </div>
</body>
</html>`,
  }
}

function buildQuizAdminEmail(email: string, score: number, tier: ReturnType<typeof getTier>, answers: (number | null)[]) {
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
    subject: `Brand Quiz: ${email} scored ${score}/30 (${tier})`,
    html: `
<h2>New Brand Quiz Submission</h2>
<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
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
  return {
    subject: `Your Brand Checklist Score — ${score}/50`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#0D1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <img src="https://coastglobal.org/logo.png" alt="The Coast" width="40" height="40" style="opacity:0.8;" />
      <p style="color:#C9A24B;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin-top:12px;">Brand Checklist Results</p>
    </div>
    <div style="text-align:center;padding:32px 0;border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);">
      <span style="font-size:48px;font-weight:700;color:${info.color};">${score}</span>
      <span style="font-size:24px;font-weight:300;color:rgba(255,255,255,0.3);"> / 50</span>
      <div style="margin-top:12px;">
        <span style="display:inline-block;background:${info.color}20;color:${info.color};font-size:10px;letter-spacing:2px;text-transform:uppercase;padding:4px 12px;border-radius:2px;">${info.label}</span>
      </div>
    </div>
    <div style="text-align:center;padding:24px 0;">
      <span style="color:#28A77A;font-weight:600;margin:0 12px;">${counts.yes} Yes</span>
      <span style="color:#C9A24B;font-weight:600;margin:0 12px;">${counts.part} Partial</span>
      <span style="color:#D94F3D;font-weight:600;margin:0 12px;">${counts.no} No</span>
    </div>
    <p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.7;margin:0 0 12px;">${info.description}</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="https://coastglobal.org/get-started" style="display:inline-block;background:#C9A24B;color:#0D1117;font-size:13px;font-weight:600;letter-spacing:0.5px;padding:14px 28px;text-decoration:none;border-radius:2px;">Get Your Free Brand Audit &rarr;</a>
    </div>
    ${emailFooter()}
  </div>
</body>
</html>`,
  }
}

function buildChecklistAdminEmail(email: string, score: number, band: ReturnType<typeof getBand>, counts: { yes: number; part: number; no: number }) {
  const info = bands[band]
  return {
    subject: `Brand Checklist: ${email} scored ${score}/50 (${info.label})`,
    html: `
<h2>New Brand Checklist Submission</h2>
<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
<p><strong>Score:</strong> ${score} / 50</p>
<p><strong>Band:</strong> <span style="color:${info.color};font-weight:600;">${info.label} (${info.range})</span></p>
<p><strong>Breakdown:</strong> ${counts.yes} Yes, ${counts.part} Partial, ${counts.no} No</p>
<hr/>
<p style="color:#888;font-size:12px;">Submitted from Brand Checklist on offers.coastglobal.org</p>`,
  }
}

// ─── 3-Second Test helpers ───

function buildTestUserEmail() {
  return {
    subject: 'Your 3-Second Brand Test — What We Found',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#0D1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <img src="https://coastglobal.org/logo.png" alt="The Coast" width="40" height="40" style="opacity:0.8;" />
      <p style="color:#C9A24B;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin-top:12px;">3-Second Brand Test</p>
    </div>
    <h2 style="color:#ffffff;font-size:22px;font-weight:600;text-align:center;margin:28px 0 16px;line-height:1.3;">
      Thanks for completing the 3-Second Test
    </h2>
    <p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.7;margin:0 0 12px;">
      You now know the five elements customers judge in the first three seconds. The question is: does your brand pass?
    </p>
    <p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.7;margin:0 0 12px;">
      If you're not certain, that uncertainty is the answer. Our team can run a full brand audit and give you specific, actionable recommendations.
    </p>
    <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);padding:24px;margin:24px 0;">
      <h3 style="color:#ffffff;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">The 5 Elements</h3>
      <ol style="padding-left:20px;margin:0;">
        <li style="color:rgba(255,255,255,0.5);font-size:13px;line-height:1.8;">Visual Hierarchy</li>
        <li style="color:rgba(255,255,255,0.5);font-size:13px;line-height:1.8;">Colour Psychology</li>
        <li style="color:rgba(255,255,255,0.5);font-size:13px;line-height:1.8;">Typography Confidence</li>
        <li style="color:rgba(255,255,255,0.5);font-size:13px;line-height:1.8;">Spatial Clarity</li>
        <li style="color:rgba(255,255,255,0.5);font-size:13px;line-height:1.8;">Instant Credibility</li>
      </ol>
    </div>
    <div style="text-align:center;margin:32px 0;">
      <a href="https://coastglobal.org/get-started" style="display:inline-block;background:#C9A24B;color:#0D1117;font-size:13px;font-weight:600;letter-spacing:0.5px;padding:14px 28px;text-decoration:none;border-radius:2px;">Get Your Free Brand Audit &rarr;</a>
    </div>
    ${emailFooter()}
  </div>
</body>
</html>`,
  }
}

function buildTestAdminEmail(email: string) {
  return {
    subject: `3-Second Test: ${email} completed the test`,
    html: `
<h2>New 3-Second Test Submission</h2>
<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
<p>User completed the 3-Second Brand Test and submitted their email for follow-up.</p>
<hr/>
<p style="color:#888;font-size:12px;">Submitted from 3-Second Test on offers.coastglobal.org</p>`,
  }
}

// ─── Shared ───

function emailFooter() {
  return `
    <div style="text-align:center;padding-top:32px;border-top:1px solid rgba(255,255,255,0.06);">
      <p style="color:rgba(255,255,255,0.15);font-size:11px;letter-spacing:2px;text-transform:uppercase;">The Coast</p>
      <p style="color:rgba(255,255,255,0.15);font-size:11px;margin-top:8px;">
        <a href="https://coastglobal.org" style="color:rgba(255,255,255,0.25);text-decoration:none;">coastglobal.org</a>
      </p>
    </div>`
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

  const { email, tool, answers } = parsed.data
  const payload = await getPayload({ config: configPromise })

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
      adminEmail = buildQuizAdminEmail(email, score, tier, quizAnswers)
      userEmail = buildQuizUserEmail(score, tier)
      break
    }

    case 'brand-checklist': {
      const data = answers as { score: number; band: string; yes: number; part: number; no: number }
      score = data.score
      const band = getBand(score)
      resultTier = band
      const counts = { yes: data.yes, part: data.part, no: data.no }
      adminEmail = buildChecklistAdminEmail(email, score, band, counts)
      userEmail = buildChecklistUserEmail(score, band, counts)
      break
    }

    case '3-second-test': {
      resultTier = 'completed'
      adminEmail = buildTestAdminEmail(email)
      userEmail = buildTestUserEmail()
      break
    }
  }

  // Store in database
  await payload.create({
    collection: 'tool-submissions',
    data: { email, tool, score, resultTier, answers: (answers ?? null) as Record<string, unknown> | null },
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
