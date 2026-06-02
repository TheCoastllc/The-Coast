import type { Metadata } from 'next'

// Intake is a private, prefill-driven form flow — kept out of search indexes.
// The ocean chrome (SeaBackdrop, Nav, Footer, body.ocean tokens) is supplied by
// the (frontend) root layout; this route renders its focused form inside it
// using ocean tokens (see intake.module.css), so children pass straight through.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function IntakeLayout({ children }: { children: React.ReactNode }) {
  return children
}
