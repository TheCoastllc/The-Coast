'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CalendlyButton } from '@/components/CalendlyButton'
import { COMPANY } from '@/lib/content/coast'
import styles from './contact-page.module.css'

/** Shared with /api/contact (labels are re-derived server-side from the value). */
export const CONTACT_TOPICS = [
  { value: 'brand', label: 'Brand identity' },
  { value: 'website', label: 'Website' },
  { value: 'marketing', label: 'Growth marketing' },
  { value: 'ai', label: 'AI & automation' },
  { value: 'other', label: 'Something else' },
] as const
type Topic = (typeof CONTACT_TOPICS)[number]['value']

type Field = 'name' | 'email' | 'message'
type Errors = Partial<Record<Field, string>>
type Status = 'idle' | 'sending' | 'sent' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(v: Record<Field, string>): Errors {
  const e: Errors = {}
  if (!v.name.trim()) e.name = 'Please add your name.'
  if (!v.email.trim()) e.email = 'Please add your email.'
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'That email address doesn’t look right.'
  if (!v.message.trim()) e.message = 'Tell us a little about the project.'
  return e
}

function trackLead(topic: string) {
  const w = window as unknown as {
    gtag?: (...a: unknown[]) => void
    fbq?: (...a: unknown[]) => void
  }
  try {
    w.gtag?.('event', 'generate_lead', { method: 'contact_form', topic: topic || 'unspecified' })
    w.fbq?.('track', 'Lead', { content_name: 'contact_form' })
  } catch {}
}

/**
 * The contact form. Posts to /api/contact (Payload `contact-submissions` +
 * admin email). Spam defence is a honeypot field plus time-on-form; both are
 * checked server-side and bots get a silent 200.
 */
export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [topic, setTopic] = useState<Topic | ''>('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const startedAt = useRef(0)

  useEffect(() => {
    startedAt.current = Date.now()
    // /contact?topic=website lets service pages deep-link with the select prefilled
    try {
      const t = new URLSearchParams(window.location.search).get('topic')
      if (t && CONTACT_TOPICS.some((o) => o.value === t)) setTopic(t as Topic)
    } catch {}
  }, [])

  const values = { name, email, message }
  const shown = (k: Field) => (touched[k] ? errors[k] : undefined)
  const onBlur = (k: Field) => {
    setTouched((t) => ({ ...t, [k]: true }))
    setErrors(validate(values))
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const form = ev.currentTarget
    const errs = validate(values)
    setErrors(errs)
    setTouched({ name: true, email: true, message: true })
    const firstBad = (Object.keys(errs) as Field[])[0]
    if (firstBad) {
      form.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus()
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          company: company.trim() || undefined,
          topic: topic || undefined,
          website,
          elapsed: Date.now() - startedAt.current,
        }),
      })
      if (!res.ok) throw new Error(`contact ${res.status}`)
      setStatus('sent')
      trackLead(topic)
    } catch {
      setStatus('error')
    }
  }

  function reset() {
    setName('')
    setEmail('')
    setCompany('')
    setTopic('')
    setMessage('')
    setWebsite('')
    setErrors({})
    setTouched({})
    setStatus('idle')
    startedAt.current = Date.now()
  }

  if (status === 'sent') {
    const first = name.trim().split(/\s+/)[0] || 'there'
    return (
      <div className={styles.done} role="status" aria-live="polite">
        <h2 className={`${styles.doneTitle} no-marble`}>Message sent.</h2>
        <p className={styles.doneBody}>
          Thanks, {first}. We&rsquo;ll reply to {email.trim()} within 24 hours.
        </p>
        <div className={styles.doneActions}>
          <CalendlyButton variant="ghost" size="sm">
            Want to talk sooner? Book a call
          </CalendlyButton>
          <button type="button" className={styles.linkBtn} onClick={reset}>
            Send another message
          </button>
        </div>
      </div>
    )
  }

  const sending = status === 'sending'

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.row2}>
        <div className={styles.field}>
          <label htmlFor="c-name" className={styles.label}>
            Name
          </label>
          <input
            id="c-name"
            name="name"
            className={styles.input}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => onBlur('name')}
            aria-invalid={shown('name') ? true : undefined}
            aria-describedby={shown('name') ? 'c-name-err' : undefined}
            required
          />
          {shown('name') && (
            <p id="c-name-err" className={styles.err}>
              {errors.name}
            </p>
          )}
        </div>
        <div className={styles.field}>
          <label htmlFor="c-email" className={styles.label}>
            Email
          </label>
          <input
            id="c-email"
            name="email"
            type="email"
            inputMode="email"
            className={styles.input}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => onBlur('email')}
            aria-invalid={shown('email') ? true : undefined}
            aria-describedby={shown('email') ? 'c-email-err' : undefined}
            required
          />
          {shown('email') && (
            <p id="c-email-err" className={styles.err}>
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label htmlFor="c-company" className={styles.label}>
            Company <span>(optional)</span>
          </label>
          <input
            id="c-company"
            name="company"
            className={styles.input}
            autoComplete="organization"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="c-topic" className={styles.label}>
            What do you need? <span>(optional)</span>
          </label>
          <select
            id="c-topic"
            name="topic"
            className={styles.input}
            value={topic}
            onChange={(e) => setTopic(e.target.value as Topic | '')}
          >
            <option value="">Choose one</option>
            {CONTACT_TOPICS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="c-message" className={styles.label}>
          Message
        </label>
        <textarea
          id="c-message"
          name="message"
          className={styles.input}
          rows={5}
          placeholder="What are you building, and when do you need it?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onBlur={() => onBlur('message')}
          aria-invalid={shown('message') ? true : undefined}
          aria-describedby={shown('message') ? 'c-message-err' : undefined}
          required
        />
        {shown('message') && (
          <p id="c-message-err" className={styles.err}>
            {errors.message}
          </p>
        )}
      </div>

      {/* honeypot - humans never see or reach this; bots fill it */}
      <div className={styles.hp} aria-hidden="true">
        <label htmlFor="c-website">Website</label>
        <input
          id="c-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {status === 'error' && (
        <p className={styles.formError} role="alert">
          We couldn&rsquo;t send that. Try again, or email{' '}
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> directly.
        </p>
      )}

      <div className={styles.actions}>
        <button type="submit" className={styles.submit} disabled={sending}>
          {sending ? 'Sending…' : 'Send message'}
        </button>
        <p className={styles.fine}>We reply within 24 hours.</p>
      </div>
    </form>
  )
}
