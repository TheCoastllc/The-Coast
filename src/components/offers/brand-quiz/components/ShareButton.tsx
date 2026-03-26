'use client'

import { useCallback, useState } from 'react'
import { Share2, Check } from 'lucide-react'
import type { ResultTier } from '../data/results'

export function ShareButton({ score, tier }: { score: number; tier: ResultTier }) {
  const [copied, setCopied] = useState(false)

  const handleShare = useCallback(async () => {
    const text = `I scored ${score}/30 on The Coast Brand Quiz \u2014 my brand is "${tier}". Take the quiz: https://offers.coastglobal.org/brand-quiz`

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'My Brand Quiz Result', text })
        return
      } catch {
        // User cancelled or share failed, fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard not available
    }
  }, [score, tier])

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 border border-white/10 text-white/50 hover:text-white hover:border-white/20 px-5 py-3 text-sm rounded-sm transition-colors"
    >
      {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
      {copied ? 'Copied!' : 'Share Your Result'}
    </button>
  )
}
