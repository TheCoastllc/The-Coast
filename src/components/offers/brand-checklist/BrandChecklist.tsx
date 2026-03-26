'use client'

import { ChecklistProvider, useChecklist } from './ChecklistContext'
import { IntroScreen } from './IntroScreen'
import { CategoryStepScreen } from './screens/CategoryStepScreen'
import { EmailCaptureScreen } from './screens/EmailCaptureScreen'
import { ResultsScreen } from './screens/ResultsScreen'

function ChecklistScreens() {
  const { screen } = useChecklist()

  switch (screen) {
    case 'intro':
      return <IntroScreen />
    case 'category':
      return <CategoryStepScreen />
    case 'email':
      return <EmailCaptureScreen />
    case 'results':
      return <ResultsScreen />
  }
}

export default function BrandChecklist() {
  return (
    <ChecklistProvider>
      <ChecklistScreens />
    </ChecklistProvider>
  )
}
