import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SUBDOMAIN_MAP: Record<string, string> = {
  cbi: '/cbi',
  offers: '/offers-tools',
}

const PAYLOAD_COOKIE = 'payload-token'

// Payload's own auth sub-routes must remain open for the forgot/reset flow
// /admin/login is intentionally excluded — Payload redirects here after logout,
// and the middleware should intercept it and send to our custom /login page instead.
const ADMIN_PUBLIC_PATHS = ['/admin/forgot', '/admin/reset', '/admin/create-first-user']

const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
}

export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const { pathname } = request.nextUrl

  const subdomain = Object.keys(SUBDOMAIN_MAP).find(
    (sub) =>
      hostname.includes(`${sub}.coastglobal.org`) ||
      hostname.startsWith(`${sub}.localhost`),
  )

  if (subdomain) {
    const basePath = SUBDOMAIN_MAP[subdomain]

    if (pathname.startsWith(basePath)) {
      return NextResponse.next()
    }

    return NextResponse.rewrite(new URL(`${basePath}${pathname}`, request.url))
  }

  // Guard the Payload admin panel — redirect unauthenticated requests to /login
  if (pathname.startsWith('/admin')) {
    const isPublicAdminPath = ADMIN_PUBLIC_PATHS.some((p) => pathname.startsWith(p))
    if (!isPublicAdminPath) {
      const token = request.cookies.get(PAYLOAD_COOKIE)
      if (!token) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }
    }
    // Authenticated (or public auth sub-route) — add security headers
    const response = NextResponse.next()
    Object.entries(SECURITY_HEADERS).forEach(([k, v]) => response.headers.set(k, v))
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)'],
}
