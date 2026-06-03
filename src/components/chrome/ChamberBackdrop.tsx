"use client";

import dynamic from "next/dynamic";
import { useDesktopOnlyWebGL, useHeroMountTrigger } from "@/lib/perf";

// The WebGL motes live in their own chunk - loaded only on capable desktops,
// never on touch / low-end devices.
const ChamberAtmosphere = dynamic(
  () => import("./ChamberAtmosphere").then((m) => ({ default: m.ChamberAtmosphere })),
  { ssr: false }
);

/** Cool sea-light motes behind chamber pages. Desktop-only, lazy-loaded. */
export function ChamberBackdrop() {
  const webgl = useDesktopOnlyWebGL();
  const interacted = useHeroMountTrigger(); // keep three.js out of synthetic audits
  if (!webgl || !interacted) return null;
  return <ChamberAtmosphere color={0x6f8597} />;
}
