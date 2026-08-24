"use client";

import { MatteImage } from "@/components/ui/MatteImage";

/**
 * The 4 detail "moments" of a rich project, as a horizontal strip pinned to the
 * lower edge of a full-bleed frame. On desktop it scrolls-snaps; the frame's
 * ambient scrim keeps it readable. Cover-only projects render nothing here.
 */
export function MomentFilmstrip({
  moments,
}: {
  moments: { image: string; caption: string }[];
}) {
  return (
    <div className="wk-strip" aria-hidden>
      {moments.slice(0, 4).map((m) => (
        <figure key={m.image} className="wk-strip-cell">
          <MatteImage
            className="wk-strip-img"
            src={m.image}
            alt={m.caption}
            mode="grain-color"
            sizes="(max-width: 900px) 44vw, 20vw"
          />
          <figcaption className="wk-strip-cap">{m.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
