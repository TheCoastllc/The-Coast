/**
 * Quantified scarcity for /ai (Credence-style: specific numbers beat vague ones).
 * THE ONE PLACE to update capacity - the hero line and the final-CTA line both
 * render from these values. Update spotsRemaining as builds get booked, and
 * quarter/buildsPerQuarter at the start of each quarter.
 */
export const CAPACITY = {
  buildsPerQuarter: 4,
  spotsRemaining: 2,
  quarter: 'Q3',
} as const
