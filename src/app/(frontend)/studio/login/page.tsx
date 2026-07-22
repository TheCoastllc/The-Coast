// Public entry point for the /studio gate.
// Renders a single password field, posts to the server action.

import type { Metadata } from 'next'
import { loginAction } from './actions'

export const metadata: Metadata = {
  title: 'Studio access | The Coast Global',
  description: 'Internal team access.',
  robots: { index: false, follow: false },
}

interface SearchParams {
  next?: string
  error?: string
}

export default async function StudioLoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const next = params.next || '/studio'
  const hasError = params.error === 'invalid'

  return (
    <main
      style={{
        background: '#0a0a0c',
        color: '#F0EAD6',
        minHeight: '100vh',
        fontFamily: 'var(--font-sans)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '48px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(201, 162, 75, 0.18)',
          borderRadius: '4px',
        }}
      >
        <div
          style={{
            fontFamily:
              "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
            fontSize: '11px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#E6B24D',
            marginBottom: '20px',
          }}
        >
          The Coast Global · Studio · Internal
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '48px',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            margin: 0,
            color: '#F0EAD6',
          }}
        >
          Enter team{' '}
          <em
            style={{
              fontStyle: 'italic',
              fontWeight: 300,
              color: '#E6B24D',
            }}
          >
            password.
          </em>
        </h1>

        <p
          style={{
            marginTop: '16px',
            marginBottom: '32px',
            fontSize: '14px',
            lineHeight: 1.55,
            color: 'rgba(240, 234, 214, 0.6)',
          }}
        >
          This area is restricted to The Coast Global team. Ask David if you don&apos;t
          have the password.
        </p>

        <form action={loginAction} style={{ display: 'block' }}>
          <input type="hidden" name="next" value={next} />

          <label
            htmlFor="password"
            style={{
              display: 'block',
              fontFamily:
                "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
              fontSize: '10px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: 'rgba(240, 234, 214, 0.55)',
              marginBottom: '10px',
            }}
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
            aria-invalid={hasError || undefined}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: '#000',
              color: '#F0EAD6',
              border: hasError
                ? '1px solid #c84b4b'
                : '1px solid rgba(201, 162, 75, 0.3)',
              borderRadius: '2px',
              fontSize: '15px',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          {hasError && (
            <div
              style={{
                marginTop: '12px',
                fontFamily:
                  "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
                fontSize: '11px',
                letterSpacing: '1px',
                color: '#e98080',
              }}
            >
              Incorrect password. Try again.
            </div>
          )}

          <button
            type="submit"
            style={{
              marginTop: '24px',
              width: '100%',
              padding: '16px 22px',
              background: '#E6B24D',
              color: '#0a0a0c',
              fontFamily:
                "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontWeight: 700,
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer',
            }}
          >
            ↳ Unlock studio
          </button>
        </form>

        <div
          style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(201, 162, 75, 0.12)',
            fontFamily:
              "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
            fontSize: '10px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: 'rgba(240, 234, 214, 0.4)',
          }}
        >
          <a href="/" style={{ color: '#E6B24D', textDecoration: 'none' }}>
            ← Back to coastglobal.org
          </a>
        </div>
      </div>
    </main>
  )
}
