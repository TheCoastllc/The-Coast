'use client'

import { useState } from 'react'
import { EmailCapture } from '@/components/offers/EmailCapture'

export function EmailSection() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <section className="bg-[#0D1117] flex flex-col justify-center items-center px-6 py-16 text-center">
        <p className="text-[#C9A24B] text-xs tracking-[0.3em] uppercase mb-4">Sent</p>
        <p className="text-white/50 text-sm">Check your inbox for your results and recommendations.</p>
      </section>
    )
  }

  return (
    <section className="bg-[#0D1117] flex flex-col justify-center items-center px-6 py-20 text-center">
      <EmailCapture
        tool="3-second-test"
        heading="Get your brand assessment delivered"
        description="Enter your email and we'll send you a summary of the 3-second framework with actionable next steps for your brand."
        onComplete={() => setSubmitted(true)}
      />
    </section>
  )
}
