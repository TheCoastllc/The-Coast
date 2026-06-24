'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import styles from '../intake.module.css'
import { SmsConsent } from '@/components/SmsConsent'
import { buildSmsConsentText } from '@/lib/content/coast'

const EVENT_TYPES = [
  'Corporate Event', 'Product Launch', 'Concert / Show', 'Wedding',
  'Birthday / Celebration', 'Networking Event', 'Conference', 'Other',
]

const SERVICES = [
  'Event Branding', 'Stage Design', 'Signage & Banners', 'Social Media Coverage',
  'Video Production', 'Photography', 'Merchandise Design', 'Promotional Materials',
  'Live Streaming Setup', 'Post-Event Recap',
]

const BUDGETS = ['Under $1,000', '$1,000–$3,000', '$3,000–$7,500', '$7,500–$15,000', '$15,000+', 'TBD / Flexible']
const TIMELINES = ['Less than 2 weeks', '2–4 weeks', '1–2 months', '3+ months', 'Flexible']

const steps = ['About the Event', 'Services Needed', 'Details & Timeline']

function toggleArr(arr: string[], val: string) {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
}

export default function ExperienceIntakePage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Form state
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [eventName, setEventName] = useState('')
  const [eventType, setEventType] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventLocation, setEventLocation] = useState('')
  const [attendees, setAttendees] = useState('')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [budget, setBudget] = useState('')
  const [timeline, setTimeline] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [smsTransactional, setSmsTransactional] = useState(false)
  const [smsMarketing, setSmsMarketing] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/intake/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName,
          email,
          phone: phone || null,
          eventName,
          eventType,
          eventDate: eventDate || null,
          eventLocation: eventLocation || null,
          expectedAttendees: attendees || null,
          servicesNeeded: selectedServices,
          budget,
          timeline,
          eventDescription,
          additionalNotes: additionalNotes || null,
          smsConsentTransactional: smsTransactional,
          smsConsentMarketing: smsMarketing,
          smsConsentText: buildSmsConsentText(smsTransactional, smsMarketing),
          consentSource: '/intake/experience',
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className={styles.page}>
        <div className={styles.done}>
          <div className={styles.doneIcon}><Sparkles className="w-9 h-9" /></div>
          <h1 className={styles.doneTitle}>Request Received</h1>
          <p className={styles.doneSub}>We&apos;ll review your event brief and reach out within 24 hours with next steps.</p>
          <button type="button" onClick={() => router.push('/')} className={styles.next}>Back to Home <ArrowRight className="w-4 h-4" /></button>
        </div>
      </div>
    )
  }

  const progress = ((step + 1) / steps.length) * 100

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <span className={styles.eyebrow}>Experience Intake</span>
        <h1 className={styles.title}>Let&apos;s plan your event</h1>
        <p className={styles.sub}>Tell us about your event and how we can make it unforgettable.</p>

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
              <h2 className={styles.panelTitle}>About the Event</h2>
              <p className={styles.panelSub}>The essentials so we understand the shape of the day.</p>
              <div className={styles.fields}>
                <div className={styles.row2}>
                  <div className={styles.field}>
                    <label className={styles.label}>Your Name *</label>
                    <input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Jane Doe" className={styles.input} />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Email *</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={styles.input} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className={styles.input} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Event Name *</label>
                  <input value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="e.g. Spring Gala 2026" className={styles.input} />
                </div>
                <div className={styles.group}>
                  <label className={styles.label}>Event Type</label>
                  <div className={styles.chips}>
                    {EVENT_TYPES.map((type) => (
                      <button key={type} type="button" onClick={() => setEventType(type)} className={styles.chip} data-on={eventType === type}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.row2}>
                  <div className={styles.field}>
                    <label className={styles.label}>Event Date</label>
                    <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className={styles.input} />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Expected Attendees</label>
                    <input value={attendees} onChange={(e) => setAttendees(e.target.value)} placeholder="e.g. 200" className={styles.input} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Event Location</label>
                  <input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="City, Venue, or Virtual" className={styles.input} />
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" className={styles.panel} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <h2 className={styles.panelTitle}>Services Needed</h2>
              <p className={styles.panelSub}>Select all services you need for your event.</p>
              <div className={styles.cards}>
                {SERVICES.map((service) => {
                  const isSelected = selectedServices.includes(service)
                  return (
                    <button key={service} type="button" onClick={() => setSelectedServices(toggleArr(selectedServices, service))} className={styles.card} data-on={isSelected}>
                      <span>{service}</span>
                      {isSelected && <span className={styles.check}><Check className="w-3 h-3" /></span>}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" className={styles.panel} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <h2 className={styles.panelTitle}>Details & Timeline</h2>
              <p className={styles.panelSub}>Final details to help us plan accordingly.</p>
              <div className={styles.fieldsWide}>
                <div className={styles.group}>
                  <label className={styles.label}>Budget Range</label>
                  <div className={styles.cards}>
                    {BUDGETS.map((b) => (
                      <button key={b} type="button" onClick={() => setBudget(b)} className={styles.card} data-on={budget === b}>
                        <span>{b}</span>
                        {budget === b && <span className={styles.check}><Check className="w-3 h-3" /></span>}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.group}>
                  <label className={styles.label}>How soon do you need us?</label>
                  <div className={styles.chips}>
                    {TIMELINES.map((t) => (
                      <button key={t} type="button" onClick={() => setTimeline(t)} className={styles.chip} data-on={timeline === t}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Event Description *</label>
                  <textarea value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} placeholder="Tell us more about your event, goals, and vision..." rows={4} className={styles.textarea} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Additional Notes</label>
                  <textarea value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} placeholder="Any other context for our team..." rows={3} className={styles.textarea} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.nav}>
          {step > 0 ? (
            <button type="button" onClick={() => setStep(step - 1)} className={styles.back}>
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <span />
          )}
          {step < steps.length - 1 ? (
            <button type="button" onClick={() => setStep(step + 1)} className={styles.next}>
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={isSubmitting || !contactName || !email || !eventName} className={styles.next}>
              {isSubmitting ? 'Submitting...' : 'Submit'} <Sparkles className="h-4 w-4" />
            </button>
          )}
        </div>
        {step === steps.length - 1 && (
          <SmsConsent
            transactional={smsTransactional}
            marketing={smsMarketing}
            onChange={(f, v) => (f === 'transactional' ? setSmsTransactional(v) : setSmsMarketing(v))}
            className="mt-6 mx-auto max-w-xl"
          />
        )}
      </div>
    </div>
  )
}
