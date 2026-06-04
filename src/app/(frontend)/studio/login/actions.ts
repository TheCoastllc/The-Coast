'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  STUDIO_COOKIE_NAME,
  STUDIO_COOKIE_MAX_AGE,
  expectedToken,
  verifyPassword,
} from '@/lib/studio-auth'

export async function loginAction(formData: FormData) {
  const password = String(formData.get('password') || '')
  const rawNext = String(formData.get('next') || '/studio')

  // Only allow internal /studio* paths as redirect targets - prevents an
  // open-redirect via a crafted ?next=https://evil.example.
  const safeNext = rawNext.startsWith('/studio') ? rawNext : '/studio'

  if (!verifyPassword(password)) {
    redirect(
      `/studio/login?error=invalid&next=${encodeURIComponent(safeNext)}`,
    )
  }

  const token = await expectedToken()
  const cookieStore = await cookies()
  cookieStore.set(STUDIO_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/studio',
    maxAge: STUDIO_COOKIE_MAX_AGE,
  })

  redirect(safeNext)
}
