"use client";

import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";

export type BoatMode = "current" | "geo" | "paper" | "rig" | "all";

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/** The flagship in the voyage: real photographic cutouts with true alpha
 *  (background-removed), composited with normal blending. The BOW view charges
 *  the approach; as she arrives (voyage ease -> 1) she turns to present her
 *  full profile - a crossfade driven by the ease StoryHero publishes on the
 *  parent group's userData each frame. */
function Flagship() {
  const gl = useThree((s) => s.gl);
  const root = useRef<THREE.Group>(null);
  const bowMat = useRef<THREE.MeshBasicMaterial>(null);
  const sideMat = useRef<THREE.MeshBasicMaterial>(null);
  const [side, bow] = useLoader(THREE.TextureLoader, [
    "/story/flagship-side.png",
    "/story/flagship-bow.png",
  ]);
  useEffect(() => {
    for (const t of [side, bow]) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = gl.capabilities.getMaxAnisotropy();
      t.needsUpdate = true;
    }
  }, [side, bow, gl]);

  useFrame(() => {
    const group = root.current?.parent;
    const ease = (group?.userData.ease as number | undefined) ?? 1;
    const turn = smoothstep(0.8, 0.96, ease);
    if (bowMat.current) bowMat.current.opacity = 1 - turn;
    if (sideMat.current) sideMat.current.opacity = turn;
  });

  // cutouts are content-trimmed - plane aspect matches each texture's measured
  // ratio (bow 2.035:1, side 5.644:1) so she never distorts, and each plane's
  // y-center puts her hull on the same waterline the old frame established
  return (
    <group ref={root}>
      <mesh position={[0, 0.05, 0.01]} scale={[4.8, 4.8 / 2.035, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={bowMat}
          map={bow}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          fog={false}
        />
      </mesh>
      <mesh position={[0, 0.0, 0]} rotation={[0, 0.5, 0]} scale={[6.4, 6.4 / 5.644, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={sideMat}
          map={side}
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
          fog={false}
        />
      </mesh>
    </group>
  );
}

export function Boat({ mode = "all" }: { mode?: BoatMode }) {
  void mode;
  return (
    <Suspense fallback={null}>
      <Flagship />
    </Suspense>
  );
}
