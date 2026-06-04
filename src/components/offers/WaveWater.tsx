"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
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
};

/**
 * Contained real-water panel - the same proven hero WaterShader (the 3D water
 * David signed off on) inside a panel-sized canvas. Parameterised so the CBI can
 * offer distinct moods (calm / dramatic / sunset). Loaded via dynamic(ssr:false).
 */
export function WaveWater({
  amp = 0.5,
  freq = 0.5,
  deep = "#04101f",
  crest = "#1E5A9E",
  accent = "#DB5227",
  foam = "#7FD3C7",
  foamAmt = 0.5,
  fog = "#0A0C12",
  fogDensity = 0.07,
  caustics = 0.4,
  reflect = 0,
  camY = 1.4,
  camZ = 6,
}: WaveWaterProps) {
  return (
    <Canvas
      aria-hidden
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.5]}
      camera={{ position: [0, camY, camZ], fov: 52 }}
      onCreated={({ camera }) => camera.lookAt(0, 0, -8)}
      style={{ position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
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
