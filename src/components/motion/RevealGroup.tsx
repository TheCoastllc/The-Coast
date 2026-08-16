"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { splitWords } from "./splitWords";

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
        // true word-by-word reveal: each word rises out of its own mask
        titles.forEach((t, ti) => {
          const words = splitWords(t);
          if (!words.length) return;
          tl.fromTo(
            words,
            { yPercent: 118, rotate: 4 },
            { yPercent: 0, rotate: 0, duration: 0.9, ease: "power4.out", stagger: 0.055 },
            0.12 + ti * 0.08
          );
        });
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

        /* Soften as the section leaves the top - scrubbed, so scrolling back
         * brings it up again (the in/out breathing of award sites).
         *
         * TWO deliberate changes from the original, both readability bugs:
         *
         * 1. The `from` now states opacity/y explicitly. It used to be
         *    `{"--exit": 0}`, which names NO opacity, so gsap captured the
         *    start value from whatever the element happened to have when the
         *    tween first rendered. If a ScrollTrigger.refresh() landed while a
         *    section was mid-fade, it re-captured the faded value as the START
         *    too - collapsing the range to 0.12 -> 0.12 and pinning that
         *    section at 12% opacity permanently, at any scroll position.
         * 2. The floor was 0.12. Everything below the hero rendered at 12%
         *    opacity - the ocean backdrop showing through nearly-transparent
         *    content, which is the washed-out blue page David reported. An
         *    exit flourish must never make content unreadable, so even the
         *    worst case now bottoms out at 0.82. */
        /* REMOVED, deliberately. Sections used to scrub down to opacity 0.12 as
         * they left the top. Two problems, both hit production:
         *   - the tween's `from` named no opacity, so gsap captured the start
         *     from whatever the element had when it first rendered; a
         *     ScrollTrigger.refresh() mid-fade re-captured the faded value as
         *     the start too, collapsing the range and pinning that section at
         *     its floor forever, at any scroll position;
         *   - the trigger's measurements go stale the moment the document
         *     changes height (the 350vh film section mounts only after first
         *     interaction, images and fonts settle later), so sections sat at
         *     the END value while fully in view.
         * Net effect: everything below the hero rendered at 12% opacity - the
         * ocean backdrop showing through near-transparent content, the
         * washed-out blue page David reported. A decorative exit flourish is
         * not worth a page that cannot be read, so content now simply stays at
         * full opacity once revealed. The reveal-IN choreography is untouched. */

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
      // The rAF loop runs ONLY while the user scrolls and goes silent ~0.4s
      // after rest: keeps the main thread idle for anyone not scrolling (and
      // keeps synthetic audits on the quiet path).
      const fine = window.matchMedia("(pointer: fine)").matches;
      if (fine) {
        const drifts = el.querySelectorAll<HTMLElement>('[data-mo="drift"]');
        const skewSet = gsap.quickSetter(el, "skewY", "deg");
        const driftSets = Array.from(drifts).map((d) => gsap.quickSetter(d, "x", "px"));
        let vel = 0;
        let lastY = window.scrollY;
        let lastT = performance.now();
        let raf = 0;
        let running = false;
        let quietFrames = 0;
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
          // settle detection: no meaningful velocity for ~25 frames -> sleep
          quietFrames = Math.abs(vel) < 0.05 && Math.abs(instant) < 0.05 ? quietFrames + 1 : 0;
          if (quietFrames > 25) {
            running = false;
            skewSet(0);
            driftSets.forEach((set) => set(0));
            return;
          }
          raf = requestAnimationFrame(tick);
        };
        const wake = () => {
          if (running) return;
          running = true;
          lastY = window.scrollY;
          lastT = performance.now();
          quietFrames = 0;
          raf = requestAnimationFrame(tick);
        };
        window.addEventListener("scroll", wake, { passive: true });
        ScrollTrigger.addEventListener("refreshInit", () => skewSet(0));
        const stop = () => {
          cancelAnimationFrame(raf);
          window.removeEventListener("scroll", wake);
        };
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

      /* Refresh after fonts/layout settle.
       *
       * clearScrollMemory() FIRST, and it is load-bearing. ScrollTrigger's
       * refresh records the current scroll offset, jumps to 0 to measure, then
       * RESTORES what it recorded. This effect runs on every client-side
       * navigation, just after Next's ScrollAndFocusHandler has set
       * scrollTop = 0 - so the restore wrote the PREVIOUS page's scroll offset
       * back, clamped to the new (shorter) page's maximum. The new route
       * therefore opened parked at its own footer, which an external QA audit
       * reported as four Critical "page is blank until I refresh" defects
       * (/services, /about, /locations, /offers). The content was always
       * there; the viewport was at the bottom of it. clearScrollMemory()
       * discards those recorded offsets so refresh() cannot restore them.
       * Proof it is this call site: /work has no RevealGroup and never
       * mis-scrolled, while every route that mounts one did. */
      ScrollTrigger.clearScrollMemory();
      ScrollTrigger.refresh();
    }, el);

    return () => {
      (el as HTMLElement & { __coastVelStop?: () => void }).__coastVelStop?.();
      ctx.revert();
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
