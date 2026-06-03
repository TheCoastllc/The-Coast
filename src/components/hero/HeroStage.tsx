"use client";

import { useState } from "react";
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
  const trigger = useHeroMountTrigger(); // desktop: eager on idle. phone: on first touch/scroll.
  const [ready, setReady] = useState(false);

  return (
    <>
      <StoryHeroStatic />
      {webgl && trigger && (
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
          <StoryHero meet={meet} boat={boat} onReady={() => setReady(true)} />
        </div>
      )}
    </>
  );
}
