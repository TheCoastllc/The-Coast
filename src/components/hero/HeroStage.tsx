"use client";

import { useEffect, useState } from "react";
import { useQuality } from "@/lib/perf";
import { StoryHero, MeetMode } from "./StoryHero";
import { StoryHeroStatic } from "./StoryHeroStatic";
import { BoatMode } from "./Boat";

/**
 * Decides the hero per device + masks the WebGL warmup:
 * - Always renders the crisp CSS StoryHeroStatic immediately (first paint = sun/waves, never the reef).
 * - On capable devices (tier !== low, motion allowed) mounts the WebGL StoryHero ABOVE it and
 *   fades it in only once its scene has actually painted (onReady) - so there is no transparent gap.
 * - On low-end / reduced-motion devices the WebGL hero is never mounted; the static scene IS the hero
 *   (zero WebGL cost, perfectly sharp).
 */
export function HeroStage({ meet = "reflect", boat = "rig" }: { meet?: MeetMode; boat?: BoatMode }) {
  const q = useQuality();
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [coarse, setCoarse] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      setCoarse(window.matchMedia("(pointer: coarse)").matches);
    }
  }, []);

  const useWebGL = mounted && q.tier !== "low" && !reduced;

  return (
    <>
      <StoryHeroStatic />
      {useWebGL && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -1,
            opacity: ready ? 1 : 0,
            transition: "opacity 0.7s ease",
            pointerEvents: "none",
          }}
          aria-hidden
        >
          <StoryHero meet={meet} boat={boat} postfx={!coarse} onReady={() => setReady(true)} />
        </div>
      )}
    </>
  );
}
