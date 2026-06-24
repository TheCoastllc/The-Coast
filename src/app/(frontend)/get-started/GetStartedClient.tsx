'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import styles from './getStarted.module.css'
import { SmsConsent } from '@/components/SmsConsent'

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
  { id: 'not-sure', label: 'Not Sure Yet', description: "Let's figure it out together" },
]

const steps = [
  { number: 1, label: 'About You' },
  { number: 2, label: 'Services' },
  { number: 3, label: 'Budget' },
]

export default function GetStartedClient() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [industry, setIndustry] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set())
  const [budget, setBudget] = useState('')
  const [smsTransactional, setSmsTransactional] = useState(false)
  const [smsMarketing, setSmsMarketing] = useState(false)

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
      const prefill = { name, businessName, industry, email, phone, services: Array.from(selectedServices), budget, smsTransactional, smsMarketing }
      localStorage.setItem('inquiry_prefill', JSON.stringify(prefill))
      router.push('/intake')
    }
  }

  const canContinue =
    step === 1 ? name.trim() && businessName.trim() && email.trim() && industry :
      step === 2 ? selectedServices.size > 0 :
        !!budget

  return (
    <div className={styles.wrap}>
      {/* Step indicator */}
      <div className={styles.steps}>
        {steps.map((s, i) => (
          <div key={s.number} className={styles.step} data-on={step >= s.number || undefined}>
            <span
              className={styles.stepDot}
              data-state={step > s.number ? 'done' : step === s.number ? 'active' : 'idle'}
            >
              {step > s.number ? <Check className="h-4 w-4" /> : s.number}
            </span>
            <span className={styles.stepLabel}>{s.label}</span>
            {i < steps.length - 1 && <span className={styles.stepBar} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" className={styles.panel} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <span className={styles.eyebrow}>Step 1 of 3</span>
            <h2 className={styles.title}>Tell us about yourself</h2>
            <p className={styles.sub}>We&apos;d love to learn about you and your business.</p>
            <div className={styles.fields}>
              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label}>Your Name *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className={styles.input} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Business Name *</label>
                  <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Acme Inc." className={styles.input} />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={styles.input} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Phone (Optional)</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className={styles.input} />
              </div>
              <SmsConsent
                transactional={smsTransactional}
                marketing={smsMarketing}
                onChange={(f, v) => (f === 'transactional' ? setSmsTransactional(v) : setSmsMarketing(v))}
              />
              <div className={styles.field}>
                <label className={styles.label}>Industry *</label>
                <div className={styles.chips}>
                  {industries.map((ind) => (
                    <button key={ind} type="button" onClick={() => setIndustry(ind)} className={styles.chip} data-on={industry === ind}>{ind}</button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="step2" className={styles.panel} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <span className={styles.eyebrow}>Step 2 of 3</span>
            <h2 className={styles.title}>What do you need?</h2>
            <p className={styles.sub}>Select all that apply. You can always adjust later.</p>
            <div className={styles.cards}>
              {projectServices.map((service) => {
                const isSelected = selectedServices.has(service.id)
                return (
                  <button key={service.id} type="button" onClick={() => toggleService(service.id)} className={styles.card} data-on={isSelected}>
                    <span>
                      <span className={styles.cardTitle}>{service.label}</span>
                      <span className={styles.cardDesc}>{service.description}</span>
                    </span>
                    {isSelected && <span className={styles.check}><Check className="w-3 h-3" /></span>}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div key="step3" className={styles.panel} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <span className={styles.eyebrow}>Step 3 of 3</span>
            <h2 className={styles.title}>What&apos;s your budget?</h2>
            <p className={styles.sub}>This helps us recommend the right approach for you.</p>
            <div className={`${styles.cards} ${styles.cardsOne}`}>
              {budgetRanges.map((range) => (
                <button key={range.id} type="button" onClick={() => setBudget(range.id)} className={styles.card} data-on={budget === range.id}>
                  <span>
                    <span className={styles.cardTitle}>{range.label}</span>
                    <span className={styles.cardDesc}>{range.description}</span>
                  </span>
                  {budget === range.id && <span className={styles.check}><Check className="w-3 h-3" /></span>}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.nav}>
        {step > 1 ? (
          <button type="button" onClick={() => setStep(step - 1)} className={styles.back}><ArrowLeft className="h-4 w-4" />Back</button>
        ) : <span />}
        <button type="button" onClick={handleContinue} disabled={!canContinue} className={styles.next}>
          {step === 3 ? 'Continue to Intake' : 'Continue'}<ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
