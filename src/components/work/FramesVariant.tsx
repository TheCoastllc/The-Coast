"use client";

import { WorkFrame } from "./WorkFrame";
import type { WorkProject } from "./WorkShowcase";

/**
 * "Full-bleed frames" (?work=frames, the default). An editorial title screen,
 * then every project as a full-bleed cinematic frame stacked top-to-bottom.
 * Pure IntersectionObserver reveal inside WorkFrame - no ScrollTrigger on /work.
 */
export function FramesVariant({ projects }: { projects: WorkProject[] }) {
  return (
    <div className="wk-root">
      <header className="wk-title">
        <p className="wk-title-eyebrow">The Coast Global — Selected Work</p>
        <h1 className="wk-title-head">
          The work,
          <br />
          in full.
        </h1>
        <p className="wk-title-sub">
          Brand transformations and cinematic web builds for founders and operators with
          everything to prove. Scroll.
        </p>
      </header>

      {projects.map((p, i) => (
        <WorkFrame key={p.id} p={p} index={i} total={projects.length} eager={i === 0} />
      ))}
    </div>
  );
}
