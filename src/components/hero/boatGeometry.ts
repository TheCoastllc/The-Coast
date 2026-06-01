import * as THREE from "three";

/**
 * A stylized origami paper boat as faceted panels: pointed raised bow/stern,
 * a V hull, and the iconic central folded peak. Flat-shaded for the paper look.
 * (Kept for the standalone `?hero=` boat scene in scenes2.tsx.)
 */
export function makeBoatGeometry() {
  const v = new Float32Array([
    0, 0.35, 1.5, // 0 bow
    0, 0.35, -1.5, // 1 stern
    -1.0, 0.15, 0, // 2 left
    1.0, 0.15, 0, // 3 right
    0, -0.45, 0, // 4 keel
    0, 1.15, 0, // 5 peak
  ]);
  const idx = [
    // hull underside
    0, 2, 4, 0, 4, 3, 1, 4, 2, 1, 3, 4,
    // central folded peak
    5, 0, 3, 5, 3, 1, 5, 1, 2, 5, 2, 0,
  ];
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(v, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/**
 * A real boat HULL lofted from scaled cross-section ribs along the length.
 * Canonical frame: bow at -z, stern at +z, beam +-x, height +-y. Pointed raised
 * bow, broad transom, rockered keel, OPEN top (open deck). Reads as a boat both
 * head-on (bow toward camera) and broadside. Planar UVs (length x height) for the
 * marble map; smooth normals; centered. Render the material with side:DoubleSide.
 */
export function makeHull() {
  const LENGTH = 3.0;
  const BEAM = 1.18;
  const DEPTH = 0.62;
  const NSEC = 28; // stations along the length (0..NSEC)
  const NRIB = 10; // points per half-rib (deck edge -> keel)

  const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
  const smooth = (e0: number, e1: number, x: number) => {
    const t = clamp01((x - e0) / (e1 - e0));
    return t * t * (3 - 2 * t);
  };
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  // station curves; u = 0 at the bow, 1 at the stern
  const halfBeam = (u: number) => {
    const swell = Math.pow(Math.sin(Math.PI * clamp01((u - 0.02) / 0.98)), 0.7); // 0 bow, 1 mid, 0 stern
    const w = lerp(swell, Math.max(swell, 0.82), smooth(0.5, 1, u)); // hold a broad transom aft
    return (BEAM / 2) * Math.max(0.02, w); // pin nonzero so the bow point isn't degenerate
  };
  const deckTop = (u: number) =>
    DEPTH * 0.5 + 0.24 * smooth(0.34, 0, u) + 0.07 * smooth(0.9, 1, u); // raised bow + slight stern lift
  const keelBottom = (u: number) =>
    -DEPTH * 0.5 + DEPTH * 0.34 * (1 - Math.sin(Math.PI * clamp01(u))); // rocker: keel rises at bow + stern

  const cols = 2 * NRIB - 1; // full rib: left deck -> keel -> right deck
  const rows = NSEC + 1;
  const verts = new Float32Array(rows * cols * 3);

  for (let i = 0; i < rows; i++) {
    const u = i / NSEC;
    const hw = halfBeam(u);
    const yT = deckTop(u);
    const yB = keelBottom(u);
    const z = lerp(-LENGTH / 2, LENGTH / 2, u); // bow (-z) -> stern (+z)
    const rx: number[] = [];
    const ry: number[] = [];
    for (let j = 0; j < NRIB; j++) {
      const v = j / (NRIB - 1); // 0 deck edge -> 1 keel
      rx.push(hw * Math.pow(Math.cos((v * Math.PI) / 2), 0.7)); // full width at deck -> 0 at keel
      ry.push(yT + (yB - yT) * (v * v * (3 - 2 * v))); // ease, flattish toward the keel
    }
    for (let c = 0; c < cols; c++) {
      let x: number, y: number;
      if (c < NRIB - 1) {
        x = -rx[c]; // left side, deck -> near keel
        y = ry[c];
      } else {
        const k = c - (NRIB - 1); // keel (k=0) then up the right side
        x = rx[NRIB - 1 - k];
        y = ry[NRIB - 1 - k];
      }
      const idx = (i * cols + c) * 3;
      verts[idx] = x;
      verts[idx + 1] = y;
      verts[idx + 2] = z;
    }
  }

  const index: number[] = [];
  for (let i = 0; i < rows - 1; i++) {
    for (let c = 0; c < cols - 1; c++) {
      const a = i * cols + c;
      const b = (i + 1) * cols + c;
      const d = i * cols + c + 1;
      const e = (i + 1) * cols + c + 1;
      index.push(a, b, d, d, b, e);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
  geo.setIndex(index);
  geo.center();

  // planar UVs (length z x height y) so the marble reads on the broadside
  geo.computeBoundingBox();
  const bb = geo.boundingBox!;
  const sz = bb.max.z - bb.min.z || 1;
  const sy = bb.max.y - bb.min.y || 1;
  const pos = geo.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getZ(i) - bb.min.z) / sz;
    uv[i * 2 + 1] = (pos.getY(i) - bb.min.y) / sy;
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  geo.computeVertexNormals();
  return geo;
}

/** Back-compat alias - both hero scenes import makeBoatProfile. */
export const makeBoatProfile = makeHull;
