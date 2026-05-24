import { fetchReviews } from '@/lib/google-reviews'
import { GoogleReviewsClient } from './GoogleReviews'

export default async function GoogleReviews() {
  const reviews = await fetchReviews()
  return <GoogleReviewsClient reviews={reviews} />
}
