import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

const BrandChecklist = dynamic(
  () => import('@/components/offers/brand-checklist/BrandChecklist'),
  {
    loading: () => (
      <div className="min-h-screen bg-[#0A0C12] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#E6B24D]/30 border-t-[#E6B24D] rounded-full animate-spin" />
      </div>
    ),
  },
)

export const metadata: Metadata = {
  title: 'Brand Consistency Checklist',
  description:
    '25-item interactive brand consistency checklist across 5 pillars. Score your brand in real time. Free.',
}

export default function BrandChecklistPage() {
  return <BrandChecklist />
}
