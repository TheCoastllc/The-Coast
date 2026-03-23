import { BlueprintLayout } from '@/components/blueprint-layout'
import TextReveal from '@/components/TextReveal'

export const metadata: import('next').Metadata = {
  title: 'Our Work',
  description:
    'Explore brand transformations, logo design projects, and creative work from The Coast. Real results for real businesses.',
  robots: { index: false, follow: false },
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
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12">
          <span className="text-mono text-muted-foreground/50 block mb-3">Portfolio</span>
          <TextReveal as="h1" className="text-heading text-4xl md:text-6xl lg:text-7xl mb-6">Our Work</TextReveal>
          <p className="text-body text-muted-foreground text-lg md:text-xl max-w-2xl mb-16">
            Brand transformations, creative projects, and the stories behind them.
          </p>
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <p>Portfolio coming soon.</p>
          </div>
        </div>
      </div>
    </BlueprintLayout>
  )
}
