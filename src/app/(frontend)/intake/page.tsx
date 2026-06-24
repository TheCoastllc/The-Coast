'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import styles from './intake.module.css'
import { SmsConsent } from '@/components/SmsConsent'
import { buildSmsConsentText } from '@/lib/content/coast'

const STORAGE_KEY = 'intake_form_progress'

const SERVICES = [
  'Logo Design', 'Flyers', 'EPK / Press Kit', 'Social Graphics', 'Full Rebrand',
  'Brand Identity Guidelines', 'Website Design', 'Pitch Deck', 'Video & Motion',
  'Digital Marketing', 'Social Media Management',
]

const BRAND_VIBES = ['Bold', 'Minimal', 'Luxury', 'Playful', 'Professional', 'Edgy', 'Warm', 'Modern', 'Classic', 'Tech']
const COLOR_PREFS = ['Black/White', 'Earth Tones', 'Bright & Bold', 'Pastels', 'Blues', 'Greens', 'Reds/Oranges', 'Purples', 'Gold/Metallic']
const BUDGETS = ['Under $500', '$500–$1,500', '$1,500–$3,000', '$3,000–$5,000', '$5,000+', 'Monthly Retainer']
const TIMELINES = ['ASAP', 'Within 1 month', '1–3 months', '3–6 months', 'Flexible']

type FormData = {
  fullName: string; email: string; phone: string; businessName: string; website: string
  businessDescription: string; idealCustomer: string; servicesInterested: string[]
  brandVibes: string[]; colorPreferences: string[]; colorsToAvoid: string
  brandsAdmired: string; budget: string; timeline: string; additionalVision: string
  smsTransactional: boolean; smsMarketing: boolean
}

const initial: FormData = {
  fullName: '', email: '', phone: '', businessName: '', website: '',
  businessDescription: '', idealCustomer: '', servicesInterested: [],
  brandVibes: [], colorPreferences: [], colorsToAvoid: '',
  brandsAdmired: '', budget: '', timeline: '', additionalVision: '',
  smsTransactional: false, smsMarketing: false,
}

const steps = ['About You', 'Your Business', 'Services', 'Brand Vision', 'Practical Details']

function toggleArr(arr: string[], val: string) {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
}

