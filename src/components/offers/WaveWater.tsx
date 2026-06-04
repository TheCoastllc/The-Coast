"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { WaterShader } from "@/components/hero/water";

/**
 * Contained real-water panel for the CBI flagship "water" variant. Reuses the
 * proven hero WaterShader (same GLSL StoryHero renders) inside a panel-sized
 * canvas (absolute inset:0 in a positioned parent). Loaded via dynamic(ssr:false)
 * and gated upstream (desktop + after interaction), so three.js stays off the
 * critical path and off mobile.
 */
export function WaveWater() {
  return (
    <Canvas
      aria-hidden
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.4, 6], fov: 52 }}
      onCreated={({ camera }) => camera.lookAt(0, 0, -8)}
      style={{ position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
        <WaterShader
          amp={0.5}
          freq={0.5}
          deep="#04101f"
          crest="#1E5A9E"
          accent="#DB5227"
          foam="#7FD3C7"
          foamAmt={0.5}
          fog="#0A0C12"
          fogDensity={0.07}
          caustics={0.4}
          size={90}
          segments={120}
          position={[0, -1.3, -6]}
        />
      </Suspense>
    </Canvas>
  );
}
