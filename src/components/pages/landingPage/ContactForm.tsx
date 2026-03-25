'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Loader2, Check } from 'lucide-react'
import { ShineButton } from '@/components/ui/ShineButton'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(1, 'Message is required'),
})

type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setErrorMessage('')

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
        body: JSON.stringify({ name, email, message }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || 'Something went wrong')
      }

      setStatus('success')
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-4 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <p className="text-xl font-display uppercase tracking-tight">Message Sent</p>
        <p className="text-white/50 text-sm">We&apos;ll get back to you soon.</p>
        <button
          onClick={() => setStatus('idle')}
          className="text-primary text-xs uppercase tracking-[0.2em] font-mono mt-4 hover:underline"
        >
          Send another message
        </button>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="flex flex-col gap-8"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-mono">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-transparent border-b border-white/10 pb-4 text-white focus:outline-none focus:border-primary transition-colors rounded-none"
          placeholder="John Doe"
        />
        {errors.name && <span className="text-red-400 text-xs font-mono">{errors.name}</span>}
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-mono">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-transparent border-b border-white/10 pb-4 text-white focus:outline-none focus:border-primary transition-colors rounded-none"
          placeholder="john@example.com"
        />
        {errors.email && <span className="text-red-400 text-xs font-mono">{errors.email}</span>}
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-mono">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="bg-transparent border-b border-white/10 pb-4 text-white focus:outline-none focus:border-primary transition-colors resize-none h-24 rounded-none"
          placeholder="Tell us about your project..."
        />
        {errors.message && <span className="text-red-400 text-xs font-mono">{errors.message}</span>}
      </div>

      {status === 'error' && (
        <p className="text-red-400 text-xs font-mono">{errorMessage}</p>
      )}

      <ShineButton full size='md' type="submit">
        {status === 'submitting' ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </span>
        ) : (
          'Send Message'
        )}
      </ShineButton>
    </motion.form>
  )
}
