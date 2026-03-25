import { BlueprintLayout } from '@/components/blueprint-layout'
import WorkPageContent from '@/components/pages/workPage/WorkPageContent'

export const metadata: import('next').Metadata = {
  title: 'Our Work — Brand Transformations',
  description:
    'Explore brand transformations, logo design projects, and creative work from The Coast. Real results for real businesses.',
  alternates: { canonical: 'https://www.coastglobal.org/work' },
  openGraph: {
    title: 'Our Work | Brand Transformations | The Coast',
    description: 'Brand transformations, creative projects, and the stories behind them.',
    url: 'https://www.coastglobal.org/work',
  },
}

export default function WorkPage() {
  return (
    <BlueprintLayout>
      <WorkPageContent />
    </BlueprintLayout>
  )
}
