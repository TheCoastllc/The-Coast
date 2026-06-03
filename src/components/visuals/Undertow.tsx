"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { EDITORIAL } from "@/lib/content/coast";

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const FRAG = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uTime;
  uniform float uVel;   // current speed -> chromatic smear
  uniform float uFront; // 0..1 how surfaced/sharp this panel is
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    // gentle underwater ripple, calms as the panel surfaces
    float rip = mix(0.006, 0.0015, uFront);
    uv.x += sin(uv.y * 11.0 + uTime * 1.3) * rip;
    uv.y += sin(uv.x * 13.0 + uTime * 1.1) * rip;
    float sh = clamp(abs(uVel) * 0.6, 0.0, 0.05);
    float r = texture2D(uTex, uv + vec2(sh, 0.0)).r;
    float g = texture2D(uTex, uv).g;
    float b = texture2D(uTex, uv - vec2(sh, 0.0)).b;
    // sink distant panels into the blue dark
    vec3 col = vec3(r, g, b);
    col = mix(col * vec3(0.5, 0.62, 0.8), col, uFront);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Panel({
  src,
  rel,
  vel,
}: {
  src: string;
  rel: () => number;
  vel: () => number;
}) {
  const tex = useLoader(THREE.TextureLoader, src);
  tex.colorSpace = THREE.SRGBColorSpace;
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const [hover, setHover] = useState(false);
  const uniforms = useMemo(
    () => ({ uTex: { value: tex }, uTime: { value: 0 }, uVel: { value: 0 }, uFront: { value: 0 } }),
    [tex]
  );

  useFrame((s, dt) => {
    const g = group.current;
    if (!g) return;
    const r = rel();
    const a = Math.abs(r);
    const k = Math.min(dt * 8, 1);
    const tx = r * 2.7;
    const tz = -a * 1.7 + (hover ? 1.4 : 0);
    const ts = (1 - Math.min(a * 0.13, 0.6)) * (hover ? 1.14 : 1);
    g.position.x += (tx - g.position.x) * k;
    g.position.z += (tz - g.position.z) * k;
    const sc = g.scale.x + (ts - g.scale.x) * k;
    g.scale.set(sc, sc, 1);
    g.rotation.y += (-r * 0.16 - g.rotation.y) * k;
    if (mat.current) {
      const front = Math.max(0, 1 - a * 0.8) * (hover ? 1 : 0.85);
      mat.current.uniforms.uTime.value = s.clock.elapsedTime;
      mat.current.uniforms.uVel.value += ((hover ? 0 : vel()) - mat.current.uniforms.uVel.value) * 0.2;
      mat.current.uniforms.uFront.value += (front - mat.current.uniforms.uFront.value) * 0.15;
    }
  });

  return (
    <group ref={group}>
      <mesh onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
        <planeGeometry args={[1.7, 2.1, 1, 1]} />
        <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={VERT} fragmentShader={FRAG} />
      </mesh>
    </group>
  );
}

function Current() {
  const offset = useRef(0);
  const target = useRef(0);
  const vel = useRef(0);
  const { gl } = useThree();
  const N = EDITORIAL.length;

  useEffect(() => {
    const dom = gl.domElement;
    let dragging = false;
    let startX = 0;
    let startOffset = 0;
    const clamp = (v: number) => Math.max(0, Math.min(N - 1, v));
    const down = (e: PointerEvent) => {
      dragging = true;
      startX = e.clientX;
      startOffset = target.current;
      dom.setPointerCapture?.(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      target.current = clamp(startOffset - (e.clientX - startX) / 240);
    };
    const up = () => {
      dragging = false;
    };
    const wheel = (e: WheelEvent) => {
      target.current = clamp(target.current + e.deltaY * 0.0022 + e.deltaX * 0.0022);
    };
    dom.addEventListener("pointerdown", down);
    dom.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    dom.addEventListener("wheel", wheel, { passive: true });
    return () => {
      dom.removeEventListener("pointerdown", down);
      dom.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      dom.removeEventListener("wheel", wheel);
    };
  }, [gl, N]);

  useFrame(() => {
    const prev = offset.current;
    offset.current += (target.current - offset.current) * 0.1;
    vel.current = offset.current - prev;
  });

  return (
    <>
      {EDITORIAL.map((e, i) => (
        <Panel key={e.src} src={e.src} rel={() => i - offset.current} vel={() => vel.current} />
      ))}
    </>
  );
}

export function Undertow() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9990, cursor: "grab" }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }}>
        <color attach="background" args={["#06101c"]} />
        <fogExp2 attach="fog" args={["#06101c", 0.12]} />
        <ambientLight intensity={0.7} color="#7FA8D8" />
        <pointLight position={[4, 3, 5]} intensity={30} color="#DB5227" />
        <Suspense fallback={null}>
          <Current />
        </Suspense>
        <EffectComposer>
          <Bloom intensity={0.5} luminanceThreshold={0.5} luminanceSmoothing={0.7} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
