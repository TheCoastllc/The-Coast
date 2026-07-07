"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PILLARS, PRODUCTS } from "@/lib/content/coast";
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
            style={{ top: `calc(76px + ${i * 24}px)`, zIndex: i + 1 }}
          >
            {/* full-bleed art + scrim */}
            <div className={styles.stackArt} data-stack-img aria-hidden>
              <Image
                src={CARD_ART[pl.key]}
                alt=""
                fill
                sizes="100vw"
                quality={80}
                className={styles.stackImg}
              />
            </div>
            <div className={styles.stackScrim} aria-hidden />
            <span className={styles.stackGhost} aria-hidden>{pl.index}</span>

            <div className={styles.stackInner}>
              <span className={styles.stackIndex} data-mo="eyebrow">{pl.index} / 03</span>
              <h3 className={styles.stackName} data-mo="title">{pl.name}</h3>
              <p className={styles.stackPromise} data-mo="lead">{pl.promise}</p>
              <div className={styles.stackList}>
                {pl.services.map((sv) => (
                  <span key={sv} className={styles.stackItem} data-mo="item">{sv}</span>
                ))}
              </div>
              <Link href={pl.cta.href} className={styles.stackCta} data-cursor-label="Go" data-mo="magnetic">
                {pl.cta.label}
                <span aria-hidden> →</span>
              </Link>
            </div>

            <span className={styles.stackFoot} aria-hidden>
              The Coast — What We Do · {pl.index}/03
            </span>
          </li>
        ))}
      </ol>
      {shelf && <LaunchShelf />}
    </div>
  );
}
