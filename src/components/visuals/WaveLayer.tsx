"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { WaveSwell } from "./waves/WaveSwell";
import { WaveField } from "./waves/WaveField";
import { WaveLiquid } from "./waves/WaveLiquid";
import { WaveThread } from "./WaveThread";
import styles from "./WaveLayer.module.css";

const WAVES = [
  { id: "swell", label: "Swell" },
  { id: "field", label: "Field" },
  { id: "liquid", label: "Liquid" },
  { id: "thread", label: "Thread" },
];

function Inner() {
  const params = useSearchParams();
  const wave = params.get("wave") ?? "swell";

  return (
    <>
      {wave === "swell" && <WaveSwell />}
      {wave === "field" && <WaveField />}
      {wave === "liquid" && <WaveLiquid />}
      {wave === "thread" && <WaveThread />}

      <nav className={styles.switch} aria-label="Wave style">
        <span className={styles.switchLabel}>Wave</span>
        {WAVES.map((w) => {
          const next = new URLSearchParams(params.toString());
          next.set("wave", w.id);
          return (
            <a
              key={w.id}
              href={`?${next.toString()}`}
              className={styles.tab}
              data-active={wave === w.id}
            >
              {w.label}
            </a>
          );
        })}
      </nav>
    </>
  );
}

/** Switchable connective wave behind the archive. Pick via ?wave=swell|field|liquid|thread */
export function WaveLayer() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
