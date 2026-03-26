'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function Toast({
  message,
  show,
  onDone,
  duration = 3000,
}: {
  message: string
  show: boolean
  onDone: () => void
  duration?: number
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!show) return
    setVisible(true)
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDone, 300)
    }, duration)
    return () => clearTimeout(timer)
  }, [show, duration, onDone])

  if (!show && !visible) return null

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-[#1a1f2e] border border-white/10 text-white text-sm rounded-md shadow-xl transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
      )}
    >
      {message}
    </div>
  )
}
