'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useClientAuth } from '@/hooks/use-client-auth'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, ArrowRight, Check, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const serviceTypes = [
  { value: 'logo', label: 'Logo Design', emoji: '🎨' },
  { value: 'flyer', label: 'Flyer', emoji: '📄' },
  { value: 'epk', label: 'EPK / Press Kit', emoji: '📋' },
  { value: 'social', label: 'Social Graphics', emoji: '📱' },
  { value: 'website', label: 'Website', emoji: '🌐' },
  { value: 'rebrand', label: 'Full Rebrand', emoji: '✨' },
  { value: 'other', label: 'Other', emoji: '📦' },
]

export default function SubmitRequestPage() {
  const { client } = useClientAuth()
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serviceType, setServiceType] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [references, setReferences] = useState('')
  const [priority, setPriority] = useState('normal')
  const [files, setFiles] = useState<File[]>([])

  if (!client) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!serviceType || !title.trim() || !description.trim()) return
    setIsSubmitting(true)

    try {
      const uploadedFileUrls: string[] = []
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file, file.name)
        const res = await fetch('/api/portal/upload', { method: 'POST', body: formData })
        if (res.ok) {
          const data = await res.json()
          if (data?.url) uploadedFileUrls.push(data.url)
        }
      }

      const fullDescription = [
        description.trim(),
        references.trim() ? `\n\nReferences/Inspiration:\n${references.trim()}` : '',
        uploadedFileUrls.length > 0 ? `\n\nAttached files: ${uploadedFileUrls.join(', ')}` : '',
      ].join('')

      const res = await fetch('/api/portal/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: fullDescription,
          serviceType,
          priority,
        }),
      })
      if (!res.ok) throw new Error('Failed to submit request')

      toast.success('Request submitted successfully!')
      router.push('/portal')
    } catch (err) {
      toast.error('Failed to submit request. Please try again.' + err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = 'w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50'

  return (
    <>
      <div className="mb-6">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : router.push('/portal')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {step > 1 ? 'Back' : 'Back to Dashboard'}
        </button>
        <h1 className="text-2xl font-bold text-foreground">Submit a Request</h1>
        <p className="text-muted-foreground mt-1">Tell us what you need and we&apos;ll get started</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
              s < step ? 'bg-primary text-primary-foreground' :
                s === step ? 'bg-primary/20 text-primary border border-primary/50' :
                  'bg-muted text-muted-foreground'
            )}>
              {s < step ? <Check className="h-4 w-4" /> : s}
            </div>
            <span className="text-xs text-muted-foreground hidden sm:block">
              {s === 1 ? 'Service Type' : s === 2 ? 'Details' : 'Files'}
            </span>
            {s < 3 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      <div className="max-w-2xl">
        {/* Step 1: Service Type */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">What do you need?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {serviceTypes.map((service) => (
                <button
                  key={service.value}
                  onClick={() => setServiceType(service.value)}
                  className={cn(
                    'p-4 rounded-xl border text-left transition-all duration-200',
                    serviceType === service.value
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  )}
                >
                  <span className="text-2xl block mb-2">{service.emoji}</span>
                  <span className="text-sm font-medium">{service.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => serviceType && setStep(2)}
              disabled={!serviceType}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-foreground">Project Details</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Project Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. New Logo for Spring Campaign"
                className={inputClass}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you need, your goals, target audience, and any specific requirements..."
                rows={5}
                className={cn(inputClass, 'resize-none')}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">References / Inspiration</label>
              <textarea
                value={references}
                onChange={(e) => setReferences(e.target.value)}
                placeholder="Links or descriptions of designs you like..."
                rows={3}
                className={cn(inputClass, 'resize-none')}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Priority</label>
              <div className="flex gap-3">
                {['normal', 'high', 'urgent'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={cn(
                      'px-4 py-2 rounded-lg border text-sm font-medium transition-colors capitalize',
                      priority === p ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(3)}
                disabled={!title.trim() || !description.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Files */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-foreground">Attach Files (Optional)</h2>
            <p className="text-sm text-muted-foreground">Upload any reference images, existing assets, or inspiration files.</p>

            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/20 transition-colors">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">Click to upload files</span>
              <input type="file" multiple className="hidden" onChange={handleFileChange} />
            </label>

            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                    <span className="text-sm text-foreground flex-1 truncate">{file.name}</span>
                    <button onClick={() => removeFile(index)} className="text-muted-foreground hover:text-foreground transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : 'Submit Request'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
