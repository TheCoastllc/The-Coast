"use client";

import { CharReveal } from "@/components/motion/CharReveal";
import { usePremiumActive } from "@/components/chrome/usePremium";

/**
 * The chamber hero title. With the "ignite" premium flag on, it assembles
 * character-by-character (with the teal glow blooming in via the global heading
 * rule); otherwise it's a plain glowing <h1>.
 */
export function ChamberTitle({ text, className }: { text: string; className?: string }) {
  const active = usePremiumActive();
  if (active.has("ignite")) {
    return (
      <CharReveal as="h1" className={className} trigger="mount" stagger={0.045}>
        {text}
      </CharReveal>
    );
  }
  return <h1 className={className}>{text}</h1>;
}
