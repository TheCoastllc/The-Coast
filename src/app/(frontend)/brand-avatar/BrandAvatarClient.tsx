'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { BlueprintLayout, SectionBoundary } from '@/components/blueprint-layout'

/* No published prices. This configurator used to advertise "from $250" per
 * service and a running total, which undercut the premium positioning on the
 * rest of the site and priced work before anyone had scoped it. It is now a
 * scope selector: pick the services, send the configuration, and a strategist
 * returns a fixed-scope proposal - exactly what the rest of the site promises. */
const sections = [
  { id: 'head', label: 'Logo Design', description: 'Your visual identity - the face of your brand', emoji: '🎨' },
  { id: 'eyes', label: 'Social Media', description: 'The eyes your audience sees you through', emoji: '👁️' },
  { id: 'mouth', label: 'Copywriting', description: 'The words that speak for your brand', emoji: '💬' },
  { id: 'heart', label: 'Brand Strategy', description: 'The passion and purpose driving your brand', emoji: '❤️' },
  { id: 'body', label: 'Website Design', description: 'The full presence your brand inhabits online', emoji: '🌐' },
  { id: 'hands', label: 'Marketing Materials', description: 'The reach your brand extends into the world', emoji: '🖐️' },
  { id: 'legs', label: 'Brand Guidelines', description: 'The foundation your brand stands on', emoji: '📋' },
]

export default function BrandAvatarClient() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const router = useRouter()

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const isComplete = selected.size === sections.length

  const handleRequestProposal = () => {
    const selectedServices = sections.filter((s) => selected.has(s.id)).map((s) => s.label)
    localStorage.setItem('inquiry_prefill', JSON.stringify({ services: selectedServices }))
    router.push('/intake')
  }

  return (
    <BlueprintLayout>
      <section className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-mono text-muted-foreground/50 block mb-3">Brand Builder</span>
            <h1 className="text-heading text-4xl md:text-6xl lg:text-7xl mb-6">Build Your Brand Avatar</h1>
            <p className="text-body text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Select the services that make up your brand. Each piece builds toward a complete
              identity - send us the scope and we price it properly, to the work.
            </p>
          </motion.div>

          <SectionBoundary />

          <h2 className="sr-only">Available Brand Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12 mt-12">
            {sections.map((section, index) => {
              const isSelected = selected.has(section.id)
              return (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  onClick={() => toggle(section.id)}
                  className={`relative p-6 rounded-2xl border text-left transition-all duration-300 ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-[0_0_30px_-8px_hsl(var(--primary)/0.4)]'
                      : 'border-border bg-card hover:border-primary/40 hover:bg-primary/5'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                  <span className="text-3xl block mb-3">{section.emoji}</span>
                  <h3 className="text-heading text-lg text-foreground mb-1">{section.label}</h3>
                  <p className="text-body text-muted-foreground text-sm leading-relaxed">{section.description}</p>
                </motion.button>
              )
            })}
          </div>

          {/* Summary */}
          <AnimatePresence>
            {selected.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-card border border-border rounded-2xl p-6 md:p-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {isComplete && <Sparkles className="w-5 h-5 text-primary" />}
                      <h3 className="text-heading text-xl text-foreground">
                        {isComplete ? 'Full Brand Package!' : `${selected.size} of ${sections.length} services selected`}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sections.filter((s) => selected.has(s.id)).map((s) => (
                        <span key={s.id} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full border border-primary/20">
                          {s.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="md:text-right shrink-0 md:max-w-xs">
                    <p className="text-body text-muted-foreground text-sm mb-4 leading-relaxed">
                      Send us this scope and a strategist returns a fixed-scope proposal with a
                      clear price - usually within a day or two.
                    </p>
                    <button
                      onClick={handleRequestProposal}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-mono text-sm hover:bg-primary/90 transition-colors duration-300"
                    >
                      Request a proposal
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {selected.size === 0 && (
            <div className="text-center mt-8">
              <p className="text-body text-muted-foreground text-sm">
                Select services above to build your custom package, or{' '}
                <Link href="/get-started" className="text-primary hover:underline">
                  start your project
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </section>
    </BlueprintLayout>
  )
}
