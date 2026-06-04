"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { CanvasTexture } from "three";
import { WaterShader } from "@/components/hero/water";

export type WaveWaterProps = {
  amp?: number;
  freq?: number;
  deep?: string;
  crest?: string;
  accent?: string;
  foam?: string;
  foamAmt?: number;
  fog?: string;
  fogDensity?: number;
  caustics?: number;
  reflect?: number;
  /** camera height + distance - lower/closer reads more dramatic */
  camY?: number;
  camZ?: number;
  /** a glowing sun over the horizon (the homepage-hero focal point) */
  sun?: boolean;
  sunY?: number;
  sunScale?: number;
  sunColor?: string;
};

/** A glowing sun: one plane with a smooth radial-gradient texture (bright core ->
 *  warm halo -> transparent). No rings, no post-processing - a clean luminous sun. */
function Sun({ y = 1.4, scale = 0.85, color = "#F4633A" }: { y?: number; scale?: number; color?: string }) {
  const tex = useMemo(() => {
    const s = 256;
    const c = document.createElement("canvas");
    c.width = c.height = s;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0.0, "rgba(255,238,206,1)");
    g.addColorStop(0.12, "rgba(255,224,176,1)");
    g.addColorStop(0.2, color);
    g.addColorStop(0.42, "rgba(244,99,58,0.32)");
    g.addColorStop(1.0, "rgba(244,99,58,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    return new CanvasTexture(c);
  }, [color]);
  return (
    <mesh position={[0, y, -20]} scale={scale * 11}>
      <planeGeometry args={[5, 5]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} fog={false} depthWrite={false} />
    </mesh>
  );
}

/**
 * Contained real-water panel - the same proven hero WaterShader (the 3D water
 * David signed off on) inside a panel-sized canvas, now with a glowing sun over
 * the horizon so it reads like a mini homepage hero. Parameterised for distinct
 * CBI moods (calm / dramatic / sunset). Loaded via dynamic(ssr:false).
 */
export function WaveWater({
  amp = 0.65,
  freq = 0.52,
  deep = "#06182e",
  crest = "#2E6CA8",
  accent = "#F4633A",
  foam = "#9fe6db",
  foamAmt = 0.7,
  fog = "#0b1a2c",
  fogDensity = 0.03,
  caustics = 0.5,
  reflect = 0.6,
  camY = 1.15,
  camZ = 6,
  sun = true,
  sunY = 1.5,
  sunScale = 0.8,
  sunColor = "#F4633A",
}: WaveWaterProps) {
  return (
    <Canvas
      aria-hidden
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.5]}
      camera={{ position: [0, camY, camZ], fov: 52 }}
      onCreated={({ camera }) => camera.lookAt(0, 0.2, -8)}
      style={{ position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
        {sun && <Sun y={sunY} scale={sunScale} color={sunColor} />}
        <WaterShader
          amp={amp}
          freq={freq}
          deep={deep}
          crest={crest}
          accent={accent}
          foam={foam}
          foamAmt={foamAmt}
          fog={fog}
          fogDensity={fogDensity}
          caustics={caustics}
          reflect={reflect}
          size={90}
          segments={120}
          position={[0, -1.3, -6]}
        />
      </Suspense>
    </Canvas>
  );
}
