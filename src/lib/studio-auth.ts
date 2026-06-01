// Shared cookie + HMAC helpers for the /studio gate.
//
// We use Web Crypto (subtle.sign) so the same module works in both the Edge
// runtime (middleware) and the Node runtime (server action / route handler).
//
// Token shape:
//   value = HMAC_SHA256(STUDIO_COOKIE_SECRET, "studio-access-v1")  (hex)
// Anyone with the secret can compute the token; without it, the cookie
// cannot be forged. We never include the password itself in the cookie.

export const STUDIO_COOKIE_NAME = 'studio_auth'
export const STUDIO_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days
const TOKEN_PAYLOAD = 'studio-access-v1'

function getSecret(): string {
  const secret = process.env.STUDIO_COOKIE_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'STUDIO_COOKIE_SECRET env var is required in production. ' +
          'Set it via `vercel env add STUDIO_COOKIE_SECRET`.',
      )
    }
    // Local dev fallback — fine because there's no real data behind the gate.
    return 'dev-only-secret-replace-in-production'
  }
  return secret
}

async function hmacSha256Hex(key: string, message: string): Promise<string> {
  const enc = new TextEncoder()
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(message))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function expectedToken(): Promise<string> {
  return hmacSha256Hex(getSecret(), TOKEN_PAYLOAD)
}

/** Constant-time string equality. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

export async function verifyToken(input: string | undefined): Promise<boolean> {
  if (!input) return false
  const expected = await expectedToken()
  return timingSafeEqual(input, expected)
}

export function verifyPassword(input: string): boolean {
  const stored = process.env.STUDIO_PASSWORD || ''
  if (!stored) return false
  return timingSafeEqual(input, stored)
}
