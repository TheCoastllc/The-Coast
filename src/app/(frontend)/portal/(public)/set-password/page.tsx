'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Lock, Check } from 'lucide-react'

function SetPasswordContent() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      setIsValidSession(true)
    } else {
      // Check if already logged in
      authClient.getSession().then((session) => {
        if (session?.data?.user) {
          setIsValidSession(true)
        }
      })
    }
    setTimeout(() => setIsCheckingSession(false), 1000)
  }, [searchParams])

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords don\'t match')
      return
    }
    setIsLoading(true)
    try {
      const token = searchParams.get('token')
      if (token) {
        const { error } = await authClient.resetPassword({
          newPassword: password,
          token,
        })
        if (error) throw error
      } else {
        throw new Error('No reset token found')
      }
      await fetch('/api/portal/accept-invite', { method: 'POST' })
      toast.success('Password set successfully! Redirecting to your portal...')
      setTimeout(() => router.push('/portal'), 1500)
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Failed to set password')
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-1">
              <span className="text-2xl font-bold tracking-tight text-foreground">THE COAST</span>
              <span className="text-primary text-3xl leading-none">.</span>
            </Link>
          </div>
          <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
            <h1 className="text-xl font-semibold text-foreground mb-4">Invalid or Expired Link</h1>
            <p className="text-muted-foreground mb-6">
              This password setup link is invalid or has expired. Please request a new invite from your account manager.
            </p>
            <Link
              href="/portal/login"
              className="w-full inline-flex items-center justify-center py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1">
            <span className="text-2xl font-bold tracking-tight text-foreground">THE COAST</span>
            <span className="text-primary text-3xl leading-none">.</span>
          </Link>
          <p className="text-muted-foreground mt-2">Set Up Your Account</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
          <h1 className="text-xl font-semibold text-foreground mb-2">Create your password</h1>
          <p className="text-sm text-muted-foreground mb-6">Set a secure password to access your client portal.</p>

          <form onSubmit={handleSetPassword} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">New Password</label>
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
                  minLength={8}
                />
              </div>
              <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium text-foreground">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              {confirmPassword && password === confirmPassword && (
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <Check className="h-3 w-3" /> Passwords match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Setting password...</>
              ) : (
                'Set Password & Continue'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SetPasswordContent />
    </Suspense>
  )
}
