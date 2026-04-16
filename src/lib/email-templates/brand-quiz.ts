import { questions } from '@/components/offers/brand-quiz/data/questions'
import { resultTiers, type ResultTier } from '@/components/offers/brand-quiz/data/results'
import {
  contactBlock,
  ctaButton,
  emailShell,
  heading,
  infoBox,
  paragraph,
  scoreBlock,
} from './base'

export type QuizPerson = { name: string; email: string; company: string; role: string }

export function computeQuizScore(answers: (number | null)[]): number {
  return answers.reduce<number>((sum, ansIdx, qIdx) => {
    if (ansIdx === null) return sum
    return sum + questions[qIdx].answers[ansIdx].points
  }, 0)
}

export function buildQuizUserEmail(score: number, tier: ResultTier) {
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

export function buildQuizAdminEmail(
  person: QuizPerson,
  score: number,
  tier: ResultTier,
  answers: (number | null)[],
) {
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
