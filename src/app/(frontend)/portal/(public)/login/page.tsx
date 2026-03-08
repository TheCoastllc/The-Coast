'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, ArrowLeft } from 'lucide-react'

export default function PortalLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    authClient.getSession().then(async (session) => {
      if (session?.data?.user) {
        const res = await fetch('/api/portal/me')
        if (res.ok) {
          const client = await res.json()
          if (client && !client.error) router.push('/portal')
        }
      }
    })
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { error } = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
      })
      if (error) throw error

      const res = await fetch('/api/portal/me')
      if (!res.ok) {
        await authClient.signOut()
        throw new Error('This account is not associated with a client portal.')
      }
      const clientData = await res.json()
      if (clientData.error) {
        await authClient.signOut()
        throw new Error('This account is not associated with a client portal.')
      }

      toast.success('Welcome back! You\'ve successfully logged in.')
      router.push('/portal')
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }
    setIsResettingPassword(true)
    try {
      const { error } = await authClient.requestPasswordReset({
        email: email.trim().toLowerCase(),
        redirectTo: '/portal/set-password',
      })
      if (error) throw error
      toast.success('Check your email — we\'ve sent you a password reset link.')
      setShowForgotPassword(false)
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Failed to send reset email')
    } finally {
      setIsResettingPassword(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1">
            <span className="text-2xl font-bold tracking-tight text-foreground">THE COAST</span>
            <span className="text-primary text-3xl leading-none">.</span>
          </Link>
          <p className="text-muted-foreground mt-2">Client Portal</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
          {showForgotPassword ? (
            <>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </button>

              <h1 className="text-xl font-semibold text-foreground mb-2">Reset your password</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Enter your email and we&apos;ll send you a reset link.
              </p>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="reset-email" className="text-sm font-medium text-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id="reset-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isResettingPassword}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isResettingPassword ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-foreground mb-6">Sign in to your portal</h1>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Not a client yet?{' '}
          <Link href="/get-started" className="text-primary hover:underline">
            Get started
          </Link>
        </p>
      </div>
    </div>
  )
}
