'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export type ClientPublic = {
  id: string
  user_id: string
  email: string
  contact_name: string
  business_name: string
  logo_url: string | null
  phone: string | null
  status: string
  subscription_tier: string | null
  website: string | null
  industry: string
  created_at: string
  notes: string | null
}

export function useClientAuth() {
  const [user, setUser] = useState<User | null>(null)
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

    const fetchClientData = async (): Promise<ClientPublic | null> => {
      try {
        const { data, error } = await supabase.rpc('get_own_client_data')
        if (error) {
          console.error('Error fetching client data:', error)
          return null
        }
        const row = Array.isArray(data) ? data[0] : data
        return (row as ClientPublic) || null
      } catch (err) {
        console.error('Error fetching client data:', err)
        return null
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted.current) return

        if (session?.user) {
          setUser(session.user)
          const clientData = await fetchClientData()
          if (!isMounted.current) return
          setClient(clientData)
          if (!clientData) {
            router.push('/portal/login')
          }
        } else {
          setUser(null)
          setClient(null)
          router.push('/portal/login')
        }
        updateLoading(false)
      }
    )

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted.current) return
      if (session?.user) {
        setUser(session.user)
        const clientData = await fetchClientData()
        if (!isMounted.current) return
        setClient(clientData)
        if (!clientData) {
          router.push('/portal/login')
        }
      } else {
        router.push('/portal/login')
      }
      updateLoading(false)
    }).catch((err) => {
      console.error('Error getting session:', err)
      if (isMounted.current) updateLoading(false)
    })

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
      subscription.unsubscribe()
    }
  }, [router])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/portal/login')
    } catch (err) {
      console.error('Sign out error:', err)
      router.push('/portal/login')
    }
  }

  return { user, client, isLoading, signOut }
}
