'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export type ClientPublic = {
  id: number
  betterAuthUserId: string
  email: string
  contactName: string
  businessName: string
  logoUrl: string | null
  phone: string | null
  status: string
  subscriptionTier: string | null
  website: string | null
  industry: string
  createdAt: string
  notes: string | null
}

export function useClientAuth() {
  const [user, setUser] = useState<{ id: string; email: string; name?: string } | null>(null)
  const [client, setClient] = useState<ClientPublic | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const isMounted = useRef(true)
  const isLoadingRef = useRef(true)

  const updateLoading = (val: boolean) => {
    isLoadingRef.current = val
    setIsLoading(val)
  }

  useEffect(() => {
    isMounted.current = true
    isLoadingRef.current = true

    async function checkAuth() {
      try {
        const session = await authClient.getSession()
        if (!isMounted.current) return

        if (!session?.data?.user) {
          router.push('/portal/login')
          updateLoading(false)
          return
        }

        setUser(session.data.user)

        const res = await fetch('/api/portal/me')
        if (!isMounted.current) return

        if (!res.ok) {
          router.push('/portal/login')
          updateLoading(false)
          return
        }

        const clientData = await res.json()
        if (!isMounted.current) return

        if (clientData.error) {
          router.push('/portal/login')
          updateLoading(false)
          return
        }

        setClient(clientData)
        updateLoading(false)
      } catch {
        if (isMounted.current) {
          router.push('/portal/login')
          updateLoading(false)
        }
      }
    }

    checkAuth()

    const timeout = setTimeout(() => {
      if (isMounted.current && isLoadingRef.current) {
        console.warn('Client auth check timed out')
        updateLoading(false)
        router.push('/portal/login')
      }
    }, 5000)

    return () => {
      clearTimeout(timeout)
      isMounted.current = false
    }
  }, [router])

  const signOut = async () => {
    try {
      await authClient.signOut()
      router.push('/portal/login')
    } catch (err) {
      router.push('/portal/login')
    }
  }

  return { user, client, isLoading, signOut }
}
