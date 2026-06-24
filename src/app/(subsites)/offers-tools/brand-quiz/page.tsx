import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

const BrandQuiz = dynamic(
  () => import('@/components/offers/brand-quiz/BrandQuiz'),
  {
    loading: () => (
      <div className="min-h-screen bg-[#0A0C12] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#E6B24D]/30 border-t-[#E6B24D] rounded-full animate-spin" />
      </div>
    ),
  },
)

export const metadata: Metadata = {
  title: "Brand Quiz - What's Your Brand Actually Saying?",
  description:
    '10-question brand diagnostic quiz. Find out if your brand is invisible, inconsistent, or established. 60 seconds. Free.',
  alternates: { canonical: 'https://offers.coastglobal.org/brand-quiz' },
}

export default function BrandQuizPage() {
  return <BrandQuiz />
}
