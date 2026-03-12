'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { BlueprintLayout } from '@/components/blueprint-layout'

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

const inputClass = 'w-full px-4 py-3 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors'
const textareaClass = `${inputClass} resize-none`

type FormData = {
  fullName: string; email: string; phone: string; businessName: string; website: string
  businessDescription: string; idealCustomer: string; servicesInterested: string[]
  brandVibes: string[]; colorPreferences: string[]; colorsToAvoid: string
  brandsAdmired: string; budget: string; timeline: string; additionalVision: string
}

const initial: FormData = {
  fullName: '', email: '', phone: '', businessName: '', website: '',
  businessDescription: '', idealCustomer: '', servicesInterested: [],
  brandVibes: [], colorPreferences: [], colorsToAvoid: '',
  brandsAdmired: '', budget: '', timeline: '', additionalVision: '',
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
    if (saved) { try { setForm({ ...initial, ...JSON.parse(saved) }) } catch {} }
    const prefill = localStorage.getItem('inquiry_prefill')
    if (prefill) {
      try {
        const data = JSON.parse(prefill)
        setForm((prev) => ({ ...prev, fullName: data.name || prev.fullName, businessName: data.businessName || prev.businessName, email: data.email || prev.email, phone: data.phone || prev.phone, servicesInterested: data.services || prev.servicesInterested, budget: data.budget || prev.budget }))
      } catch {}
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
        body: JSON.stringify({ fullName: form.fullName, email: form.email, phone: form.phone || null, businessName: form.businessName, website: form.website || null, businessDescription: form.businessDescription, idealCustomer: form.idealCustomer, servicesInterested: form.servicesInterested, brandVibes: form.brandVibes, colorPreferences: form.colorPreferences, colorsToAvoid: form.colorsToAvoid || null, brandsAdmired: form.brandsAdmired || null, budget: form.budget, timeline: form.timeline, additionalVision: form.additionalVision || null }),
      })
      if (!res.ok) throw new Error('Submission failed')
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem('inquiry_prefill')
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Please try again.')
    } finally { setIsSubmitting(false) }
  }

  if (submitted) {
    return (
      <BlueprintLayout>
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"><Sparkles className="w-10 h-10 text-primary" /></div>
          <h1 className="text-heading text-4xl md:text-5xl mb-4">We&apos;re On It!</h1>
          <p className="text-body text-muted-foreground text-lg max-w-md mb-8">Your intake form has been submitted. Expect a personalized response within 24 hours.</p>
          <button onClick={() => router.push('/')} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-mono text-sm hover:bg-primary/90 transition-colors">Back to Home <ArrowRight className="w-4 h-4" /></button>
        </div>
      </BlueprintLayout>
    )
  }

  const progress = ((step + 1) / steps.length) * 100

  return (
    <BlueprintLayout>
      <section className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-mono text-sm text-muted-foreground">Step {step + 1} of {steps.length}</span>
              <span className="text-mono text-sm text-primary">{steps[step]}</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <h1 className="text-heading text-3xl md:text-4xl text-foreground mb-2">About You</h1>
                <p className="text-body text-muted-foreground mb-8">Let&apos;s start with the basics.</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium text-foreground block mb-1.5">Full Name *</label><input value={form.fullName} onChange={set('fullName')} placeholder="Jane Doe" className={inputClass} /></div>
                    <div><label className="text-sm font-medium text-foreground block mb-1.5">Email *</label><input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className={inputClass} /></div>
                  </div>
                  <div><label className="text-sm font-medium text-foreground block mb-1.5">Phone</label><input type="tel" value={form.phone} onChange={set('phone')} placeholder="+1 (555) 000-0000" className={inputClass} /></div>
                  <div><label className="text-sm font-medium text-foreground block mb-1.5">Business Name *</label><input value={form.businessName} onChange={set('businessName')} placeholder="Your Business Name" className={inputClass} /></div>
                  <div><label className="text-sm font-medium text-foreground block mb-1.5">Website</label><input type="url" value={form.website} onChange={set('website')} placeholder="https://yoursite.com" className={inputClass} /></div>
                </div>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <h2 className="text-heading text-3xl md:text-4xl text-foreground mb-2">Your Business</h2>
                <p className="text-body text-muted-foreground mb-8">Help us understand what you do and who you serve.</p>
                <div className="space-y-4">
                  <div><label className="text-sm font-medium text-foreground block mb-1.5">Describe your business *</label><textarea value={form.businessDescription} onChange={set('businessDescription')} placeholder="What does your business do?" rows={4} className={textareaClass} /></div>
                  <div><label className="text-sm font-medium text-foreground block mb-1.5">Who is your ideal customer?</label><textarea value={form.idealCustomer} onChange={set('idealCustomer')} placeholder="Describe your target audience..." rows={3} className={textareaClass} /></div>
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <h2 className="text-heading text-3xl md:text-4xl text-foreground mb-2">What do you need?</h2>
                <p className="text-body text-muted-foreground mb-8">Select all services you&apos;re interested in.</p>
                <div className="grid grid-cols-2 gap-3">
                  {SERVICES.map((service) => {
                    const sel = form.servicesInterested.includes(service)
                    return <button key={service} onClick={() => setForm((p) => ({ ...p, servicesInterested: toggleArr(p.servicesInterested, service) }))} className={`p-3 rounded-xl border text-sm text-left transition-all duration-200 flex items-center gap-2 ${sel ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-card text-muted-foreground hover:border-primary/40'}`}>{sel && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}{service}</button>
                  })}
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <h2 className="text-heading text-3xl md:text-4xl text-foreground mb-2">Brand Vision</h2>
                <p className="text-body text-muted-foreground mb-8">Tell us about the feel and look you&apos;re going for.</p>
                <div className="space-y-6">
                  <div><label className="text-sm font-medium text-foreground block mb-2">Brand vibes</label><div className="flex flex-wrap gap-2">{BRAND_VIBES.map((v) => { const s = form.brandVibes.includes(v); return <button key={v} onClick={() => setForm((p) => ({ ...p, brandVibes: toggleArr(p.brandVibes, v) }))} className={`px-3 py-1.5 rounded-full text-sm transition-colors ${s ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:border-primary/50'}`}>{v}</button> })}</div></div>
                  <div><label className="text-sm font-medium text-foreground block mb-2">Color preferences</label><div className="flex flex-wrap gap-2">{COLOR_PREFS.map((c) => { const s = form.colorPreferences.includes(c); return <button key={c} onClick={() => setForm((p) => ({ ...p, colorPreferences: toggleArr(p.colorPreferences, c) }))} className={`px-3 py-1.5 rounded-full text-sm transition-colors ${s ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:border-primary/50'}`}>{c}</button> })}</div></div>
                  <div><label className="text-sm font-medium text-foreground block mb-1.5">Colors to avoid</label><input value={form.colorsToAvoid} onChange={set('colorsToAvoid')} placeholder="Any colors you want to avoid?" className={inputClass} /></div>
                  <div><label className="text-sm font-medium text-foreground block mb-1.5">Brands you admire</label><textarea value={form.brandsAdmired} onChange={set('brandsAdmired')} placeholder="List brands whose design you love..." rows={3} className={textareaClass} /></div>
                </div>
              </motion.div>
            )}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <h2 className="text-heading text-3xl md:text-4xl text-foreground mb-2">Practical Details</h2>
                <p className="text-body text-muted-foreground mb-8">Almost there! Just a few more details.</p>
                <div className="space-y-6">
                  <div><label className="text-sm font-medium text-foreground block mb-2">Budget range</label><div className="grid grid-cols-2 gap-2">{BUDGETS.map((b) => <button key={b} onClick={() => setForm((p) => ({ ...p, budget: b }))} className={`p-3 rounded-xl border text-sm text-left transition-all ${form.budget === b ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-card text-muted-foreground hover:border-primary/40'}`}>{b}</button>)}</div></div>
                  <div><label className="text-sm font-medium text-foreground block mb-2">Timeline</label><div className="flex flex-wrap gap-2">{TIMELINES.map((t) => <button key={t} onClick={() => setForm((p) => ({ ...p, timeline: t }))} className={`px-3 py-1.5 rounded-full text-sm transition-colors ${form.timeline === t ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:border-primary/50'}`}>{t}</button>)}</div></div>
                  <div><label className="text-sm font-medium text-foreground block mb-1.5">Anything else?</label><textarea value={form.additionalVision} onChange={set('additionalVision')} placeholder="Any additional context or notes..." rows={4} className={textareaClass} /></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-10">
            {step > 0 ? <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="h-4 w-4" /> Back</button> : <div />}
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(step + 1)} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-mono text-sm hover:bg-primary/90 transition-colors">Continue <ArrowRight className="h-4 w-4" /></button>
            ) : (
              <button onClick={handleSubmit} disabled={isSubmitting || !form.fullName || !form.email || !form.businessName} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-mono text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">{isSubmitting ? 'Submitting...' : 'Submit Intake Form'}<Sparkles className="h-4 w-4" /></button>
            )}
          </div>
        </div>
      </section>
    </BlueprintLayout>
  )
}
