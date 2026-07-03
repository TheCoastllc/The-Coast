"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { THESIS } from "@/lib/content/coast";
import styles from "./MasterpieceThesis.module.css";

/* The thesis as a cinematic frosted-glass moment: an aerial-ocean frame with a
 * frosted-glass card that cycles problem -> fix -> promise. */
const KEYWORDS = ["invisibility", "accessible", "empires"] as const;

function renderTitle(title: string, k: string) {
  const i = title.toLowerCase().indexOf(k.toLowerCase());
  if (i < 0) return title;
  return (
    <>
      {title.slice(0, i)}
      <em>{title.slice(i, i + k.length)}</em>
      {title.slice(i + k.length)}
    </>
  );
}

export function MasterpieceThesis() {
  const [slide, setSlide] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const count = THESIS.length;

  // reveal on enter
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && el.classList.add(styles.inView)),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // auto-advance the three statements (motion-safe)
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % count), 6500);
    return () => clearInterval(id);
  }, [count]);

  const beat = THESIS[slide];
  const kw = KEYWORDS[slide] ?? "";

  return (
    <section ref={ref} className={`section ${styles.wrap} ${styles.card}`} data-treatment="card">
      <div className={styles.stage}>
        <div className={styles.photo} aria-hidden />
        <div className={styles.photoNear} aria-hidden />
        <div className={styles.grade} aria-hidden />
        <div className={styles.glass} aria-hidden />
        <span className={styles.index} aria-hidden>
          C / 0{slide + 1}
        </span>
        <div className={styles.content}>
          <p className={styles.eyebrow} key={`e${slide}`}>
            {beat.label}
          </p>
          <h2 className={`${styles.headline} no-marble`} key={`h${slide}`}>
            {renderTitle(beat.title, kw)}
          </h2>
          <p className={styles.body} key={`b${slide}`}>
            {beat.body}
          </p>
          <div className={styles.actions}>
            <Link href="/contact" className={styles.cta} data-cursor-label="Start">
              Start a project
              <span className={styles.ctaArrow}>→</span>
            </Link>
            <Link href="/work" className={styles.ghost} data-cursor-label="Explore">
              See the work
            </Link>
          </div>
          <div className={styles.dots}>
            {THESIS.map((b, i) => (
              <button
                key={b.label}
                type="button"
                className={i === slide ? styles.dotOn : undefined}
                onClick={() => setSlide(i)}
                aria-label={b.label}
                data-cursor="active"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
