'use client'

import { QuizProvider, useQuiz } from './QuizContext'
import { IntroScreen } from './screens/IntroScreen'
import { QuestionScreen } from './screens/QuestionScreen'
import { EmailCaptureScreen } from './screens/EmailCaptureScreen'
import { ResultsScreen } from './screens/ResultsScreen'

function QuizScreens() {
  const { state } = useQuiz()

  switch (state.screen) {
    case 'intro':
      return <IntroScreen />
    case 'question':
      return <QuestionScreen />
    case 'email':
      return <EmailCaptureScreen />
    case 'results':
      return <ResultsScreen />
  }
}

export default function BrandQuiz() {
  return (
    <QuizProvider>
      <QuizScreens />
    </QuizProvider>
  )
}
