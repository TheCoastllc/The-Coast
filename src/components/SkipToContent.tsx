import Link from 'next/link'

/**
 * WCAG 2.2 SC 2.4.1 - Bypass Blocks.
 * Keyboard-only users land on this link first and can tab past the nav
 * straight into <main id="content" tabIndex={-1}>.
 *
 * Visually hidden until focused; then it surfaces as a top-left pill.
 */
export function SkipToContent() {
  return (
    <Link
      href="#content"
      className="absolute left-2 top-2 z-[100] -translate-y-32 rounded border border-primary/40 bg-black px-4 py-2 text-xs font-mono uppercase tracking-wider text-primary opacity-0 transition-all focus:translate-y-0 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary"
    >
      Skip to content
    </Link>
  )
}
