import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { STUDIO_COOKIE_NAME, verifyToken } from '@/lib/studio-auth'

const SUBDOMAIN_MAP: Record<string, string> = {
  cbi: '/cbi',
  offers: '/offers-tools',
  gallery: '/gallery',
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

export async function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const { pathname } = request.nextUrl

  // ── /studio gate ───────────────────────────────────────────────────────
  // Internal download hub for the team. Anything under /studio requires a
  // signed cookie; /studio/login and /studio/logout stay open so users can
  // sign in / out.
  if (
    pathname === '/studio' ||
    (pathname.startsWith('/studio/') &&
      !pathname.startsWith('/studio/login') &&
      !pathname.startsWith('/studio/logout'))
  ) {
    const token = request.cookies.get(STUDIO_COOKIE_NAME)?.value
    const valid = await verifyToken(token)
    if (!valid) {
      const loginUrl = new URL('/studio/login', request.url)
      loginUrl.searchParams.set(
        'next',
        request.nextUrl.pathname + request.nextUrl.search,
      )
      return NextResponse.redirect(loginUrl)
    }
  }

  const subdomain = Object.keys(SUBDOMAIN_MAP).find(
    (sub) =>
      hostname.includes(`${sub}.coastglobal.org`) ||
      hostname.startsWith(`${sub}.localhost`),
  )

  if (subdomain) {
    const basePath = SUBDOMAIN_MAP[subdomain]

    // Already under the subsite base, or a static asset that lives at the root
    // (e.g. /img/x.jpg, /portfolio/y.png, /vision/z.jpeg) - serve as-is. Without
    // the asset guard the rewrite turns /img/x.jpg into /gallery/img/x.jpg -> 404,
    // which breaks every /public image (incl. next/image sources) on the subdomain.
    if (pathname.startsWith(basePath) || /\.[a-zA-Z0-9]+$/.test(pathname)) {
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
