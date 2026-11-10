/** One review as the site renders it (homepage deck, /ai deck). Shaped to match the kit's DeckReview. */
export type MarqueeReview = {
  quote: string
  name: string
  stars: number
  avatar?: string | null
  date?: string | null
}
