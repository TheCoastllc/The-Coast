/**
 * Capacity line for /ai.
 *
 * The per-month "N spots remaining" countdown was REMOVED (David, Oct 2026).
 * It was a hand-maintained number next to a hand-maintained month, and it sat
 * at "2 spots remaining for August" into late October - a scarcity claim that
 * goes stale reads as neglect and advertises availability for a month that
 * already ended. What is left is a standing capacity statement that is true
 * without anyone remembering to update it.
 *
 * Do not reintroduce a live countdown unless it is driven by real booking data.
 */
export const CAPACITY = {
  buildsPerMonth: 4,
} as const
