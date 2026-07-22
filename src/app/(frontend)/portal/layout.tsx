import type { Metadata } from 'next'

// The client portal is login-gated and must never be indexed - this server
// layout covers every /portal route, (protected) and (public) alike, matching
// the noindex posture of /login, /intake, and the checkout-result pages.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function PortalRootLayout({ children }: { children: React.ReactNode }) {
  return children
}
