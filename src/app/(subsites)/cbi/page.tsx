import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

const CbiLanding = dynamic(() => import('@/components/cbi/CbiLanding'), {
  loading: () => (
    <div className="min-h-screen bg-[#06080C] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[#E6B24D]/30 border-t-[#E6B24D] rounded-full animate-spin" />
    </div>
  ),
})

export const metadata: Metadata = {
  title: 'Coast Brand Index — How Strong Is Your Wave?',
  description:
    'The Coast Brand Index scores your brand across 5 pillars and 20 criteria. Get your Wave Rating in under 2 minutes — free.',
}

export default function CbiPage() {
  return <CbiLanding />
}
