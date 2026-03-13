'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import TextReveal from '@/components/TextReveal'

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

const inputClass = 'w-full px-4 py-3 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors'
const textareaClass = `${inputClass} resize-none`

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
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <TextReveal as="h1" className="text-heading text-4xl md:text-5xl mb-4">Request Received!</TextReveal>
          <p className="text-body text-muted-foreground text-lg max-w-md mb-8">
            We&apos;ll review your event brief and reach out within 24 hours with next steps.
          </p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-mono text-sm hover:bg-primary/90 transition-colors"
          >
            Back to Home <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    )
  }

  const progress = ((step + 1) / steps.length) * 100

  return (
    <main className="min-h-screen bg-background">
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
                <TextReveal as="h1" className="text-heading text-3xl md:text-4xl text-foreground mb-2">Experience Intake</TextReveal>
                <p className="text-body text-muted-foreground mb-8">Tell us about your event and how we can make it unforgettable.</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Your Name *</label>
                      <input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Jane Doe" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Email *</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Phone</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Event Name *</label>
                    <input value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="e.g. Spring Gala 2026" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Event Type</label>
                    <div className="flex flex-wrap gap-2">
                      {EVENT_TYPES.map((type) => (
                        <button key={type} onClick={() => setEventType(type)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${eventType === type ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:border-primary/50'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Event Date</label>
                      <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Expected Attendees</label>
                      <input value={attendees} onChange={(e) => setAttendees(e.target.value)} placeholder="e.g. 200" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Event Location</label>
                    <input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="City, Venue, or Virtual" className={inputClass} />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <h2 className="text-heading text-3xl md:text-4xl text-foreground mb-2">Services Needed</h2>
                <p className="text-body text-muted-foreground mb-8">Select all services you need for your event.</p>
                <div className="grid grid-cols-2 gap-3">
                  {SERVICES.map((service) => {
                    const isSelected = selectedServices.includes(service)
                    return (
                      <button key={service}
                        onClick={() => setSelectedServices(toggleArr(selectedServices, service))}
                        className={`p-3 rounded-xl border text-sm text-left transition-all ${isSelected ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-card text-muted-foreground hover:border-primary/40'}`}
                      >
                        {service}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <h2 className="text-heading text-3xl md:text-4xl text-foreground mb-2">Details & Timeline</h2>
                <p className="text-body text-muted-foreground mb-8">Final details to help us plan accordingly.</p>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Budget Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      {BUDGETS.map((b) => (
                        <button key={b} onClick={() => setBudget(b)}
                          className={`p-3 rounded-xl border text-sm text-left transition-all ${budget === b ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-card text-muted-foreground hover:border-primary/40'}`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">How soon do you need us?</label>
                    <div className="flex flex-wrap gap-2">
                      {TIMELINES.map((t) => (
                        <button key={t} onClick={() => setTimeline(t)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${timeline === t ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:border-primary/50'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Event Description *</label>
                    <textarea value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} placeholder="Tell us more about your event, goals, and vision..." rows={4} className={textareaClass} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Additional Notes</label>
                    <textarea value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} placeholder="Any other context for our team..." rows={3} className={textareaClass} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-10">
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : (
              <div />
            )}
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(step + 1)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-mono text-sm hover:bg-primary/90 transition-colors"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !contactName || !email || !eventName}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-mono text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'} <Sparkles className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
