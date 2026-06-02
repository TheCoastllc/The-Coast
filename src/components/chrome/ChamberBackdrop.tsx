"use client";

import dynamic from "next/dynamic";
import { useWebGLAllowed } from "@/lib/perf";

// The WebGL motes live in their own chunk - loaded only on capable desktops,
// never on touch / low-end devices.
const ChamberAtmosphere = dynamic(
  () => import("./ChamberAtmosphere").then((m) => ({ default: m.ChamberAtmosphere })),
  { ssr: false }
);

/** Cool sea-light motes behind chamber pages. Desktop-only, lazy-loaded. */
export function ChamberBackdrop() {
  const webgl = useWebGLAllowed();
  if (!webgl) return null;
  return <ChamberAtmosphere color={0x6f8597} />;
}
