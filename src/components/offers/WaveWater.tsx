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
  /** a glowing sun over the horizon (the homepage-hero focal point) */
  sun?: boolean;
  sunY?: number;
  sunScale?: number;
  sunColor?: string;
};

/** A glowing sun built from layered discs (bright core + soft halos) - no
 *  post-processing needed, reads as a luminous sun over the water. */
function Sun({ y = 1.4, scale = 0.85, color = "#F4633A" }: { y?: number; scale?: number; color?: string }) {
  return (
    <group position={[0, y, -20]}>
      <mesh scale={scale * 5.2}>
        <circleGeometry args={[5, 40]} />
        <meshBasicMaterial color={color} transparent opacity={0.06} toneMapped={false} fog={false} depthWrite={false} />
      </mesh>
      <mesh scale={scale * 3}>
        <circleGeometry args={[5, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} toneMapped={false} fog={false} depthWrite={false} />
      </mesh>
      <mesh scale={scale * 1.7}>
        <circleGeometry args={[5, 56]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} toneMapped={false} fog={false} depthWrite={false} />
      </mesh>
      <mesh scale={scale}>
        <circleGeometry args={[5, 64]} />
        <meshBasicMaterial color="#FFE0B0" transparent toneMapped={false} fog={false} />
      </mesh>
    </group>
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
