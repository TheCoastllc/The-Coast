import Header from '@/components/Header'
import Footer from '@/components/footer'

export const metadata = {
  title: 'Our Work | Client Case Studies & Creative Projects | The Coast',
  description: 'Explore The Coast\'s portfolio of brand transformations, web designs, and creative projects.',
}

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <span className="text-mono text-muted-foreground/50 block mb-3">Portfolio</span>
          <h1 className="text-heading text-4xl md:text-6xl lg:text-7xl mb-6">Our Work</h1>
          <p className="text-body text-muted-foreground text-lg md:text-xl max-w-2xl mb-16">
            Brand transformations, creative projects, and the stories behind them.
          </p>
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <p>Portfolio coming soon.</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
