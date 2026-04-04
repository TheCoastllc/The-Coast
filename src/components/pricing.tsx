"use client"

import { useState } from "react"
import { Check } from "@aliimam/icons"

import { ShineButton } from "@/components/ui/ShineButton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">(
    "annually"
  )

  const pricing = {
    starter: {
      monthly: 0,
      annually: 0,
    },
    professional: {
      monthly: 50,
      annually: 25,
    },
    enterprise: {
      monthly: 500,
      annually: 250,
    },
  }

  function AnimatedPrice({ monthly, annually }: { monthly: number; annually: number }) {
    return (
      <div className="relative flex h-15 items-center text-5xl font-medium">
        <span className="invisible">${billingPeriod === "annually" ? annually : monthly}</span>
        <span
          className="absolute inset-0 flex items-center transition-all duration-500"
          style={{
            opacity: billingPeriod === "annually" ? 1 : 0,
            transform: `scale(${billingPeriod === "annually" ? 1 : 0.8})`,
            filter: `blur(${billingPeriod === "annually" ? 0 : 4}px)`,
          }}
          aria-hidden={billingPeriod !== "annually"}
        >
          ${annually}
        </span>
        <span
          className="absolute inset-0 flex items-center transition-all duration-500"
          style={{
            opacity: billingPeriod === "monthly" ? 1 : 0,
            transform: `scale(${billingPeriod === "monthly" ? 1 : 0.8})`,
            filter: `blur(${billingPeriod === "monthly" ? 0 : 4}px)`,
          }}
          aria-hidden={billingPeriod !== "monthly"}
        >
          ${monthly}
        </span>
      </div>
    )
  }

  function FeatureList({ features, className }: { features: string[]; className?: string }) {
    return (
      <div className="flex flex-col items-start justify-start gap-2 self-stretch">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center justify-start gap-3 self-stretch">
            <div className="relative flex h-4 w-4 items-center justify-center">
              <Check className={className} />
            </div>
            <div className={`flex-1 text-[12.5px] font-normal ${className || ""}`}>
              {feature}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 px-4">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-center self-stretch py-9">
          <Tabs
            value={billingPeriod}
            onValueChange={(value) =>
              setBillingPeriod(value as "monthly" | "annually")
            }
            className="w-auto"
          >
            <TabsList className="grid w-65 grid-cols-2 rounded-full">
              <TabsTrigger
                value="annually"
                className="data-[state=active]:bg-background rounded-full"
              >
                Annually
              </TabsTrigger>
              <TabsTrigger
                value="monthly"
                className="data-[state=active]:bg-background rounded-full"
              >
                Monthly
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center justify-center self-stretch border-y">
          <div className="flex w-full items-start justify-center">
            <div className="relative w-4 self-stretch overflow-hidden sm:w-6 md:w-8 lg:w-12">
              <div className="absolute -top-30 -left-10 flex w-40 flex-col items-start justify-start">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div
                    key={i}
                    className="outline-primary/40 h-4 origin-top-left -rotate-45 self-stretch outline outline-offset-[-0.25px]"
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:gap-6">
              {/* Creator */}
              <div className="flex max-w-full flex-1 flex-col items-start justify-start gap-12 self-stretch overflow-hidden border-x px-6 py-5 md:max-w-none">
                <div className="flex flex-col items-center justify-start gap-9 self-stretch">
                  <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                    <div className="text-lg leading-7 font-medium">Creator</div>
                    <div className="text-muted-foreground w-full max-w-80 text-sm leading-5 font-normal">
                      Ideal for freelance designers and creative beginners.
                    </div>
                  </div>

                  <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                    <div className="flex flex-col items-start justify-start gap-1">
                      <AnimatedPrice monthly={pricing.starter.monthly} annually={pricing.starter.annually} />
                      <div className="text-sm font-medium">
                        per {billingPeriod === "monthly" ? "month" : "year"}, per user.
                      </div>
                    </div>
                  </div>

                  <ShineButton size="sm" full>
                    Start for free
                  </ShineButton>
                </div>

                <FeatureList features={[
                  "Up to 5 design projects",
                  "Basic brand kit tools",
                  "Community feedback access",
                  "Starter UI components",
                  "Export in PNG & JPG",
                ]} />
              </div>

              {/* Studio — accent gold card */}
              <div className="bg-primary flex max-w-full flex-1 flex-col items-start justify-start gap-12 self-stretch overflow-hidden border-x border-primary px-6 py-5 md:max-w-none">
                <div className="flex flex-col items-center justify-start gap-9 self-stretch">
                  <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                    <div className="text-primary-foreground text-lg leading-7 font-medium">
                      Studio
                    </div>
                    <div className="text-primary-foreground/70 w-full max-w-80 text-sm leading-5 font-normal">
                      Advanced toolkit for agencies and growing creative teams.
                    </div>
                  </div>

                  <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                    <div className="flex flex-col items-start justify-start gap-1">
                      <div className="text-primary-foreground">
                        <AnimatedPrice monthly={pricing.professional.monthly} annually={pricing.professional.annually} />
                      </div>
                      <div className="text-primary-foreground text-sm font-medium">
                        per {billingPeriod === "monthly" ? "month" : "year"}, per user.
                      </div>
                    </div>
                  </div>
                  <ShineButton size="sm" full>
                    Start Creating
                  </ShineButton>
                </div>

                <FeatureList
                  features={[
                    "Unlimited design projects",
                    "Complete brand management",
                    "Advanced UI component library",
                    "Figma & Adobe integration",
                    "Vector & SVG export",
                    "Team collaboration workspace",
                    "Priority creative support",
                    "Version history & backups",
                  ]}
                  className="text-primary-foreground"
                />
              </div>

              {/* Agency Pro */}
              <div className="flex max-w-full flex-1 flex-col items-start justify-start gap-12 self-stretch overflow-hidden border-x px-6 py-5 md:max-w-none">
                <div className="flex flex-col items-center justify-start gap-9 self-stretch">
                  <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                    <div className="text-lg leading-7 font-medium">
                      Agency Pro
                    </div>
                    <div className="w-full max-w-80 text-sm leading-5 font-normal">
                      Full-scale creative infrastructure for large design teams.
                    </div>
                  </div>

                  <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                    <div className="flex flex-col items-start justify-start gap-1">
                      <AnimatedPrice monthly={pricing.enterprise.monthly} annually={pricing.enterprise.annually} />
                      <div className="text-sm font-medium text-muted-foreground">
                        per {billingPeriod === "monthly" ? "month" : "year"}, per user.
                      </div>
                    </div>
                  </div>
                  <ShineButton size="sm" full>
                    Go Agency Pro
                  </ShineButton>
                </div>

                <FeatureList features={[
                  "Everything in Studio",
                  "Dedicated creative strategist",
                  "White-label design system",
                  "Custom component development",
                  "Advanced asset management",
                  "SSO & enterprise security",
                  "Custom contracts & billing",
                  "24/7 premium support",
                ]} />
              </div>
            </div>

            <div className="relative w-4 self-stretch overflow-hidden sm:w-6 md:w-8 lg:w-12">
              <div className="absolute -top-30 -left-10 flex w-40 flex-col items-start justify-start">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div
                    key={i}
                    className="outline-primary/40 h-4 origin-top-left -rotate-45 self-stretch outline outline-offset-[-0.25px]"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
