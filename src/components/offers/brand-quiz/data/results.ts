export type ResultTier = 'invisible' | 'inconsistent' | 'established'

export type ResultData = {
  badge: string
  headline: string
  body: string[]
  causes: string[]
  cta: string
  color: string
}

export const resultTiers: Record<ResultTier, ResultData> = {
  invisible: {
    badge: 'INVISIBLE BRAND',
    headline: "Your brand is invisible. Here's what that means.",
    body: [
      "Right now, your brand isn't doing any of the heavy lifting it should be. When people land on your site, your social pages, or see your ads \u2014 they're not getting a clear picture of who you are, what you do, or why you're worth their attention.",
      "This doesn't mean your product or service isn't good. It means your brand isn't communicating it. And in a market where attention is scarce and competition is everywhere, an invisible brand means missed revenue \u2014 every single day.",
      "The good news: this is entirely fixable. Most brands in this position can see significant improvement with focused, strategic brand work across identity, messaging, and digital presence.",
    ],
    causes: [
      'No defined brand identity or visual system to anchor your presence',
      "Messaging that doesn't clearly communicate your value or audience",
      'Inconsistent or absent social proof across key touchpoints',
      'No differentiation strategy \u2014 blending into a crowded market',
    ],
    cta: 'Get Your Free Brand Audit',
    color: '#D94F3D',
  },
  inconsistent: {
    badge: 'INCONSISTENT BRAND',
    headline: "Your brand has potential it isn't using.",
    body: [
      "You've built something real. There are clear signs of intentionality \u2014 some consistency, some voice, some visual direction. But the gaps are costing you more than you might realise.",
      "Inconsistency erodes trust. When your website feels like one brand, your social media like another, and your ads like a third, customers pick up on that \u2014 even if they can't name it. It creates friction and uncertainty at exactly the moments you need confidence.",
      "You're closer than you think to having a brand that works hard for you. The work now is about tightening the gaps, sharpening the positioning, and making sure every touchpoint is telling the same story.",
    ],
    causes: [
      "Brand guidelines that exist but aren't consistently applied",
      "Messaging that shifts depending on who's writing or which platform",
      "Social proof that's present but underutilised across the funnel",
      "Visual identity that's close \u2014 but not quite locked in",
    ],
    cta: 'Get Your Free Brand Audit',
    color: '#C9A24B',
  },
  established: {
    badge: 'ESTABLISHED BRAND',
    headline: "Your brand is strong. Here's how to make it stronger.",
    body: [
      "You've done the work. Your brand has clarity, consistency, and presence \u2014 and that shows up in how customers experience you across every touchpoint. That foundation is genuinely valuable and harder to build than most people realise.",
      "At this stage, the opportunity isn't fixing what's broken \u2014 it's optimising what's already working and identifying the 20% of brand decisions that will drive the next level of growth.",
      "Whether that's deepening your differentiation, expanding your brand system for new channels, or aligning your brand more tightly with your revenue strategy \u2014 there's always a next frontier. The brands that stay established are the ones that keep investing.",
    ],
    causes: [
      'Ensuring brand guidelines scale across team growth and new channels',
      'Keeping differentiation sharp as competitors evolve',
      'Connecting brand metrics directly to revenue and retention',
      'Building brand equity, not just brand presence',
    ],
    cta: 'See How Your Brand Scores on the Full Framework',
    color: '#28A77A',
  },
}

export function getTier(score: number): ResultTier {
  if (score <= 10) return 'invisible'
  if (score <= 20) return 'inconsistent'
  return 'established'
}
