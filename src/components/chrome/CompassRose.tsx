"use client";

import { useEffect, useRef } from "react";
import styles from "./CompassRose.module.css";

// 8 rays of a compass star (N,E,S,W long; intercardinals short), faceted into
// a light + dark half each. Generated once.
const RAYS = Array.from({ length: 8 }, (_, i) => {
  const a = (i * 45 * Math.PI) / 180;
  const long = i % 2 === 0;
  const R = long ? 33 : 19;
  const w = long ? 6 : 4.5;
  const tip = `${(Math.sin(a) * R).toFixed(2)},${(-Math.cos(a) * R).toFixed(2)}`;
  const lb = `${(Math.sin(a - Math.PI / 2) * w).toFixed(2)},${(-Math.cos(a - Math.PI / 2) * w).toFixed(2)}`;
  const rb = `${(Math.sin(a + Math.PI / 2) * w).toFixed(2)},${(-Math.cos(a + Math.PI / 2) * w).toFixed(2)}`;
  return { tip, lb, rb, north: i === 0 };
});

const CARDINALS = [
  { l: "N", x: 0, y: -40 },
  { l: "E", x: 40, y: 0 },
  { l: "S", x: 0, y: 42 },
  { l: "W", x: -40, y: 0 },
];

/** A fixed ornate compass rose that rotates with scroll bearing, with a small
 *  instrument readout: heading, live coordinates, depth in fathoms. */
export function CompassRose() {
  const roseRef = useRef<SVGGElement>(null);
  const headRef = useRef<HTMLSpanElement>(null);
  const coordRef = useRef<HTMLSpanElement>(null);
  const depthRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        const bearing = p * 359;
        if (roseRef.current) roseRef.current.setAttribute("transform", `rotate(${bearing.toFixed(2)} 0 0)`);
        if (headRef.current) headRef.current.textContent = `${Math.round(bearing).toString().padStart(3, "0")}°`;
        if (depthRef.current) depthRef.current.textContent = `${Math.round(p * 240)} fm`;
      });
    };
    const onMove = (e: MouseEvent) => {
      // Open-ocean anchor (central Atlantic / Sargasso) - nautical flavor, not tied to any city.
      const lat = (28.0 + (0.5 - e.clientY / window.innerHeight) * 0.18).toFixed(4);
      const lon = (50.0 - (e.clientX / window.innerWidth - 0.5) * 0.22).toFixed(4);
      if (coordRef.current) coordRef.current.textContent = `${lat}°N ${lon}°W`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={styles.wrap} aria-hidden>
      <svg className={styles.rose} viewBox="-50 -50 100 100">
        <circle cx="0" cy="0" r="46" className={styles.ringOuter} />
        <circle cx="0" cy="0" r="37" className={styles.ringInner} />
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i * 15 * Math.PI) / 180;
          const r0 = i % 2 === 0 ? 41 : 43.5;
          return (
            <line
              key={i}
              x1={(Math.sin(a) * r0).toFixed(2)}
              y1={(-Math.cos(a) * r0).toFixed(2)}
              x2={(Math.sin(a) * 46).toFixed(2)}
              y2={(-Math.cos(a) * 46).toFixed(2)}
              className={styles.tick}
            />
          );
        })}
        <g ref={roseRef} className={styles.card}>
          {RAYS.map((r, i) => (
            <g key={i}>
              <polygon points={`0,0 ${r.lb} ${r.tip}`} className={r.north ? styles.rayNorthL : styles.rayL} />
              <polygon points={`0,0 ${r.tip} ${r.rb}`} className={r.north ? styles.rayNorthR : styles.rayR} />
            </g>
          ))}
          {CARDINALS.map((c) => (
            <text key={c.l} x={c.x} y={c.y} className={styles.cardinal}>
              {c.l}
            </text>
          ))}
        </g>
      </svg>
      <div className={styles.hud}>
        <span ref={headRef} className={styles.read}>000&deg;</span>
        <span ref={coordRef} className={styles.read}>28.0000&deg;N 50.0000&deg;W</span>
        <span ref={depthRef} className={styles.read}>0 fm</span>
      </div>
    </div>
  );
}
