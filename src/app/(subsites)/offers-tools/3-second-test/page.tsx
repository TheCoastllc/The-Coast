import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

const ThreeSecondTest = dynamic(
  () => import('@/components/offers/three-second-test/ThreeSecondTest'),
  {
    loading: () => (
      <div className="min-h-screen bg-[#0A0C12] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#E6B24D]/30 border-t-[#E6B24D] rounded-full animate-spin" />
      </div>
    ),
  },
)

export const metadata: Metadata = {
  title: 'The 3-Second Brand Test',
  description:
    'How customers judge your brand before you say a word. Learn the five critical elements and run the self-test. Free.',
  alternates: { canonical: 'https://offers.coastglobal.org/3-second-test' },
}

export default function ThreeSecondTestPage() {
  return <ThreeSecondTest />
}
