"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";

/**
 * Individual, distinct clouds (not volumetric smoke) - each a soft cloud-shaped
 * billboard that drifts across the sky on its own speed, like ironhill's leaves.
 * The cloud silhouette is drawn procedurally to a canvas texture (flat base,
 * puffy top), so it reads as a real cloud rather than a fog blob.
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
  const w = 256;
  const h = 160;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.clearRect(0, 0, w, h);
  for (const [px, py, r] of PUFFS[variant]) {
    const g = ctx.createRadialGradient(px, py, 0, px, py, r);
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(0.55, "rgba(255,255,255,0.55)");
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

function CloudSprite({ def, tex }: { def: CloudDef; tex: THREE.Texture }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (!ref.current) return;
    let x = def.x + t * def.speed;
    x = ((x + WRAP / 2) % WRAP + WRAP) % WRAP - WRAP / 2; // wrap across the sky
    ref.current.position.x = x;
    ref.current.position.y = def.y + Math.sin(t * 0.18 + def.z) * 0.3;
  });
  return (
    <Billboard ref={ref} position={[def.x, def.y, def.z]}>
      <mesh scale={[def.scale * 1.7, def.scale, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={tex} color={def.tint} transparent opacity={0.9} depthWrite={false} />
      </mesh>
    </Billboard>
  );
}

export function DriftClouds({ max = CLOUDS.length }: { max?: number }) {
  const textures = useMemo(
    () => [makeCloudTexture(0), makeCloudTexture(1), makeCloudTexture(2)],
    []
  );
  if (!textures[0]) return null;
  return (
    <group>
      {CLOUDS.slice(0, max).map((d, i) => (
        <CloudSprite key={i} def={d} tex={textures[d.variant]!} />
      ))}
    </group>
  );
}
