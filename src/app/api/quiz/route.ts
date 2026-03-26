import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { sendAdminNotification } from '@/lib/notifications'
import { z } from 'zod'
import { questions } from '@/components/offers/brand-quiz/data/questions'
import { getTier, resultTiers } from '@/components/offers/brand-quiz/data/results'

const quizSchema = z.object({
  email: z.string().email('Invalid email address'),
  answers: z.array(z.number().int().min(0).max(3).nullable()).length(10),
})

function buildUserEmailHtml(score: number, tier: ReturnType<typeof getTier>) {
  const result = resultTiers[tier]

  const answersBreakdown = questions
    .map((q, i) => `<li style="margin-bottom:4px;color:#999;font-size:13px;">${q.text}</li>`)
    .join('')

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#0D1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <img src="https://coastglobal.org/logo.png" alt="The Coast" width="40" height="40" style="opacity:0.8;" />
      <p style="color:#C9A24B;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin-top:12px;">Brand Quiz Results</p>
    </div>

    <!-- Score -->
    <div style="text-align:center;padding:32px 0;border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);">
      <span style="font-size:48px;font-weight:700;color:${result.color};">${score}</span>
      <span style="font-size:24px;font-weight:300;color:rgba(255,255,255,0.3);"> / 30</span>
      <div style="margin-top:12px;">
        <span style="display:inline-block;background:${result.color}20;color:${result.color};font-size:10px;letter-spacing:2px;text-transform:uppercase;padding:4px 12px;border-radius:2px;">${result.badge}</span>
      </div>
    </div>

    <!-- Headline -->
    <h2 style="color:#ffffff;font-size:22px;font-weight:600;text-align:center;margin:28px 0 16px;line-height:1.3;">
      ${result.headline}
    </h2>

    <!-- Body -->
    ${result.body.map((p) => `<p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.7;margin:0 0 12px;">${p}</p>`).join('')}

    <!-- What's causing this -->
    <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);padding:24px;margin:24px 0;">
      <h3 style="color:#ffffff;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">
        ${tier === 'established' ? "What's next for your brand" : "What's typically causing this"}
      </h3>
      <ul style="list-style:none;padding:0;margin:0;">
        ${result.causes.map((c) => `<li style="color:rgba(255,255,255,0.5);font-size:13px;line-height:1.6;padding:4px 0 4px 16px;position:relative;"><span style="position:absolute;left:0;top:11px;width:6px;height:6px;border-radius:50%;background:${result.color};"></span>${c}</li>`).join('')}
      </ul>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin:32px 0;">
      <a href="https://coastglobal.org/get-started" style="display:inline-block;background:#C9A24B;color:#0D1117;font-size:13px;font-weight:600;letter-spacing:0.5px;padding:14px 28px;text-decoration:none;border-radius:2px;">
        ${result.cta} &rarr;
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding-top:32px;border-top:1px solid rgba(255,255,255,0.06);">
      <p style="color:rgba(255,255,255,0.15);font-size:11px;letter-spacing:2px;text-transform:uppercase;">The Coast</p>
      <p style="color:rgba(255,255,255,0.15);font-size:11px;margin-top:8px;">
        <a href="https://coastglobal.org" style="color:rgba(255,255,255,0.25);text-decoration:none;">coastglobal.org</a>
      </p>
    </div>
  </div>
</body>
</html>`
}

function buildAdminEmailHtml(
  email: string,
  score: number,
  tier: ReturnType<typeof getTier>,
  answers: (number | null)[],
) {
  const result = resultTiers[tier]

  const answersRows = questions
    .map((q, i) => {
      const answerIdx = answers[i]
      const answer = answerIdx !== null ? q.answers[answerIdx] : null
      return `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;color:#333;vertical-align:top;width:60%;">${q.text}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;color:#666;">${answer ? `${answer.letter}. ${answer.text} (${answer.points}pts)` : 'Skipped'}</td>
      </tr>`
    })
    .join('')

  return `
<h2>New Brand Quiz Submission</h2>
<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
<p><strong>Score:</strong> ${score} / 30</p>
<p><strong>Result:</strong> <span style="color:${result.color};font-weight:600;">${result.badge}</span></p>
<hr/>
<h3>Answer Breakdown</h3>
<table style="width:100%;border-collapse:collapse;">
  <thead>
    <tr>
      <th style="text-align:left;padding:8px 12px;border-bottom:2px solid #ddd;font-size:12px;color:#999;text-transform:uppercase;">Question</th>
      <th style="text-align:left;padding:8px 12px;border-bottom:2px solid #ddd;font-size:12px;color:#999;text-transform:uppercase;">Answer</th>
    </tr>
  </thead>
  <tbody>${answersRows}</tbody>
</table>
<hr/>
<p style="color:#888;font-size:12px;">Submitted from Brand Quiz on offers.coastglobal.org</p>`
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = quizSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const { email, answers } = parsed.data
  const score = answers.reduce<number>((sum, ansIdx, qIdx) => {
    if (ansIdx === null) return sum
    return sum + questions[qIdx].answers[ansIdx].points
  }, 0)
  const tier = getTier(score)

  const payload = await getPayload({ config: configPromise })

  // Store in database
  await payload.create({
    collection: 'quiz-submissions',
    data: { email, score, resultTier: tier, answers },
    overrideAccess: true,
  })

  // Send admin notification
  try {
    await sendAdminNotification(
      `Brand Quiz: ${email} scored ${score}/30 (${tier})`,
      buildAdminEmailHtml(email, score, tier, answers),
    )
  } catch (err) {
    console.error('Failed to send admin quiz notification:', err)
  }

  // Send user their results
  try {
    await payload.sendEmail({
      to: email,
      subject: `Your Brand Quiz Results — ${score}/30`,
      html: buildUserEmailHtml(score, tier),
    })
  } catch (err) {
    console.error('Failed to send user quiz results email:', err)
  }

  return Response.json({ success: true, score, tier })
}
