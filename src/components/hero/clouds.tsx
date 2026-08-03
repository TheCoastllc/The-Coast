"use client";

import { MutableRefObject, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";

/**
 * Individual, distinct clouds (not volumetric smoke) - each a soft cloud-shaped
 * billboard that drifts across the sky on its own speed, like ironhill's leaves.
 * The cloud silhouette is drawn procedurally to a canvas texture (flat base,
 * puffy top), so it reads as a real cloud rather than a fog blob.
 * A photographic replacement is on hold until David picks reference imagery.
 */

const PUFFS: [number, number, number][][] = [
  // variant 0
  [
    [70, 108, 32], [110, 92, 44], [150, 104, 38], [185, 112, 26],
    [95, 116, 26], [135, 118, 24], [50, 116, 20],
  ],
  // variant 1 (wider)
  [
    [60, 110, 30], [100, 96, 40], [135, 88, 46], [175, 100, 40],
    [205, 112, 26], [118, 118, 26], [155, 120, 22],
  ],
  // variant 2 (small)
  [
    [90, 100, 34], [128, 88, 40], [165, 102, 30], [110, 114, 24], [148, 116, 22],
  ],
];

function makeCloudTexture(variant: number): THREE.Texture | null {
  if (typeof document === "undefined") return null;
  const w = 512;
  const h = 320;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.clearRect(0, 0, w, h);
  for (const [px0, py0, r0] of PUFFS[variant]) {
    const px = px0 * 2, py = py0 * 2, r = r0 * 2;
    const g = ctx.createRadialGradient(px, py, 0, px, py, r);
    g.addColorStop(0, "rgba(255,255,255,0.78)");
    g.addColorStop(0.55, "rgba(255,255,255,0.4)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

/** ?sky=up texture: SAME puff silhouettes, upgraded rendering - internal
 *  mini-puff structure instead of flat gradient circles, warm dawn underlight
 *  on the belly, cool top - still stylized, never photographic. Seeded PRNG so
 *  every mount draws the identical cloud. */
function makeCloudTextureUp(variant: number): THREE.Texture | null {
  if (typeof document === "undefined") return null;
  const w = 1024;
  const h = 640;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.clearRect(0, 0, w, h);
  let seed = variant * 7919 + 13;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const puff = (px: number, py: number, r: number, a: number) => {
    const g = ctx.createRadialGradient(px, py, 0, px, py, r);
    g.addColorStop(0, `rgba(255,255,255,${a})`);
    g.addColorStop(0.55, `rgba(255,255,255,${a * 0.5})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  };
  for (const [px0, py0, r0] of PUFFS[variant]) {
    const px = px0 * 4, py = py0 * 4, r = r0 * 4;
    puff(px, py, r, 0.74); // soft body carries the shape
    // internal structure: a few gentle density lifts, never speckle
    const n = 5 + Math.floor(rand() * 4);
    for (let i = 0; i < n; i++) {
      const ang = rand() * Math.PI * 2;
      const dist = rand() * r * 0.45;
      const rr = r * (0.24 + rand() * 0.22);
      puff(px + Math.cos(ang) * dist, py + Math.sin(ang) * dist * 0.6 - r * 0.12, rr, 0.06 + rand() * 0.1);
    }
  }
  // dawn underlight: a breath of warmth on the belly, only where cloud exists
  ctx.globalCompositeOperation = "source-atop";
  const warm = ctx.createLinearGradient(0, h, 0, h * 0.45);
  warm.addColorStop(0, "rgba(255,200,158,0.32)");
  warm.addColorStop(1, "rgba(255,200,158,0)");
  ctx.fillStyle = warm;
  ctx.fillRect(0, 0, w, h);
  // cool crown
  const cool = ctx.createLinearGradient(0, 0, 0, h * 0.5);
  cool.addColorStop(0, "rgba(162,182,206,0.12)");
  cool.addColorStop(1, "rgba(162,182,206,0)");
  ctx.fillStyle = cool;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "source-over";
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

type CloudDef = {
  x: number;
  y: number;
  z: number;
  scale: number;
  speed: number;
  tint: string;
  variant: number;
};

const CLOUDS: CloudDef[] = [
  { x: -10, y: 5.6, z: -22, scale: 6, speed: 0.28, tint: "#cdd6e0", variant: 0 },
  { x: 6, y: 6.9, z: -27, scale: 8, speed: 0.2, tint: "#c2ccd8", variant: 1 },
  { x: -7, y: 4.6, z: -19, scale: 4.4, speed: 0.34, tint: "#d8a87e", variant: 2 }, // warm wisp, off to the side of the sun
  { x: 13, y: 7.6, z: -31, scale: 10, speed: 0.15, tint: "#b9c4d2", variant: 0 },
  { x: -17, y: 8.2, z: -33, scale: 9, speed: 0.13, tint: "#aab6c6", variant: 1 },
  { x: -5, y: 3.3, z: -15, scale: 4, speed: 0.44, tint: "#cbb39a", variant: 2 }, // low warm wisp
];

const WRAP = 48;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const sstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

function CloudSprite({
  def,
  tex,
  progress,
}: {
  def: CloudDef;
  tex: THREE.Texture;
  progress?: MutableRefObject<number>;
}) {
  const ref = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const cools = useMemo(() => new THREE.Color(def.tint), [def.tint]);
  const warms = useMemo(() => new THREE.Color(def.tint).lerp(new THREE.Color("#f0c39a"), 0.65), [def.tint]);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (!ref.current) return;
    let x = def.x + t * def.speed;
    x = ((x + WRAP / 2) % WRAP + WRAP) % WRAP - WRAP / 2; // wrap across the sky
    ref.current.position.x = x;
    ref.current.position.y = def.y + Math.sin(t * 0.18 + def.z) * 0.3;
    // ?sky=up: clouds catch the descending sun - tints warm toward rose-gold
    if (progress && mat.current) {
      mat.current.color.lerpColors(cools, warms, sstep(0.3, 0.75, progress.current));
    }
  });
  return (
    <Billboard ref={ref} position={[def.x, def.y, def.z]}>
      <mesh scale={[def.scale * 1.7, def.scale, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial ref={mat} map={tex} color={def.tint} transparent opacity={0.9} depthWrite={false} />
      </mesh>
    </Billboard>
  );
}

export function DriftClouds({
  max = CLOUDS.length,
  up = false,
  progress,
}: {
  max?: number;
  up?: boolean;
  progress?: MutableRefObject<number>;
}) {
  const textures = useMemo(
    () =>
      up
        ? [makeCloudTextureUp(0), makeCloudTextureUp(1), makeCloudTextureUp(2)]
        : [makeCloudTexture(0), makeCloudTexture(1), makeCloudTexture(2)],
    [up]
  );
  if (!textures[0]) return null;
  return (
    <group>
      {CLOUDS.slice(0, max).map((d, i) => (
        <CloudSprite key={i} def={d} tex={textures[d.variant]!} progress={up ? progress : undefined} />
      ))}
    </group>
  );
}
