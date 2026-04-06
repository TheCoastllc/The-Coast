import { GoogleReviewsClient } from './GoogleReviews'

const FEATURABLE_WIDGET_ID = '0678c24f-9212-4556-9ffa-baa00fe37ddb'
const API_URL = `https://featurable.com/api/v1/widgets/${FEATURABLE_WIDGET_ID}`

async function fetchReviews() {
  try {
    const res = await fetch(API_URL, { next: { revalidate: 18000 } }) // 5 hours
    if (!res.ok) return []
    const data = await res.json()
    return (data.reviews ?? []).map((r: any) => ({
      reviewId: r.reviewId,
      reviewer: {
        profilePhotoUrl: r.reviewer.profilePhotoUrl,
        displayName: r.reviewer.displayName,
        isAnonymous: false,
      },
      starRating: r.starRating,
      comment: r.comment,
      createTime: r.createTime,
      updateTime: r.updateTime,
    }))
  } catch {
    return []
  }
}

export default async function GoogleReviews() {
  const reviews = await fetchReviews()
  return <GoogleReviewsClient reviews={reviews} />
}