export default function IntakePage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<FormData>(initial)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) { try { setForm({ ...initial, ...JSON.parse(saved) }) } catch { } }
    const prefill = localStorage.getItem('inquiry_prefill')
    if (prefill) {
      try {
        const data = JSON.parse(prefill)
        setForm((prev) => ({ ...prev, fullName: data.name || prev.fullName, businessName: data.businessName || prev.businessName, email: data.email || prev.email, phone: data.phone || prev.phone, servicesInterested: data.services || prev.servicesInterested, budget: data.budget || prev.budget, smsTransactional: data.smsTransactional ?? prev.smsTransactional, smsMarketing: data.smsMarketing ?? prev.smsMarketing }))
      } catch { }
    }
  }, [])

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(form)) }, [form])

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/intake', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: form.fullName, email: form.email, phone: form.phone || null, businessName: form.businessName, website: form.website || null, businessDescription: form.businessDescription, idealCustomer: form.idealCustomer, servicesInterested: form.servicesInterested, brandVibes: form.brandVibes, colorPreferences: form.colorPreferences, colorsToAvoid: form.colorsToAvoid || null, brandsAdmired: form.brandsAdmired || null, budget: form.budget, timeline: form.timeline, additionalVision: form.additionalVision || null, smsConsentTransactional: form.smsTransactional, smsConsentMarketing: form.smsMarketing, smsConsentText: buildSmsConsentText(form.smsTransactional, form.smsMarketing), consentSource: '/intake' }),
      })
      if (!res.ok) throw new Error('Submission failed')
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem('inquiry_prefill')
      setSubmitted(true)
    } catch (err) {
      toast.error('Something went wrong. Please try again.' + err)
    } finally { setIsSubmitting(false) }
  }

  if (submitted) {
    return (
      <div className={styles.page}>
        <div className={styles.done}>
          <div className={styles.doneIcon}><Sparkles className="w-9 h-9" /></div>
          <h1 className={styles.doneTitle}>We&apos;re On It</h1>
          <p className={styles.doneSub}>Your intake form has been submitted. Expect a personalized response within 24 hours.</p>
          <button type="button" onClick={() => router.push('/')} className={styles.next}>Back to Home <ArrowRight className="w-4 h-4" /></button>
        </div>
      </div>
    )
  }

  const progress = ((step + 1) / steps.length) * 100

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <span className={styles.eyebrow}>Project Intake</span>
        <h1 className={styles.title}>Tell us about your project</h1>
        <p className={styles.sub}>A few quick steps so we can match you with the right approach. Your progress saves automatically.</p>

        <div className={styles.progress}>
          <div className={styles.progressHead}>
            <span className={styles.progressStep}>Step {step + 1} of {steps.length}</span>
            <span className={styles.progressLabel}>{steps[step]}</span>
          </div>
          <div className={styles.progressTrack}>
            <motion.div className={styles.progressFill} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" className={styles.panel} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <h2 className={styles.panelTitle}>About You</h2>
              <p className={styles.panelSub}>Let&apos;s start with the basics.</p>
              <div className={styles.fields}>
                <div className={styles.row2}>
                  <div className={styles.field}><label className={styles.label}>Full Name *</label><input value={form.fullName} onChange={set('fullName')} placeholder="Jane Doe" className={styles.input} /></div>
                  <div className={styles.field}><label className={styles.label}>Email *</label><input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className={styles.input} /></div>
                </div>
                <div className={styles.field}><label className={styles.label}>Phone</label><input type="tel" value={form.phone} onChange={set('phone')} placeholder="+1 (555) 000-0000" className={styles.input} /></div>
                <div className={styles.field}><label className={styles.label}>Business Name *</label><input value={form.businessName} onChange={set('businessName')} placeholder="Your Business Name" className={styles.input} /></div>
                <div className={styles.field}><label className={styles.label}>Website</label><input type="url" value={form.website} onChange={set('website')} placeholder="https://yoursite.com" className={styles.input} /></div>
              </div>
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="s1" className={styles.panel} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <h2 className={styles.panelTitle}>Your Business</h2>
              <p className={styles.panelSub}>Help us understand what you do and who you serve.</p>
              <div className={styles.fields}>
                <div className={styles.field}><label className={styles.label}>Describe your business *</label><textarea value={form.businessDescription} onChange={set('businessDescription')} placeholder="What does your business do?" rows={4} className={styles.textarea} /></div>
                <div className={styles.field}><label className={styles.label}>Who is your ideal customer?</label><textarea value={form.idealCustomer} onChange={set('idealCustomer')} placeholder="Describe your target audience..." rows={3} className={styles.textarea} /></div>
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="s2" className={styles.panel} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <h2 className={styles.panelTitle}>What do you need?</h2>
              <p className={styles.panelSub}>Select all services you&apos;re interested in.</p>
              <div className={styles.cards}>
                {SERVICES.map((service) => {
                  const sel = form.servicesInterested.includes(service)
                  return (
                    <button key={service} type="button" onClick={() => setForm((p) => ({ ...p, servicesInterested: toggleArr(p.servicesInterested, service) }))} className={styles.card} data-on={sel}>
                      <span>{service}</span>
                      {sel && <span className={styles.check}><Check className="w-3 h-3" /></span>}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="s3" className={styles.panel} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <h2 className={styles.panelTitle}>Brand Vision</h2>
              <p className={styles.panelSub}>Tell us about the feel and look you&apos;re going for.</p>
              <div className={styles.fieldsWide}>
                <div className={styles.group}>
                  <label className={styles.label}>Brand vibes</label>
                  <div className={styles.chips}>
                    {BRAND_VIBES.map((v) => (
                      <button key={v} type="button" onClick={() => setForm((p) => ({ ...p, brandVibes: toggleArr(p.brandVibes, v) }))} className={styles.chip} data-on={form.brandVibes.includes(v)}>{v}</button>
                    ))}
                  </div>
                </div>
                <div className={styles.group}>
                  <label className={styles.label}>Color preferences</label>
                  <div className={styles.chips}>
                    {COLOR_PREFS.map((c) => (
                      <button key={c} type="button" onClick={() => setForm((p) => ({ ...p, colorPreferences: toggleArr(p.colorPreferences, c) }))} className={styles.chip} data-on={form.colorPreferences.includes(c)}>{c}</button>
                    ))}
                  </div>
                </div>
                <div className={styles.field}><label className={styles.label}>Colors to avoid</label><input value={form.colorsToAvoid} onChange={set('colorsToAvoid')} placeholder="Any colors you want to avoid?" className={styles.input} /></div>
                <div className={styles.field}><label className={styles.label}>Brands you admire</label><textarea value={form.brandsAdmired} onChange={set('brandsAdmired')} placeholder="List brands whose design you love..." rows={3} className={styles.textarea} /></div>
              </div>
            </motion.div>
          )}
          {step === 4 && (
            <motion.div key="s4" className={styles.panel} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <h2 className={styles.panelTitle}>Practical Details</h2>
              <p className={styles.panelSub}>Almost there! Just a few more details.</p>
              <div className={styles.fieldsWide}>
                <div className={styles.group}>
                  <label className={styles.label}>Budget range</label>
                  <div className={styles.cards}>
                    {BUDGETS.map((b) => (
                      <button key={b} type="button" onClick={() => setForm((p) => ({ ...p, budget: b }))} className={styles.card} data-on={form.budget === b}>
                        <span>{b}</span>
                        {form.budget === b && <span className={styles.check}><Check className="w-3 h-3" /></span>}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.group}>
                  <label className={styles.label}>Timeline</label>
                  <div className={styles.chips}>
                    {TIMELINES.map((t) => (
                      <button key={t} type="button" onClick={() => setForm((p) => ({ ...p, timeline: t }))} className={styles.chip} data-on={form.timeline === t}>{t}</button>
                    ))}
                  </div>
                </div>
                <div className={styles.field}><label className={styles.label}>Anything else?</label><textarea value={form.additionalVision} onChange={set('additionalVision')} placeholder="Any additional context or notes..." rows={4} className={styles.textarea} /></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.nav}>
          {step > 0 ? (
            <button type="button" onClick={() => setStep(step - 1)} className={styles.back}><ArrowLeft className="h-4 w-4" /> Back</button>
          ) : <span />}
          {step < steps.length - 1 ? (
            <button type="button" onClick={() => setStep(step + 1)} className={styles.next}>Continue <ArrowRight className="h-4 w-4" /></button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={isSubmitting || !form.fullName || !form.email || !form.businessName} className={styles.next}>{isSubmitting ? 'Submitting...' : 'Submit Intake Form'}<Sparkles className="h-4 w-4" /></button>
          )}
        </div>
        {step === steps.length - 1 && (
          <SmsConsent
            transactional={form.smsTransactional}
            marketing={form.smsMarketing}
            onChange={(f, v) => setForm((p) => ({ ...p, [f === 'transactional' ? 'smsTransactional' : 'smsMarketing']: v }))}
            className="mt-6 mx-auto max-w-xl"
          />
        )}
      </div>
    </div>
  )
}
