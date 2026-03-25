import { AnimatedLabel, AnimatedHeading, AnimatedStat } from './AboutAnimations'

const stats = [
  { label: 'Projects Delivered', value: '50+' },
  { label: 'Brands Built', value: '30+' },
  { label: 'Client Satisfaction', value: '98%' },
]

export default function About() {
  return (
    <section className="py-32 md:py-48 bg-black" id="about">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-20">
          <AnimatedLabel>
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-mono">02</span>
            <div className="w-12 h-px bg-white/20" />
            <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase">About Us</span>
          </AnimatedLabel>
          <AnimatedHeading
            text="What Is The Coast and Who Is It For?"
            highlight={["Coast"]}
            className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-display uppercase tracking-tighter max-w-4xl leading-none"
          />
          <p className="text-body text-muted-foreground/60 text-sm md:text-base leading-relaxed max-w-3xl mt-8">
            The Coast is a brand design studio that makes professional branding affordable and accessible for small businesses, entrepreneurs, startups, and artists. Founded by David Coast, the studio was built on a simple observation: most small businesses fail not because they lack talent, but because they are invisible. Professional branding has traditionally been locked behind agency budgets that most entrepreneurs cannot touch - retainers starting at $10,000 per month with the largest firms. The Coast changed that equation by offering the same caliber of brand identity work - custom logo design, comprehensive brand guidelines, marketing collateral, and digital presence - at prices that make sense for growing businesses. With over 50 projects delivered across healthcare, e-commerce, tech, food and beverage, and entertainment, The Coast&apos;s four-step process (Discover, Design, Develop, Launch) typically delivers complete brand transformations in 2 to 6 weeks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">
          {stats.map((stat, i) => (
            <AnimatedStat key={i} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
