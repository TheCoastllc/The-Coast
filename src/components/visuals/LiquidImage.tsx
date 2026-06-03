"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { EDITORIAL } from "@/lib/content/coast";

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uImgAspect;
  uniform float uViewAspect;
  varying vec2 vUv;

  void main() {
    // cover-fit the image into the viewport
    vec2 ratio = vec2(
      min(uViewAspect / uImgAspect, 1.0),
      min(uImgAspect / uViewAspect, 1.0)
    );
    vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    // ambient water ripple
    float t = uTime;
    uv.x += sin(uv.y * 16.0 + t * 1.5) * 0.006;
    uv.y += sin(uv.x * 20.0 + t * 1.2) * 0.006;

    // ripple ring around the cursor
    float d = distance(vUv, uMouse);
    uv += (sin(d * 38.0 - t * 4.0) * exp(-d * 6.0)) * 0.025;

    gl_FragColor = texture2D(uTex, uv);
  }
`;

function Plane({ src }: { src: string }) {
  const tex = useLoader(THREE.TextureLoader, src);
  tex.colorSpace = THREE.SRGBColorSpace;
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport, size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uImgAspect: {
        value: (tex.image?.width ?? 1) / (tex.image?.height ?? 1),
      },
      uViewAspect: { value: size.width / size.height },
    }),
    [tex, size.width, size.height]
  );

  useFrame((s) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = s.clock.elapsedTime;
    matRef.current.uniforms.uViewAspect.value = s.size.width / s.size.height;
  });

  return (
    <mesh
      scale={[viewport.width, viewport.height, 1]}
      onPointerMove={(e) => {
        if (matRef.current && e.uv) matRef.current.uniforms.uMouse.value.set(e.uv.x, e.uv.y);
      }}
    >
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={matRef} uniforms={uniforms} vertexShader={VERT} fragmentShader={FRAG} />
    </mesh>
  );
}

export function LiquidImage({ index = 0 }: { index?: number }) {
  const src = EDITORIAL[index % EDITORIAL.length].src;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9990 }}>
      <Canvas camera={{ position: [0, 0, 2], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true }}>
        <color attach="background" args={["#0A0C12"]} />
        <Suspense fallback={null}>
          <Plane src={src} />
        </Suspense>
      </Canvas>
    </div>
  );
}
