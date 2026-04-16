import { contactBlock, ctaButton, emailShell, heading, infoBox, paragraph } from './base'

export type TestPerson = { name: string; email: string; company: string; role: string }

export function buildTestUserEmail() {
  const body = [
    heading('Thanks for completing the 3-Second Test'),
    paragraph(
      'You now know the five elements customers judge in the first three seconds. The question is: does your brand pass?',
    ),
    paragraph(
      "If you're not certain, that uncertainty is the answer. Our team can run a full brand audit and give you specific, actionable recommendations.",
    ),
    infoBox({
      title: 'The 5 Elements',
      items: [
        'Visual Hierarchy',
        'Colour Psychology',
        'Typography Confidence',
        'Spatial Clarity',
        'Instant Credibility',
      ],
    }),
    ctaButton('Get Your Free Brand Audit'),
  ].join('')

  return {
    subject: 'Your 3-Second Brand Test — What We Found',
    html: emailShell({ title: '3-Second Brand Test', body }),
  }
}

export function buildTestAdminEmail(person: TestPerson) {
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
