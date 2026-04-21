'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Loader2, Check, ArrowRight, AlertCircle } from 'lucide-react'
import { z } from 'zod'

const inquiryOptions = [
  { id: 'new-project', label: 'New Project' },
  { id: 'existing-client', label: 'Existing Client' },
  { id: 'partnership', label: 'Partnership' },
  { id: 'press', label: 'Press / Media' },
  { id: 'careers', label: 'Careers' },
  { id: 'other', label: 'Other' },
]

const budgetOptions = [
  'Not sure yet',
  'Under $500',
  '$500 – $1,500',
  '$1,500 – $3,000',
  '$3,000+',
]

const timelineOptions = [
  'Flexible',
  'This month',
  '1–2 months',
  '3+ months',
]

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Your name is required').max(200),
  email: z.string().trim().email('Enter a valid email'),
  message: z.string().trim().min(10, 'Tell us a little more (10+ characters)').max(5000),
})

type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>

const inputClass =
  'w-full px-4 py-3 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors'

const labelClass = 'text-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2'

export default function ContactClient() {
  const [inquiryType, setInquiryType] = useState('new-project')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [budget, setBudget] = useState('')
  const [timeline, setTimeline] = useState('')
  const [message, setMessage] = useState('')
  const [hearAbout, setHearAbout] = useState('')
  const [consent, setConsent] = useState(false)

  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const buildMessage = () => {
    const typeLabel = inquiryOptions.find((o) => o.id === inquiryType)?.label ?? 'Other'
    const lines = [
      `Inquiry Type: ${typeLabel}`,
      subject && `Subject: ${subject}`,
      company && `Company: ${company}`,
      phone && `Phone: ${phone}`,
      budget && `Budget: ${budget}`,
      timeline && `Timeline: ${timeline}`,
      hearAbout && `Heard about us via: ${hearAbout}`,
      '',
      '— Message —',
      message,
    ].filter(Boolean)
    return lines.join('\n')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setErrorMessage('')

    if (!consent) {
      setErrorMessage('Please confirm you agree to be contacted before sending.')
      return
    }

    const result = contactSchema.safeParse({ name, email, message })
    if (!result.success) {
      const fieldErrors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FieldErrors
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setStatus('submitting')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: buildMessage(),
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || 'Something went wrong. Please try again.')
      }

      setStatus('success')
      setName('')
      setEmail('')
      setCompany('')
      setPhone('')
      setSubject('')
      setBudget('')
      setTimeline('')
      setMessage('')
      setHearAbout('')
      setConsent(false)
      setInquiryType('new-project')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="border border-primary/30 bg-primary/5 rounded-xl p-8 md:p-10 text-center"
      >
        <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-5">
          <Check className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-heading text-2xl md:text-3xl text-foreground mb-3">Message received.</h3>
        <p className="text-body text-muted-foreground text-sm md:text-base max-w-md mx-auto mb-6">
          Thanks for reaching out. A real human from The Coast will get back to you within one business day —
          usually sooner. Check your inbox (and spam, just in case).
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="inline-flex items-center gap-2 text-mono text-xs uppercase tracking-[0.2em] text-primary hover:text-foreground transition-colors"
        >
          Send another message <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7" noValidate>
      {/* Inquiry type */}
      <div>
        <label className={labelClass}>What&apos;s this about? *</label>
        <div className="flex flex-wrap gap-2">
          {inquiryOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setInquiryType(opt.id)}
              className={`px-3.5 py-1.5 rounded-full text-sm transition-colors ${
                inquiryType === opt.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Your Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className={inputClass}
            autoComplete="name"
          />
          {errors.name && <p className="text-red-400 text-xs font-mono mt-1.5">{errors.name}</p>}
        </div>
        <div>
          <label className={labelClass}>Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
            autoComplete="email"
          />
          {errors.email && <p className="text-red-400 text-xs font-mono mt-1.5">{errors.email}</p>}
        </div>
      </div>

      {/* Company + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Company / Brand</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme Inc."
            className={inputClass}
            autoComplete="organization"
          />
        </div>
        <div>
          <label className={labelClass}>Phone (optional)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            className={inputClass}
            autoComplete="tel"
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className={labelClass}>Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Rebrand for a fitness app launching in Q3"
          className={inputClass}
          maxLength={150}
        />
      </div>

      {/* Budget + Timeline (only for project-ish inquiries) */}
      {(inquiryType === 'new-project' || inquiryType === 'existing-client' || inquiryType === 'partnership') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Budget Range</label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={inputClass}
            >
              <option value="">Select one</option>
              {budgetOptions.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Timeline</label>
            <select
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className={inputClass}
            >
              <option value="">Select one</option>
              {timelineOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Message */}
      <div>
        <label className={labelClass}>Message *</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your goals, constraints, and what a win looks like. Links welcome."
          rows={6}
          className={`${inputClass} resize-y min-h-[140px]`}
          maxLength={5000}
        />
        <div className="flex items-center justify-between mt-1.5">
          {errors.message ? (
            <p className="text-red-400 text-xs font-mono">{errors.message}</p>
          ) : (
            <span className="text-xs text-muted-foreground/60">The more specific, the better.</span>
          )}
          <span className="text-xs text-muted-foreground/50 font-mono tabular-nums">{message.length}/5000</span>
        </div>
      </div>

      {/* Where did you hear about us */}
      <div>
        <label className={labelClass}>How&apos;d you find us? (optional)</label>
        <input
          type="text"
          value={hearAbout}
          onChange={(e) => setHearAbout(e.target.value)}
          placeholder="Referral, Instagram, Google, podcast…"
          className={inputClass}
        />
      </div>

      {/* Consent */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 w-4 h-4 accent-primary cursor-pointer"
        />
        <span className="text-xs text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
          I agree to be contacted by The Coast about my inquiry and have read the{' '}
          <a href="/privacy" className="text-foreground hover:text-primary underline underline-offset-4">privacy policy</a>.
        </span>
      </label>

      {/* Error */}
      {status === 'error' && errorMessage && (
        <div className="flex items-start gap-2 text-red-400 text-sm border border-red-400/30 bg-red-400/5 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-mono text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send Message
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-xs text-muted-foreground/50">
        Prefer email? Write to{' '}
        <a href="mailto:hello@coastglobal.org" className="text-foreground hover:text-primary underline underline-offset-4">
          hello@coastglobal.org
        </a>
        .
      </p>
    </form>
  )
}
