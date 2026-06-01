import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { STUDIO_COOKIE_NAME } from '@/lib/studio-auth'

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  cookieStore.set(STUDIO_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/studio',
    maxAge: 0,
  })
  return NextResponse.redirect(new URL('/studio/login', req.url))
}
