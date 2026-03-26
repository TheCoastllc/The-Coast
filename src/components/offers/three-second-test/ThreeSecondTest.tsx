'use client'

import { ScrollProgressBar } from './components/ScrollProgressBar'
import { CoverSection } from './sections/CoverSection'
import { ScienceSection } from './sections/ScienceSection'
import { ElementsSection } from './sections/ElementsSection'
import { SelfTestSection } from './sections/SelfTestSection'
import { OutcomesSection } from './sections/OutcomesSection'
import { EmailSection } from './sections/EmailSection'
import { CTASection } from './sections/CTASection'

export default function ThreeSecondTest() {
  return (
    <main>
      <ScrollProgressBar />
      <CoverSection />
      <ScienceSection />
      <ElementsSection />
      <SelfTestSection />
      <OutcomesSection />
      <EmailSection />
      <CTASection />
    </main>
  )
}
