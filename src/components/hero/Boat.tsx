"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { makeBoatProfile } from "./boatGeometry";

export type BoatMode = "current" | "geo" | "paper" | "rig" | "all";

function radialTexture(): THREE.Texture | null {
  if (typeof document === "undefined") return null;
  const s = 128;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(2,6,12,0.7)");
  g.addColorStop(0.6, "rgba(2,6,12,0.3)");
  g.addColorStop(1, "rgba(2,6,12,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

/** The hero boat: a pale matte PROFILE hull with a mast + triangular sail and
 *  a soft contact shadow on the water. Seen broadside so it reads as a boat;
 *  the bow points +x, so it sails to the right. */
export function Boat({ mode = "all" }: { mode?: BoatMode }) {
  void mode;
  const geo = useMemo(() => makeBoatProfile(), []);
  const shadowTex = useMemo(() => radialTexture(), []);
  const sailGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    // tall mainsail aft of the mast (mast at x~0, sail trails to -x / the stern)
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([0.02, 0.15, 0, 0.02, 1.45, 0, -0.9, 0.25, 0]), 3)
    );
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <group>
      {/* pale matte hull (open deck -> DoubleSide so the interior shows) */}
      <mesh geometry={geo}>
        <meshStandardMaterial
          color="#CBD2D9"
          roughness={0.5}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* mast + triangular sail */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.8, 10]} />
        <meshStandardMaterial color="#8a7860" roughness={0.85} />
      </mesh>
      <mesh geometry={sailGeo}>
        <meshStandardMaterial color="#DB5227" side={THREE.DoubleSide} roughness={0.7} toneMapped={false} />
      </mesh>

      {/* soft contact shadow on the water */}
      {shadowTex && (
        <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.2, 3.6]} />
          <meshBasicMaterial map={shadowTex} transparent opacity={0.5} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}
