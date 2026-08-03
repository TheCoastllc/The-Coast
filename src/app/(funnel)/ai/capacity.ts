/**
 * Quantified scarcity for /ai (Credence-style: specific numbers beat vague ones).
 * THE ONE PLACE to update capacity - the hero line and the final-CTA line both
 * render from these values. Update spotsRemaining as builds get booked, and
 * month at the start of each month.
 */
export const CAPACITY = {
  buildsPerMonth: 4,
  spotsRemaining: 2,
  month: 'August',
} as const
