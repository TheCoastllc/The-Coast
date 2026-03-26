export type Category = {
  num: string
  tag: string
  name: string
  items: string[]
}

export const categories: Category[] = [
  {
    num: '01',
    tag: 'Category One',
    name: 'Visual Identity',
    items: [
      'Your logo appears in the same format, colour, and proportions across your website, social profiles, email header, and packaging',
      'You use the same exact hex colour codes everywhere \u2014 no shade drift or approximations between platforms',
      'Your brand fonts are consistent across your website, social graphics, and all email content',
      'Your photography has a consistent style in lighting, mood, and subject framing across all channels',
      'Icons, illustrations, and graphic elements share a consistent visual style and weight throughout',
      'Your favicon is recognisable and matches your brand identity',
    ],
  },
  {
    num: '02',
    tag: 'Category Two',
    name: 'Written Voice',
    items: [
      "Your brand sounds like itself whether you're writing a product description, an Instagram caption, or a customer email",
      'You have a defined list of words and phrases your brand uses \u2014 and ones it never uses',
      'Your reading level and tone stay consistent across all written content and channels',
      'Your calls to action use the same language and energy across every platform',
      'Your written voice genuinely matches the visual identity your brand presents',
    ],
  },
  {
    num: '03',
    tag: 'Category Three',
    name: 'Digital Presence',
    items: [
      'Your brand name is spelled and formatted identically on every platform \u2014 website, social, Google, email',
      'Your social bios tell a consistent story across all channels \u2014 different words, same message',
      'Your link-in-bio destination delivers on whatever your bio promises',
      'Your website hero section and your social profiles communicate the same brand to a first-time visitor',
      'Your email subject lines and preview text feel like they come from the same brand as your website',
    ],
  },
  {
    num: '04',
    tag: 'Category Four',
    name: 'Customer Touchpoints',
    items: [
      'Your order confirmation and shipping emails feel intentionally branded \u2014 not system defaults',
      'Your customer service language matches the warmth and professionalism of your brand voice',
      'Your post-purchase emails \u2014 thank you, review request, re-engagement \u2014 are consistent in design and tone',
      'Your packaging or digital delivery experience carries the same visual identity as your online presence',
      'Your returns and refund communication reflects your brand rather than undermining it',
    ],
  },
  {
    num: '05',
    tag: 'Category Five',
    name: 'Trust Signals',
    items: [
      'Reviews and testimonials are displayed prominently and consistently across your website and social profiles',
      'Your brand story, mission, or values appear clearly and consistently wherever they are referenced',
      'Your social proof elements \u2014 press mentions, UGC, certifications \u2014 look intentional, not like afterthoughts',
      'Your pricing communication is consistent with the brand identity you present everywhere else',
      'A new customer encountering your brand for the first time would immediately understand who you are and why you exist',
    ],
  },
]

export const TOTAL_ITEMS = categories.reduce((sum, cat) => sum + cat.items.length, 0)
export const MAX_SCORE = TOTAL_ITEMS * 2
