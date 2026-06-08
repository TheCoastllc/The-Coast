"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./MasterpieceThesis.module.css";

/* Seven cinematic treatments for the thesis "billboard", inspired by the reference
 * board (glassmorphic heroes + luxury billboards) plus an ocean and a dark-water cut.
 * Toggle between them live - no separate URLs. */
const TREATMENTS = [
  { id: "split", name: "Glass Split" },
  { id: "giant", name: "Editorial Giant" },
  { id: "card", name: "Frosted Card" },
  { id: "billboard", name: "Billboard" },
  { id: "spotlight", name: "Spotlight" },
  { id: "ocean", name: "Ocean" },
  { id: "water", name: "Dark Water" },
] as const;

const EYEBROW = "The promise";
const LEAD = "We turn visions into";
const KEY = "empires.";
const BODY =
  "An end-to-end ecosystem for the visionaries behind the brands - from the first mark to the launch campaign.";

/* the message composited onto a real billboard, sheared to its screen plane */
function BillboardStage() {
  return (
    <div className={styles.bbPlate}>
      <div className={styles.bbScreenFill} aria-hidden />
      <div className={styles.bbSign}>
        <span className={styles.bbSignBrand}>THE COAST</span>
        <h2 className={styles.bbSignTitle}>
          We turn visions into <em>empires.</em>
        </h2>
        <span className={styles.bbSignUrl}>coastglobal.org</span>
      </div>
    </div>
  );
}

/* the shared cinematic layout used by the six glass/photo treatments */
function GlassStage() {
  return (
    <>
      <div className={styles.photo} aria-hidden />
      <div className={styles.grade} aria-hidden />
      <div className={styles.glass} aria-hidden />
      <span className={styles.index} aria-hidden>
        C / 01
      </span>
      <div className={styles.content}>
        <p className={styles.eyebrow}>{EYEBROW}</p>
        <h2 className={styles.headline}>
          <span className={styles.lead}>{LEAD} </span>
          <span className={styles.key}>{KEY}</span>
        </h2>
        <p className={styles.body}>{BODY}</p>
        <div className={styles.actions}>
          <Link href="/contact" className={styles.cta} data-cursor-label="Start">
            Start a project
            <span className={styles.ctaArrow}>→</span>
          </Link>
          <Link href="/work" className={styles.ghost} data-cursor-label="Explore">
            See the work
          </Link>
        </div>
        <div className={styles.dots} aria-hidden>
          <span className={styles.dotOn} />
          <span />
          <span />
        </div>
      </div>
    </>
  );
}

export function MasterpieceThesis() {
  const [active, setActive] = useState(2); // default: Frosted Card
  const id = TREATMENTS[active].id;

  return (
    <section className={`section ${styles.wrap} ${styles[id]}`} data-treatment={id}>
      <div className={styles.stage}>{id === "billboard" ? <BillboardStage /> : <GlassStage />}</div>

      <div className={styles.toggle} role="tablist" aria-label="Billboard treatments">
        {TREATMENTS.map((tr, i) => (
          <button
            key={tr.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`${styles.toggleBtn} ${i === active ? styles.toggleActive : ""}`}
            onClick={() => setActive(i)}
            data-cursor="active"
          >
            <span className={styles.toggleNum}>{String(i + 1).padStart(2, "0")}</span>
            <span className={styles.toggleName}>{tr.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
