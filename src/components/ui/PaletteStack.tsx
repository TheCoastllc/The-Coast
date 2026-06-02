import type { Swatch } from "@/lib/content/coast";
import styles from "./PaletteStack.module.css";

/**
 * Color palette displayed as labeled swatches - the moodboard layout where
 * each color is a block with its hex code. Reusable theme: pass any swatch list.
 * Text color per swatch auto-flips for contrast against the background.
 */
function isLight(hex: string) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  // perceived luminance
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

export function PaletteStack({
  swatches,
  layout = "stack",
}: {
  swatches: Swatch[];
  layout?: "stack" | "row";
}) {
  return (
    <div className={styles.wrap} data-layout={layout}>
      {swatches.map((s) => {
        const dark = !isLight(s.hex);
        return (
          <div
            key={s.hex}
            className={styles.swatch}
            style={{ background: s.hex }}
            data-dark={dark}
          >
            <span className={styles.name}>{s.name}</span>
            <span className={styles.hex}>{s.hex.toUpperCase()}</span>
          </div>
        );
      })}
    </div>
  );
}
