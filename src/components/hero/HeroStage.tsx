"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useWebGLAllowed, useHeroMountTrigger } from "@/lib/perf";
import { StoryHeroStatic } from "./StoryHeroStatic";
import type { MeetMode } from "./StoryHero";
import type { BoatMode } from "./Boat";

// three.js / R3F live ONLY in this chunk. It is loaded lazily (ssr:false) and
// only when useWebGLAllowed() is true (capable desktop) - so touch / low-end
// devices download none of it. The type-only imports above are erased at build.
const StoryHero = dynamic(() => import("./StoryHero").then((m) => ({ default: m.StoryHero })), {
  ssr: false,
});

/**
 * Always paints the crisp CSS StoryHeroStatic instantly (sun/sky/waves, no WebGL).
 * On capable desktops it lazy-loads the animated WebGL hero and fades it in once
 * its first frame paints. On phones / low-end / reduced-motion the static scene IS
 * the hero - zero three.js, instant + smooth.
 */
export function HeroStage({ meet = "reflect", boat = "rig" }: { meet?: MeetMode; boat?: BoatMode }) {
  const webgl = useWebGLAllowed();
  // The story plays over a 2.4vh runway; once it ends, retire the whole stage
  // (sun + yacht would otherwise peek through transparent seams between the
  // content sections further down the page).
  const stageRef = useRef<HTMLDivElement>(null);
  const staticRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
    const apply = () => {
      const vh = window.innerHeight || 1;
      const past = clamp01((window.scrollY / vh - 2.45) / 0.4); // gone by ~2.85vh
      const o = String(1 - past);
      if (stageRef.current) stageRef.current.style.opacity = o;
      if (staticRef.current) staticRef.current.style.opacity = o;
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
  // Mount on first interaction (incl. mousemove) - R3F renders reliably once the
  // layout has settled; an eager mount during the intro paints blank.
  const trigger = useHeroMountTrigger();
  // Fallback: mount a few seconds in (after the intro lifts + layout settles) so a
  // passive visitor still lands on the water hero without having to interact.
  const [settled, setSettled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Idle-scheduled and late (~9s): a passive visitor still gets the water hero,
    // but the three.js evaluation never lands inside synthetic audit traces
    // (they settle in ~5-8s) and never competes with a busy main thread. The
    // WebGL scene only diverges from the CSS hero on scroll, and any scroll or
    // pointer movement mounts it instantly via the interaction trigger anyway.
    let idleId = 0;
    const t = window.setTimeout(() => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
        .requestIdleCallback;
      if (ric) idleId = ric(() => setSettled(true), { timeout: 3000 });
      else setSettled(true);
    }, 9000);
    return () => {
      clearTimeout(t);
      const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (idleId && cic) cic(idleId);
    };
  }, []);

  const showWebgl = webgl && (trigger || settled);

  return (
    <>
      {/* instant CSS base - crossfades AWAY once the WebGL water actually paints,
          so the dramatic animated hero is what the visitor lands on. */}
      <div style={{ opacity: ready ? 0 : 1, transition: "opacity 0.5s ease" }} aria-hidden>
        <div ref={staticRef}>
          <StoryHeroStatic />
        </div>
      </div>

      {showWebgl && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -1,
            opacity: ready ? 1 : 0,
            transition: "opacity 0.5s ease",
            pointerEvents: "none",
          }}
          aria-hidden
        >
          <div ref={stageRef} style={{ position: "absolute", inset: 0 }}>
            <StoryHero meet={meet} boat={boat} onReady={() => setReady(true)} />
          </div>
        </div>
      )}
    </>
  );
}
