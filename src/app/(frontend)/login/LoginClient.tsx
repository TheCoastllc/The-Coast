'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/admin'

  // Soft rate-limit: disable form for 30s after 5 failed attempts
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    if (!lockedUntil) return
    const interval = setInterval(() => {
      const left = Math.ceil((lockedUntil - Date.now()) / 1000)
      if (left <= 0) {
        setLockedUntil(null)
        setAttempts(0)
        clearInterval(interval)
      } else {
        setRemaining(left)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [lockedUntil])

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLocked || isLoading) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      })

      if (!res.ok) {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        if (newAttempts >= 5) {
          setLockedUntil(Date.now() + 30_000)
        }
        // Generic message — never reveal whether email or password is wrong
        toast.error('Invalid credentials. Please try again.')
        return
      }

      router.push(redirect.startsWith('/') ? redirect : '/admin')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1">
            <span className="text-2xl font-bold tracking-tight text-foreground">THE COAST</span>
            <span className="text-primary text-3xl leading-none">.</span>
          </Link>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
          <h1 className="text-xl font-semibold text-foreground mb-6">Sign in</h1>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@coastglobal.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                  required
                  disabled={isLocked}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                  required
                  disabled={isLocked}
                />
              </div>
            </div>

            {isLocked && (
              <p className="text-sm text-destructive text-center">
                Too many attempts. Try again in {remaining}s.
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || isLocked}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <a
              href="/admin/forgot"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </a>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginClient() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
