import { bands, type Band } from '@/components/offers/brand-checklist/data/scoring'
import { contactBlock, ctaButton, emailShell, paragraph, scoreBlock } from './base'

export type ChecklistPerson = { name: string; email: string; company: string; role: string }
export type ChecklistCounts = { yes: number; part: number; no: number }

export function buildChecklistUserEmail(score: number, band: Band, counts: ChecklistCounts) {
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

export function buildChecklistAdminEmail(
  person: ChecklistPerson,
  score: number,
  band: Band,
  counts: ChecklistCounts,
) {
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
