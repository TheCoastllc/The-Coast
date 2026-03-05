'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/footer'

const industries = [
  'Healthcare', 'E-commerce', 'Tech/SaaS', 'Food & Beverage', 'Fashion',
  'Real Estate', 'Professional Services', 'Entertainment', 'Other',
]

const projectServices = [
  { id: 'logo', label: 'Logo Design', description: 'Custom logo with concepts & revisions' },
  { id: 'flyer', label: 'Flyers', description: 'Print-ready promotional designs' },
  { id: 'epk', label: 'EPK / Press Kit', description: 'Professional media kit' },
  { id: 'social', label: 'Social Graphics', description: 'Branded templates for social platforms' },
  { id: 'rebrand', label: 'Full Rebrand', description: 'Complete brand transformation' },
  { id: 'brand-identity', label: 'Brand Identity Guidelines', description: 'Logo, colors, typography, guidelines' },
  { id: 'website', label: 'Website Design', description: 'Custom website design & development' },
  { id: 'pitch-deck', label: 'Pitch Deck', description: 'Investor-ready presentation design' },
  { id: 'video', label: 'Video & Motion', description: 'Promotional videos & animations' },
  { id: 'digital-marketing', label: 'Digital Marketing', description: 'SEO, ads, email campaigns' },
  { id: 'social-mgmt', label: 'Social Media Management', description: 'Content creation & scheduling' },
]

const budgetRanges = [
  { id: 'under-500', label: 'Under $500', description: 'One-time project' },
  { id: '500-1500', label: '$500 – $1,500', description: 'Small to mid-size project' },
  { id: '1500-3000', label: '$1,500 – $3,000', description: 'Larger project or retainer' },
  { id: '3000-plus', label: '$3,000+', description: 'Full branding or ongoing work' },
  { id: 'not-sure', label: 'Not Sure Yet', description: 'Let\'s figure it out together' },
]

const steps = [
  { number: 1, label: 'About You' },
  { number: 2, label: 'Services' },
  { number: 3, label: 'Budget' },
]

const inputClass = 'w-full px-4 py-3 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors'

export default function GetStartedPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Step 1
  const [name, setName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [industry, setIndustry] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // Step 2
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set())

  // Step 3
  const [budget, setBudget] = useState('')

  const toggleService = (id: string) => {
    setSelectedServices((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Store prefill and redirect to intake
      const prefill = {
        name,
        businessName,
        industry,
        email,
        phone,
        services: Array.from(selectedServices),
        budget,
      }
      localStorage.setItem('inquiry_prefill', JSON.stringify(prefill))
      router.push('/intake')
    }
  }

  const canContinue =
    step === 1 ? name.trim() && businessName.trim() && email.trim() && industry :
    step === 2 ? selectedServices.size > 0 :
    !!budget

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="flex items-center gap-3 mb-12">
            {steps.map((s, i) => (
              <div key={s.number} className="flex items-center gap-3">
                <div className={`flex items-center gap-2 ${step >= s.number ? 'text-foreground' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step > s.number ? 'bg-primary text-primary-foreground' :
                    step === s.number ? 'bg-primary/20 text-primary border border-primary/50' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {step > s.number ? <Check className="h-4 w-4" /> : s.number}
                  </div>
                  <span className="text-sm hidden sm:block">{s.label}</span>
                </div>
                {i < steps.length - 1 && <div className="flex-1 h-px bg-border min-w-[24px]" />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: About You */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-mono text-muted-foreground/50 block mb-2">Step 1 of 3</span>
                <h1 className="text-heading text-3xl md:text-4xl text-foreground mb-2">Tell us about yourself</h1>
                <p className="text-body text-muted-foreground mb-8">We&apos;d love to learn about you and your business.</p>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Your Name *</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Business Name *</label>
                      <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Acme Inc." className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Email *</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Phone (Optional)</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Industry *</label>
                    <div className="flex flex-wrap gap-2">
                      {industries.map((ind) => (
                        <button
                          key={ind}
                          onClick={() => setIndustry(ind)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                            industry === ind
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                          }`}
                        >
                          {ind}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Services */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-mono text-muted-foreground/50 block mb-2">Step 2 of 3</span>
                <h2 className="text-heading text-3xl md:text-4xl text-foreground mb-2">What do you need?</h2>
                <p className="text-body text-muted-foreground mb-8">Select all that apply. You can always adjust later.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projectServices.map((service) => {
                    const isSelected = selectedServices.has(service.id)
                    return (
                      <button
                        key={service.id}
                        onClick={() => toggleService(service.id)}
                        className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-foreground'
                            : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">{service.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{service.description}</p>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 ml-2">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 3: Budget */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-mono text-muted-foreground/50 block mb-2">Step 3 of 3</span>
                <h2 className="text-heading text-3xl md:text-4xl text-foreground mb-2">What&apos;s your budget?</h2>
                <p className="text-body text-muted-foreground mb-8">This helps us recommend the right approach for you.</p>

                <div className="space-y-3">
                  {budgetRanges.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => setBudget(range.id)}
                      className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
                        budget === range.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-card hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{range.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{range.description}</p>
                        </div>
                        {budget === range.id && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={handleContinue}
              disabled={!canContinue}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-mono text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {step === 3 ? 'Continue to Intake Form' : 'Continue'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
