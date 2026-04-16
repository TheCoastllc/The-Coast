import { CBI_MAX_SCORE, questions } from '@/components/cbi/data/questions'
import { getWave, WAVE_SCALE } from '@/components/cbi/data/waves'
import {
  contactBlock,
  ctaButton,
  emailShell,
  heading,
  infoBox,
  paragraph,
  sansFont,
  scoreBlock,
} from './base'

export type CbiPerson = {
  name: string
  email: string
  brand: string
  website: string
}

export type CbiAnswers = Record<string, number>

export function computeCbiScore(answers: CbiAnswers): number {
  return questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0)
}

/**
 * Horizontal row of wave marks for email. Uses the Unicode "∼" (TILDE OPERATOR)
 * in a styled table so active/inactive tinting survives Gmail, Outlook, Apple
 * Mail without SVG or external image hosting.
 */
export function waveRowHtml(opts: {
  count: number
  total?: number
  color: string
  size?: number
  align?: 'center' | 'left' | 'right'
}) {
  const { count, total = 5, color, size = 34, align = 'center' } = opts
  const cells = Array.from({ length: total }, (_, i) => {
    const active = i < count
    return `<td style="padding:0 6px; font-family: Georgia, 'Times New Roman', serif; font-size:${size}px; line-height:1; font-weight:300; color:${active ? color : '#2a2a2a'};">&#8764;</td>`
  }).join('')
  return `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="${align}" style="margin:0 auto 8px;">
  <tr>${cells}</tr>
</table>`
}

/** Wave rating scale block showing all 5 tiers with the user's tier highlighted. */
function waveScaleHtml(currentWave: string) {
  const rows = WAVE_SCALE.map((w) => {
    const isYou = w.name === currentWave
    const bg = isYou ? `${w.color}22` : 'transparent'
    const nameColor = isYou ? w.color : '#666666'
    const rangeColor = isYou ? w.color : '#444444'
    const dotColor = isYou ? w.color : '#333333'
    const dots = Array.from({ length: 5 }, (_, i) => {
      const active = i < w.w
      return `<span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${active ? dotColor : '#1a1a1a'}; margin:0 2px; vertical-align:middle;"></span>`
    }).join('')
    return `<tr>
      <td style="padding:10px 14px; background:${bg}; border-radius:${isYou ? '4px' : '0'};">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="width:100px;">${dots}</td>
            <td style="${sansFont} font-size:13px; font-weight:${isYou ? 700 : 500}; color:${nameColor};">${w.name}${isYou ? ' <span style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:' + w.color + ';margin-left:6px;">You</span>' : ''}</td>
            <td align="right" style="${sansFont} font-size:12px; color:${rangeColor};">${w.range}</td>
          </tr>
        </table>
      </td>
    </tr>`
  }).join('')
  return `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:12px 0 24px;">
  ${rows}
</table>`
}

export function buildCbiUserEmail(person: CbiPerson, score: number) {
  const wave = getWave(score)

  const body = [
    waveRowHtml({ count: wave.w, color: wave.color, size: 38 }),
    scoreBlock({ score, total: CBI_MAX_SCORE, color: wave.color, badge: wave.name }),
    heading(`${person.brand} — Wave Rating: ${wave.name}`),
    paragraph(wave.line),
    waveScaleHtml(wave.name),
    paragraph(
      'This was a quick score — the full Coast Brand Index evaluates 20 criteria on observable evidence, scored by our team and delivered within 48 hours.',
    ),
    infoBox({
      title: "What's in the full report",
      items: [
        '5 pillars × 4 criteria each = 20 scored signals',
        'Observable evidence per criterion (no self-reporting)',
        'Pillar-by-pillar scorecard with commentary',
        'Prioritized recommendations tied to your weakest pillars',
      ],
      color: wave.color,
    }),
    ctaButton('Get the Full Report'),
  ].join('')

  return {
    subject: `Your Coast Brand Index — ${score}/${CBI_MAX_SCORE} (${wave.name})`,
    html: emailShell({ title: 'Coast Brand Index', body }),
  }
}

export function buildCbiAdminEmail(
  person: CbiPerson,
  score: number,
  answers: CbiAnswers,
) {
  const wave = getWave(score)
  const rows = questions
    .map((q) => {
      const val = answers[q.id] ?? 0
      const opt = q.options.find((o) => o.val === val)
      return `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;color:#333;vertical-align:top;width:40%;">Pillar ${q.num}: ${q.pillar}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;color:#666;">${opt?.label ?? '—'} <strong>(${val}/4)</strong></td>
      </tr>`
    })
    .join('')

  return {
    subject: `CBI: ${person.brand} scored ${score}/${CBI_MAX_SCORE} (${wave.name})`,
    html: `
<h2>New Coast Brand Index Submission</h2>
${contactBlock({ name: person.name, email: person.email, company: person.brand })}
<p><strong>Website:</strong> <a href="${person.website}">${person.website}</a></p>
<p><strong>Score:</strong> ${score} / ${CBI_MAX_SCORE}</p>
<p><strong>Wave:</strong> <span style="color:${wave.color};font-weight:600;">${wave.name} (${wave.range})</span></p>
<hr/>
<h3>Pillar Breakdown</h3>
<table style="width:100%;border-collapse:collapse;">
  <thead><tr>
    <th style="text-align:left;padding:8px 12px;border-bottom:2px solid #ddd;font-size:12px;color:#999;text-transform:uppercase;">Pillar</th>
    <th style="text-align:left;padding:8px 12px;border-bottom:2px solid #ddd;font-size:12px;color:#999;text-transform:uppercase;">Response</th>
  </tr></thead>
  <tbody>${rows}</tbody>
</table>
<hr/>
<p style="color:#888;font-size:12px;">Submitted from Coast Brand Index on cbi.coastglobal.org</p>`,
  }
}
