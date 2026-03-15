import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'

export const metadata: import('next').Metadata = {
  title: 'Subscription Confirmed',
  description: 'Your subscription is confirmed. Welcome aboard!',
  robots: { index: false, follow: false },
}

export default function SubscriptionSuccessPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="flex items-center justify-center min-h-[80vh] p-4">
        <div className="text-center max-w-lg">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-heading text-4xl mb-4">Welcome Aboard!</h1>
          <p className="text-body text-muted-foreground text-lg mb-6 leading-relaxed">
            Your subscription is confirmed. Log in to your client portal to get started with your first project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground rounded-full text-mono text-sm hover:border-primary hover:bg-primary/10 transition-all duration-300"
            >
              Back to Home
            </Link>
            <Link
              href="/portal/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-mono text-sm hover:bg-primary/90 transition-colors duration-300"
            >
              Go to Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
