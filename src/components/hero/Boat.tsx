"use client";

import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useLoader, useThree } from "@react-three/fiber";

export type BoatMode = "current" | "geo" | "paper" | "rig" | "all";

/** Key the render's near-black background to true transparency (alpha from
 *  luminance, lifted so the neon lines go solid). Additive blending would
 *  vanish against the giant bright sun the voyage sails across - with a real
 *  alpha channel + normal blending the yacht reads everywhere: glowing
 *  wireframe over the sun, luminous boat over the dark sea. */
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

function YachtBillboard() {
  const gl = useThree((s) => s.gl);
  const raw = useLoader(THREE.TextureLoader, "/story/boat-hd-b.png");
  const tex = useMemo(() => keyBlackToAlpha(raw.image as HTMLImageElement), [raw]);
  useEffect(() => {
    tex.anisotropy = gl.capabilities.getMaxAnisotropy();
    tex.needsUpdate = true;
  }, [tex, gl]);

  return (
    /* image waterline sits ~2/3 down the frame - lift so the hull rides where
       the old profile hull's waterline was (group origin ~ -0.3) */
    /* angled ~32deg off broadside: with the voyage group's PI flip this
       reads as a three-quarter view - bow leading, approaching the viewer -
       instead of a flat cardboard side profile */
    <mesh position={[0, 0.55, 0]} rotation={[0, 0.56, 0]} scale={[5.2, 5.2, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={tex}
        transparent
        depthWrite={false}
        toneMapped={false}
        side={THREE.DoubleSide}
        fog={false}
      />
    </mesh>
  );
}

/** The hero boat: the neon yacht render as a glowing billboard - its baked
 *  light-pool doubles as the boat's glow on the sea. StoryHero drives the
 *  group transform (voyage: emerges from the sun, nears the camera; the flat
 *  plane reads as the yacht gliding in profile). */
export function Boat({ mode = "all" }: { mode?: BoatMode }) {
  void mode;
  return (
    <Suspense fallback={null}>
      <YachtBillboard />
    </Suspense>
  );
}
