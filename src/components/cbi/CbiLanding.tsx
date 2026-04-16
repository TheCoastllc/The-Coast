'use client'

import { CbiProvider, useCbi } from './CbiContext'
import { HeroScreen } from './screens/HeroScreen'
import { IntakeScreen } from './screens/IntakeScreen'
import { QuestionsScreen } from './screens/QuestionsScreen'
import { EmailGateScreen } from './screens/EmailGateScreen'
import { ResultsScreen } from './screens/ResultsScreen'

function CbiPhases() {
  const { state } = useCbi()
  switch (state.phase) {
    case 'hero':
      return <HeroScreen />
    case 'intake':
      return <IntakeScreen />
    case 'questions':
      return <QuestionsScreen />
    case 'gate':
      return <EmailGateScreen />
    case 'result':
      return <ResultsScreen />
  }
}

export default function CbiLanding() {
  return (
    <CbiProvider>
      <CbiPhases />
    </CbiProvider>
  )
}
