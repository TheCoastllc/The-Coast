"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { WaterShader } from "@/components/hero/water";

/** IDEA 3 - "Liquid": a real rippling water surface (R3F) behind the plates. */
export function WaveLiquid() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        opacity: 0.5,
        pointerEvents: "none",
      }}
    >
      <Canvas
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.4, 6], fov: 52 }}
        onCreated={({ camera }) => camera.lookAt(0, 0, -8)}
      >
        <Suspense fallback={null}>
          <WaterShader
            amp={0.5}
            freq={0.5}
            deep="#04101f"
            crest="#1E5A9E"
            accent="#DB5227"
            fog="#0A0C12"
            fogDensity={0.07}
            size={90}
            segments={150}
            position={[0, -1.3, -6]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
