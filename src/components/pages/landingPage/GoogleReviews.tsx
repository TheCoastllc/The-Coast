'use client'

import { ReactGoogleReviews } from 'react-google-reviews'
import 'react-google-reviews/dist/index.css'
import { AnimatedSectionLabel, AnimatedSectionHeading } from './AnimationWrappers'

const FEATURABLE_WIDGET_ID = '0678c24f-9212-4556-9ffa-baa00fe37ddb'

const StarIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

const GoogleReviews = () => {
  return (
    <section className="py-32 bg-black">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-20">
          <AnimatedSectionLabel>
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-mono">07</span>
            <div className="w-12 h-px bg-white/20" />
            <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase">Reviews</span>
          </AnimatedSectionLabel>
          <AnimatedSectionHeading
            text="What Clients Say"
            highlight={["Clients"]}
            className="text-4xl md:text-5xl lg:text-6xl font-display uppercase tracking-tighter"
          />
        </div>

        <ReactGoogleReviews
          layout="custom"
          featurableId={FEATURABLE_WIDGET_ID}
          renderer={(reviews) => (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.reviewId}
                  className="bg-white/3 border border-white/10 rounded-xl p-6 hover:border-primary/30 transition-all duration-500"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.starRating)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 text-primary" />
                    ))}
                  </div>
                  <p className="text-white/50 text-sm font-light leading-relaxed mb-6 line-clamp-4">
                    {review.comment}
                  </p>
                  <div className="flex items-center gap-3 mt-auto">
                    {review.reviewer.profilePhotoUrl ? (
                      <img
                        src={review.reviewer.profilePhotoUrl}
                        alt={review.reviewer.displayName}
                        className="w-10 h-10 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {review.reviewer.displayName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium text-sm">
                        {review.reviewer.displayName}
                      </p>
                      <p className="text-white/30 text-xs">Google Review</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        />

        <div className="text-center mt-12">
          <a
            href="https://search.google.com/local/writereview?placeid=ChIJ_fjV-mLpAo4Riif8WzjsV70"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm tracking-[0.2em] uppercase font-mono"
          >
            Leave a review
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default GoogleReviews
