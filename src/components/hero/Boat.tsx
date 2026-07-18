"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";

export type BoatMode = "current" | "geo" | "paper" | "rig" | "all";

/** Key the render's near-black background to true transparency (alpha from
 *  luminance, lifted so the neon lines go solid). Additive blending would
 *  vanish against the giant bright sun the voyage sails across - with a real
 *  alpha channel + normal blending the yacht reads everywhere. */
function keyBlackToAlpha(img: HTMLImageElement | ImageBitmap): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = img.width;
  c.height = img.height;
  const g = c.getContext("2d")!;
  g.drawImage(img, 0, 0);
  const d = g.getImageData(0, 0, c.width, c.height);
  const px = d.data;
  for (let i = 0; i < px.length; i += 4) {
    const lum = Math.max(px[i], px[i + 1], px[i + 2]);
    px[i + 3] = Math.min(255, Math.round(lum * 1.6));
  }
  g.putImageData(d, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

function YachtBillboard() {
  const gl = useThree((s) => s.gl);
  const bowMat = useRef<THREE.MeshBasicMaterial>(null);
  const sideMat = useRef<THREE.MeshBasicMaterial>(null);
  const root = useRef<THREE.Group>(null);
  const [rawSide, rawBow] = useLoader(THREE.TextureLoader, [
    "/story/boat-hd-b.png",
    "/story/boat-hd-bow.png",
  ]);
  const side = useMemo(() => keyBlackToAlpha(rawSide.image as HTMLImageElement), [rawSide]);
  const bow = useMemo(() => keyBlackToAlpha(rawBow.image as HTMLImageElement), [rawBow]);
  useEffect(() => {
    for (const t of [side, bow]) {
      t.anisotropy = gl.capabilities.getMaxAnisotropy();
      t.needsUpdate = true;
    }
  }, [side, bow, gl]);

  // the approach shows the BOW view; as the yacht arrives (voyage ease -> 1)
  // it turns to present broadside - crossfade driven by StoryHero's per-frame
  // ease published on the parent group's userData.
  useFrame(() => {
    const group = root.current?.parent;
    const ease = (group?.userData.ease as number | undefined) ?? 1;
    const turn = smoothstep(0.82, 0.97, ease);
    if (bowMat.current) bowMat.current.opacity = 1 - turn;
    if (sideMat.current) sideMat.current.opacity = turn;
  });

  return (
    <group ref={root}>
      {/* bow view - head-on, approaching the viewer */}
      <mesh position={[0, 0.55, 0.01]} scale={[5.2, 5.2, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={bowMat}
          map={bow}
          transparent
          depthWrite={false}
          toneMapped={false}
          side={THREE.DoubleSide}
          fog={false}
        />
      </mesh>
      {/* side view - the yacht turned broadside on arrival */}
      <mesh position={[0, 0.55, 0]} rotation={[0, 0.56, 0]} scale={[5.2, 5.2, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={sideMat}
          map={side}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
          side={THREE.DoubleSide}
          fog={false}
        />
      </mesh>
    </group>
  );
}

/** The hero boat: the neon yacht as a glowing two-view billboard - bow view
 *  through the approach, turning broadside as it arrives. StoryHero drives
 *  the group transform and publishes the voyage ease on group.userData. */
export function Boat({ mode = "all" }: { mode?: BoatMode }) {
  void mode;
  return (
    <Suspense fallback={null}>
      <YachtBillboard />
    </Suspense>
  );
}
