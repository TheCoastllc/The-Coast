'use client'

import { useQuery } from '@tanstack/react-query'

const StarIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

type Review = {
  id: string
  name: string
  initial: string
  color: string
  category: string
  text: string
  rating: number
}

const googleReviewCount = 7
const avgRating = '5.0'

const GoogleReviews = () => {
  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ['google-reviews'],
    queryFn: async () => {
      const res = await fetch('/api/google-reviews?sort=displayOrder')
      if (!res.ok) throw new Error('Failed to fetch reviews')
      const data = await res.json()
      return data.docs ?? []
    },
  })

  if (reviews.length === 0) return null

  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="w-6 h-6 text-yellow-400" />
            ))}
          </div>
          <p className="text-muted-foreground text-sm mb-2">
            {avgRating} from {googleReviewCount} Google Reviews
          </p>
          <h2 className="text-heading text-3xl md:text-4xl text-foreground">
            What Our Clients Say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
              <p className="text-body text-muted-foreground text-sm mb-4 leading-relaxed">
                {review.text}
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold text-sm"
                  style={{ backgroundColor: review.color }}
                >
                  {review.initial}
                </div>
                <div>
                  <p className="text-foreground font-medium text-sm">{review.name}</p>
                  <p className="text-muted-foreground text-xs">{review.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://www.google.com/maps/place/?q=place_id:237714582837436261"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent-teal transition-colors text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            See all {googleReviewCount} reviews on Google
          </a>
        </div>
      </div>
    </section>
  )
}

export default GoogleReviews
