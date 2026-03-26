import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SUBDOMAIN_MAP: Record<string, string> = {
  cbi: '/cbi',
  offers: '/offers-tools',
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

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)'],
}
