import Header from '@/components/Header'
import Footer from '@/components/footer'

export const metadata = {
  title: 'Portfolio | Client Showcase | The Coast',
  description: 'See how The Coast transforms brands and helps businesses grow.',
}

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <span className="text-mono text-muted-foreground/50 block mb-3">Clients</span>
          <h1 className="text-heading text-4xl md:text-6xl lg:text-7xl mb-6">Client Showcase</h1>
          <p className="text-body text-muted-foreground text-lg md:text-xl max-w-2xl mb-16">
            The brands we&apos;ve helped build, grow, and transform.
          </p>
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <p>Client showcase coming soon.</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
