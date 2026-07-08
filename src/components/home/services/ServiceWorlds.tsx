"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PILLARS, PRODUCTS } from "@/lib/content/coast";
import { splitWords } from "@/components/motion/splitWords";
import styles from "./ServiceWorlds.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ============================================================
   The Stack - David's pick, elevated to Awwwards-winner grade:
   full-bleed imagery per pillar card, sticky stacking on native
   scroll, GSAP settle of the covered card (scale + dim + image
   parallax), oversized display type.
   ============================================================ */

/* Interim card art from approved plates; swapped for generated
   pillar-specific 4K art when the Higgsfield batch runs. */
const CARD_ART: Record<string, string> = {
  brand: "/img/billboard-plate.jpg",
  growth: "/img/ocean-aerial-wide.jpg",
  ai: "/img/ocean-dark.jpg",
};

/* The launching shelf - Colony, ANT, Demi */
export function LaunchShelf() {
  return (
    <div className={styles.shelf}>
      <p className={styles.shelfLabel} data-mo="eyebrow">Products we are launching</p>
      <div className={styles.shelfRow}>
        {PRODUCTS.map((p) => (
          <div key={p.name} className={`${styles.vessel} glass`} data-mo="item">
            <span className={styles.vesselStatus}>
              <span className={styles.vesselDot} />
              {p.status}
            </span>
            <span className={styles.vesselName}>{p.name}</span>
            <span className={styles.vesselLine}>{p.line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ServiceStack({ shelf = true }: { shelf?: boolean } = {}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  // the winner's settle: as the next card rides up, the covered card scales
  // back + dims and its image drifts slower (parallax) - scrubbed, all browsers
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = Array.from(wrap.querySelectorAll<HTMLElement>("[data-stack-card]"));
    const triggers: ScrollTrigger[] = [];
    cards.forEach((card, i) => {
      // per-card entrance: the title's words rise masked, then the rest follows
      const name = card.querySelector<HTMLElement>("h3");
      const rest = card.querySelectorAll<HTMLElement>("p, li, a, [data-stack-idx]");
      if (name) {
        const words = splitWords(name);
        const tl = gsap.timeline({ paused: true });
        tl.fromTo(
          words,
          { yPercent: 118, rotate: 4 },
          { yPercent: 0, rotate: 0, duration: 0.85, ease: "power4.out", stagger: 0.07 },
          0
        );
        tl.fromTo(
          rest,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.05 },
          0.28
        );
        if (card.getBoundingClientRect().top < window.innerHeight * 0.85) {
          tl.play();
        } else {
          triggers.push(
            ScrollTrigger.create({ trigger: card, start: "top 78%", once: true, onEnter: () => tl.play() })
          );
        }
      }
      const img = card.querySelector<HTMLElement>("[data-stack-img]");
      // image parallax across the card's own pass
      triggers.push(
        ScrollTrigger.create({
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.4,
          onUpdate: (self) => {
            if (img) gsap.set(img, { yPercent: (self.progress - 0.5) * 10 });
          },
        })
      );
      // settle while the NEXT card covers this one
      const next = cards[i + 1];
      if (!next) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: next,
          start: "top bottom",
          end: "top top+=140",
          scrub: 0.35,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(card, {
              scale: 1 - p * 0.055,
              filter: `brightness(${1 - p * 0.38})`,
            });
          },
        })
      );
    });
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <div className={styles.stackWrap} ref={wrapRef}>
      <ol className={styles.stack}>
        {PILLARS.map((pl, i) => (
          <li
            key={pl.key}
            className={styles.stackCard}
            data-stack-card
            data-pillar={pl.key}
            style={{ top: `calc(84px + ${i * 18}px)`, zIndex: i + 1 }}
          >
            {/* content zone - title up top, body + list on the base line */}
            <div className={styles.cardContent}>
              <div className={styles.cardHead}>
                <h3 className={styles.stackName} data-mo="title">{pl.name}</h3>
                <span className={styles.stackIndex}>{pl.index} / 03</span>
              </div>
              <div className={styles.cardBase}>
                <div className={styles.cardCol}>
                  <p className={styles.stackPromise}>{pl.promise}</p>
                  <Link href={pl.cta.href} className={styles.stackCta} data-cursor-label="Go">
                    {pl.cta.label}
                    <span aria-hidden> →</span>
                  </Link>
                </div>
                <ul className={styles.stackList}>
                  {pl.services.map((sv) => (
                    <li key={sv} className={styles.stackItem}>{sv}</li>
                  ))}
                </ul>
              </div>
            </div>
            {/* contained media panel, full-bleed to the card's right edge */}
            <div className={styles.cardMedia} aria-hidden>
              <div className={styles.cardMediaInner} data-stack-img>
                <Image
                  src={CARD_ART[pl.key]}
                  alt=""
                  fill
                  sizes="(max-width: 860px) 100vw, 42vw"
                  quality={82}
                  className={styles.stackImg}
                />
              </div>
            </div>
          </li>
        ))}
      </ol>
      {shelf && <LaunchShelf />}
    </div>
  );
}
