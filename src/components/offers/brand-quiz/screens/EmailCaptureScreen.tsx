'use client'

import { useQuiz } from '../QuizContext'
import { EmailCapture } from '@/components/offers/EmailCapture'

export function EmailCaptureScreen() {
  const { state, dispatch } = useQuiz()

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-[#0D1117]">
      <EmailCapture
        tool="brand-quiz"
        heading="Want your full Brand Audit breakdown?"
        description="Enter your email and we'll send you a detailed breakdown of your score with personalised recommendations."
        answers={state.answers}
        onComplete={() => dispatch({ type: 'SHOW_RESULTS' })}
      />
    </div>
  )
}
