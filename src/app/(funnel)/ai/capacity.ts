/**
 * Quantified scarcity for /ai (Credence-style: specific numbers beat vague ones).
 *
 * `month` is NOT stored here any more. It used to be a hardcoded string and sat
 * at "August" until late October - a scarcity line that is two months stale
 * reads as neglect, and claims availability for a month that already ended.
 * The page is a server component with `revalidate = 3600`, so the month is now
 * derived from the clock on each revalidation and passed down as a prop.
 *
 * `spotsRemaining` is real business data - update it as builds get booked.
 */
export const CAPACITY = {
  buildsPerMonth: 4,
  spotsRemaining: 2,
} as const

/** Current month name in the studio's own timezone (DFW), e.g. "October". */
export function currentMonth(): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    timeZone: 'America/Chicago',
  }).format(new Date())
}
