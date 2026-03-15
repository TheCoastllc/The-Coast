import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'

export const metadata: import('next').Metadata = {
  title: 'Payment Successful',
  description: 'Your order has been received. We will be in touch within 24 hours.',
  robots: { index: false, follow: false },
}

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="flex items-center justify-center min-h-[80vh] p-4">
        <div className="text-center max-w-lg">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-heading text-4xl mb-4">Thank You!</h1>
          <p className="text-body text-muted-foreground text-lg mb-6 leading-relaxed">
            We&apos;ve received your order — expect to hear from us within{' '}
            <span className="text-foreground font-medium">24 hours</span>.
          </p>
          <div className="p-4 rounded-lg bg-card border border-border mb-8">
            <p className="text-body text-muted-foreground text-sm">
              Want to speed things up? Fill out our intake questionnaire so we can hit the ground running.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground rounded-full text-mono text-sm hover:border-primary hover:bg-primary/10 transition-all duration-300"
            >
              Back to Home
            </Link>
            <Link
              href="/intake"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-mono text-sm hover:bg-primary/90 transition-colors duration-300"
            >
              Fill Out Intake Form
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
