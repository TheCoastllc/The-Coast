"use client";

import { useVariant } from "@/components/visuals/useVariant";
import { FramesVariant } from "./FramesVariant";
import { FloodVariant } from "./FloodVariant";
import { ReelVariant } from "./ReelVariant";
import "@/styles/work-showcase.css";

/** One project, with its assets already verified on disk by the server so the
 *  showcase never requests a hero/video/moment that doesn't exist. */
export type WorkProject = {
  id: string;
  client: string;
  tagline?: string;
  summary?: string;
  category?: string;
  year?: number;
  color?: string;
  textColor?: string;
  liveUrl?: string;
  palette?: string[];
  role?: string[];
  ready: boolean;
  /** always present: /portfolio/<id>/cover.jpg */
  cover: string;
  /** only if hero.jpg exists on disk */
  hero?: string;
  /** only if video.webm exists on disk */
  video?: string;
  /** moments filtered to files that actually exist */
  moments: { image: string; caption: string }[];
  /** true when the project ships a video.webm (the rich, cinematic tier) */
  rich: boolean;
};

export const WORK_VARIANTS = ["frames", "flood", "reel"] as const;
export type WorkVariant = (typeof WORK_VARIANTS)[number];

/**
 * The /work masterpiece showcase. Three switchable directions behind ?work= so
 * David can experience each live and pick the one that does the studio justice:
 *   frames - the current top-to-bottom rhythm, but every project FULL-BLEED
 *            (no screenshot-in-a-box), cinematic grade, huge kinetic name.
 *   flood  - a bold editorial index of client names; hovering a name floods the
 *            whole viewport with that project's work; full-bleed frames below.
 *   reel   - scroll becomes film: full-bleed projects cross-dissolve into each
 *            other, built on the FilmStrip rAF engine (no ScrollTrigger).
 * All three share the WorkFrame atom + work-showcase.css, degrade to a clean
 * full-bleed card stack on touch, and render static under reduced motion.
 */
export function WorkShowcase({ projects }: { projects: WorkProject[] }) {
  const variant = useVariant("work", WORK_VARIANTS, "frames");

  if (variant === "flood") return <FloodVariant projects={projects} />;
  if (variant === "reel") return <ReelVariant projects={projects} />;
  return <FramesVariant projects={projects} />;
}
