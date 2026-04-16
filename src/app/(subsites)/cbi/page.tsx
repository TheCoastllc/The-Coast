import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

const CbiLanding = dynamic(() => import('@/components/cbi/CbiLanding'), {
  loading: () => (
    <div className="min-h-screen bg-[#070F11] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[#C9A24B]/30 border-t-[#C9A24B] rounded-full animate-spin" />
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
