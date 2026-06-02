import { ReactNode } from "react";
import { RevealGroup } from "@/components/motion/RevealGroup";
import { ChamberBackdrop } from "@/components/chrome/ChamberBackdrop";
import { ChamberHeroFx } from "./ChamberHeroFx";
import { ChamberTitle } from "./ChamberTitle";
import styles from "./ChamberShell.module.css";

type Props = {
  /** Chamber index e.g. "02" */
  index?: string;
  /** Atmospheric chamber name e.g. "The Origin" */
  chamber: string;
  /** Functional label e.g. "Vision" */
  label: string;
  /** Big poetic hero line */
  preface?: string;
  /** Optional epigraph that sits below the title */
  epigraph?: string;
  /** Optional WebGL backdrop that replaces the default atmosphere (e.g. a kept HeroStage scene) */
  backdrop?: ReactNode;
  children: ReactNode;
};

export function ChamberShell({
  index,
  chamber,
  label,
  preface,
  epigraph,
  backdrop,
  children,
}: Props) {
  return (
    <main className={styles.main}>
      {backdrop ?? <ChamberBackdrop />}
      <section className={styles.hero}>
        <ChamberHeroFx />
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>
            {index && <span className={styles.idx}>{index}</span>}
            <span className={styles.eyebrowSep}>/</span>
            <span className={styles.eyebrowLabel}>{label}</span>
          </div>
          <ChamberTitle text={chamber} className={styles.chamber} />
          {preface && <p className={styles.preface}>{preface}</p>}
          {epigraph && <p className={styles.epigraph}>{epigraph}</p>}
        </div>
      </section>

      <div className={styles.body}>
        <RevealGroup>{children}</RevealGroup>
      </div>
    </main>
  );
}
