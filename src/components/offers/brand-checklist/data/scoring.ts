export type Band = 'high' | 'developing' | 'critical'

export type BandInfo = {
  label: string
  range: string
  description: string
  color: string
}

export const bands: Record<Band, BandInfo> = {
  high: {
    label: 'High Consistency',
    range: '36\u201350',
    description:
      'Your brand presents a unified, trustworthy image. Customers experience the same brand everywhere they encounter you.',
    color: '#28A77A',
  },
  developing: {
    label: 'Developing Consistency',
    range: '21\u201335',
    description:
      "You have recognisable strengths alongside real gaps. These inconsistencies are likely costing you trust and revenue \u2014 they're fixable with the right framework.",
    color: '#C9A24B',
  },
  critical: {
    label: 'Critical Gaps',
    range: '0\u201320',
    description:
      'Your brand is actively working against your marketing spend. Every month this continues, ground is lost to competitors with worse products and stronger brands.',
    color: '#D94F3D',
  },
}

export function getBand(score: number): Band {
  if (score >= 36) return 'high'
  if (score >= 21) return 'developing'
  return 'critical'
}
