"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Section choreography for chamber/landing bodies.
 *
 * Each `.section` gets a once-per-view GSAP timeline instead of a flat fade:
 *   eyebrow tracks in (letter-spacing settles) -> headings mask up ->
 *   lead copy rises -> items cascade with a stagger.
 * Roles are declared in JSX via data-mo attributes (module-safe, no class
 * name coupling): eyebrow | title | lead | item.
 *
 * Extras (pointer-fine, motion-allowed only):
 *   - velocity skew: the content plane shears subtly with scroll velocity and
 *     springs back on rest (data-mo="drift" elements get a stronger nudge).
 *   - magnetic CTAs: [data-mo="magnetic"] elements are gently attracted to the
 *     pointer within a small radius.
 */
export function RevealGroup({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(".section", el);

      sections.forEach((s) => {
        const eyebrows = s.querySelectorAll<HTMLElement>('[data-mo="eyebrow"]');
        const titles = s.querySelectorAll<HTMLElement>('[data-mo="title"]');
        const leads = s.querySelectorAll<HTMLElement>('[data-mo="lead"]');
        const items = s.querySelectorAll<HTMLElement>('[data-mo="item"]');

        // Base plane: keep the familiar rise, drop the blur (paint cost).
        gsap.set(s, { opacity: 0, y: 36 });
        const tl = gsap.timeline({ paused: true });
        tl.to(s, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0);

        eyebrows.forEach((e) => {
          const settled = getComputedStyle(e).letterSpacing;
          tl.fromTo(
            e,
            { opacity: 0, y: 12, letterSpacing: "0.62em" },
            { opacity: 1, y: 0, letterSpacing: settled, duration: 0.85, ease: "power2.out" },
            0.05
          );
        });
        if (titles.length) {
          tl.fromTo(
            titles,
            { clipPath: "inset(102% 0 -8% 0)", y: 34 },
            { clipPath: "inset(-8% 0 -8% 0)", y: 0, duration: 1.05, ease: "power4.out", stagger: 0.08 },
            0.14
          );
        }
        if (leads.length) {
          tl.fromTo(
            leads,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.06 },
            0.38
          );
        }
        if (items.length) {
          tl.fromTo(
            items,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.85, ease: "power3.out", stagger: 0.07 },
            0.3
          );
        }

        const play = () => tl.play();
        // Already in view on mount - reveal now instead of waiting for a scroll
        // that may never come.
        if (s.getBoundingClientRect().top < window.innerHeight * 0.9) {
          play();
          return;
        }
        ScrollTrigger.create({ trigger: s, start: "top 84%", once: true, onEnter: play });
      });

      // ---- velocity ambience (desktop pointers only) -----------------------
      const fine = window.matchMedia("(pointer: fine)").matches;
      if (fine) {
        const drifts = el.querySelectorAll<HTMLElement>('[data-mo="drift"]');
        const skewSet = gsap.quickSetter(el, "skewY", "deg");
        const driftSets = Array.from(drifts).map((d) => gsap.quickSetter(d, "x", "px"));
        let vel = 0;
        let lastY = window.scrollY;
        let lastT = performance.now();
        let raf = 0;
        const tick = () => {
          const now = performance.now();
          const y = window.scrollY;
          const dt = Math.max(16, now - lastT);
          const instant = ((y - lastY) / dt) * 16; // px per frame-ish
          vel += (instant - vel) * 0.12; // smooth
          lastY = y;
          lastT = now;
          const skew = gsap.utils.clamp(-1.1, 1.1, vel * 0.02);
          skewSet(Math.abs(skew) < 0.02 ? 0 : skew);
          const nudge = gsap.utils.clamp(-16, 16, vel * 0.3);
          driftSets.forEach((set) => set(nudge));
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        ScrollTrigger.addEventListener("refreshInit", () => skewSet(0));
        // cleanup via context return below
        const stop = () => cancelAnimationFrame(raf);
        (el as HTMLElement & { __coastVelStop?: () => void }).__coastVelStop = stop;

        // ---- magnetic CTAs -------------------------------------------------
        const magnets = el.querySelectorAll<HTMLElement>('[data-mo="magnetic"]');
        magnets.forEach((m) => {
          const xSet = gsap.quickTo(m, "x", { duration: 0.35, ease: "power3.out" });
          const ySet = gsap.quickTo(m, "y", { duration: 0.35, ease: "power3.out" });
          const onMove = (ev: PointerEvent) => {
            const r = m.getBoundingClientRect();
            const dx = ev.clientX - (r.left + r.width / 2);
            const dy = ev.clientY - (r.top + r.height / 2);
            const dist = Math.hypot(dx, dy);
            const reach = Math.max(r.width, 96);
            if (dist < reach) {
              const pull = (1 - dist / reach) * 8;
              xSet((dx / dist) * pull || 0);
              ySet((dy / dist) * pull || 0);
            } else {
              xSet(0);
              ySet(0);
            }
          };
          const onLeave = () => {
            xSet(0);
            ySet(0);
          };
          m.addEventListener("pointermove", onMove);
          m.addEventListener("pointerleave", onLeave);
        });
      }

      // refresh after fonts/layout settle
      ScrollTrigger.refresh();
    }, el);

    return () => {
      (el as HTMLElement & { __coastVelStop?: () => void }).__coastVelStop?.();
      ctx.revert();
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
