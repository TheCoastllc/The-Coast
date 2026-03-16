import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const { pathname } = request.nextUrl

  console.log('--- PROXY DEBUG ---')
  console.log('Incoming Host:', hostname)

  const isProductionSubdomain = hostname.includes('cbi.coastglobal.org')
  const isLocalSubdomain = hostname.startsWith('cbi.localhost')

  if (isProductionSubdomain || isLocalSubdomain) {
    console.log(`MATCH: Detected ${isLocalSubdomain ? 'Local' : 'Production'} Subdomain`)

    // Prevent loop
    if (pathname.startsWith('/cbi')) {
      console.log('SKIP: Already in /cbi path')
      return NextResponse.next()
    }

    const rewriteUrl = new URL(`/cbi${pathname}`, request.url)
    console.log('REWRITE:', rewriteUrl.pathname)

    return NextResponse.rewrite(rewriteUrl)
  }

  console.log('NO MATCH: Defaulting to main site.')
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)'],
}
