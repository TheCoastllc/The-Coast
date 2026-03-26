'use client'

import { useChecklist } from '../ChecklistContext'
import { EmailCapture } from '@/components/offers/EmailCapture'

export function EmailCaptureScreen() {
  const { derived, dispatch } = useChecklist()

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-[#0D1117]">
      <EmailCapture
        tool="brand-checklist"
        heading="Get your detailed score breakdown"
        description="Enter your email and we'll send you a full breakdown of your brand consistency score with personalised recommendations."
        answers={{
          score: derived.totalScore,
          band: derived.band,
          yes: derived.yesCount,
          part: derived.partCount,
          no: derived.noCount,
        }}
        onComplete={() => dispatch({ type: 'SHOW_RESULTS' })}
      />
    </div>
  )
}
