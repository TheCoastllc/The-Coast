"use client";

import { usePathname } from "next/navigation";
import { getSection, NAV } from "@/lib/nav";
import styles from "./HUD.module.css";

/**
 * Top/bottom corner HUD labels. Cinematic chrome tying every page together.
 * - Top-left: company + pulse dot
 * - Top-right: section index (e.g. "C / 02")
 * - Bottom-left: location
 * - Bottom-right: domain + year
 */
export function HUD() {
  const pathname = usePathname();
  const idx = NAV.findIndex((c) => c.path === pathname);
  const section = getSection(pathname);
  const num = (idx >= 0 ? idx + 1 : 1).toString().padStart(2, "0");

  return (
    <>
      <div className={styles.top} data-ocean-chrome>
        <span className={`${styles.label} ${styles.gold}`}>
          C / {num} &nbsp;&middot;&nbsp; {section.chamber}
        </span>
      </div>

      <div className={styles.bottom} data-ocean-chrome>
        <span className={styles.label}>Dallas-Fort Worth, TX</span>
        <span className={styles.label}>coastglobal.org &nbsp;/&nbsp; 2026</span>
      </div>
    </>
  );
}
