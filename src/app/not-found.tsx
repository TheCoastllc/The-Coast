import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-display text-8xl md:text-9xl mb-4">404</h1>
        <p className="text-body text-muted-foreground text-xl mb-8">Page not found</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-mono text-sm text-primary hover:text-foreground transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  )
}
