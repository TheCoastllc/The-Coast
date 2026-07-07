"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PILLARS, PRODUCTS } from "@/lib/content/coast";
import styles from "./ServiceWorlds.module.css";

/* ============================================================
   Services build-off - three formats behind ?services=deck|bridge|map.
   Same content (PILLARS + PRODUCTS), three ways to move through it.
   ============================================================ */

/* Shared: the launching shelf - Colony, ANT, Demi */
function LaunchShelf() {
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

/* ---------- DECK: three pillar panels; the open one unfolds ---------- */
export function TransformDeck() {
  const [open, setOpen] = useState(0);
  return (
    <div className={styles.deckWrap}>
      <div className={styles.deck}>
        {PILLARS.map((pl, i) => (
          <button
            key={pl.key}
            type="button"
            className={`${styles.deckPanel} glass`}
            data-open={open === i}
            data-pillar={pl.key}
            onClick={() => setOpen(i)}
            onMouseEnter={() => setOpen(i)}
          >
            <span className={styles.deckIndex}>{pl.index}</span>
            <span className={styles.deckName}>{pl.name}</span>
            <span className={styles.deckBody}>
              <span className={styles.deckPromise}>{pl.promise}</span>
              <span className={styles.deckList}>
                {pl.services.map((sv) => (
                  <span key={sv} className={styles.deckItem}>{sv}</span>
                ))}
              </span>
              <Link
                href={pl.cta.href}
                className={styles.deckCta}
                data-cursor-label="Go"
                onClick={(e) => e.stopPropagation()}
              >
                {pl.cta.label}
                <span aria-hidden> →</span>
              </Link>
            </span>
          </button>
        ))}
      </div>
      <LaunchShelf />
    </div>
  );
}

/* ---------- BRIDGE: giant index left, live panel right ---------- */
export function CommandBridge() {
  const [active, setActive] = useState(0);
  const pl = PILLARS[active];
  return (
    <div className={styles.bridgeWrap}>
      <div className={styles.bridge}>
        <div className={styles.bridgeIndex}>
          {PILLARS.map((p, i) => (
            <button
              key={p.key}
              type="button"
              className={styles.bridgeName}
              data-active={active === i}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <span className={styles.bridgeNum}>{p.index}</span>
              {p.name}
            </button>
          ))}
        </div>
        <div className={styles.bridgePanel} key={pl.key}>
          <p className={styles.bridgePromise}>{pl.promise}</p>
          <ul className={styles.bridgeList}>
            {pl.services.map((sv) => (
              <li key={sv}>{sv}</li>
            ))}
          </ul>
          <Link href={pl.cta.href} className={styles.bridgeCta} data-cursor-label="Go">
            {pl.cta.label}
            <span aria-hidden> →</span>
          </Link>
        </div>
      </div>
      <LaunchShelf />
    </div>
  );
}

/* ---------- MAP: one gold route, three ports, vessels at the end ---------- */
export function VoyageMap() {
  const pathRef = useRef<SVGPathElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // draw the route as the section scrolls through the viewport
  useEffect(() => {
    const path = pathRef.current;
    const wrap = wrapRef.current;
    if (!path || !wrap) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = String(len);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      path.style.strokeDashoffset = "0";
      return;
    }
    path.style.strokeDashoffset = String(len);
    let raf = 0;
    const apply = () => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height * 0.9)));
      path.style.strokeDashoffset = String(len * (1 - p));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className={styles.mapWrap} ref={wrapRef}>
      <svg className={styles.route} viewBox="0 0 100 900" preserveAspectRatio="none" aria-hidden>
        <path
          ref={pathRef}
          d="M50 0 C 20 120 80 210 50 300 C 20 390 80 480 50 570 C 20 660 80 750 50 900"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <ol className={styles.ports}>
        {PILLARS.map((pl, i) => (
          <li key={pl.key} className={styles.port} data-side={i % 2 === 0 ? "l" : "r"} data-mo="item">
            <span className={styles.portNode} aria-hidden />
            <div className={`${styles.portCard} glass`}>
              <span className={styles.portIndex}>Port {pl.index}</span>
              <h3 className={styles.portName}>{pl.name}</h3>
              <p className={styles.portPromise}>{pl.promise}</p>
              <p className={styles.portList}>{pl.services.join(" · ")}</p>
              <Link href={pl.cta.href} className={styles.portCta} data-cursor-label="Go">
                {pl.cta.label}
                <span aria-hidden> →</span>
              </Link>
            </div>
          </li>
        ))}
      </ol>
      <LaunchShelf />
    </div>
  );
}
