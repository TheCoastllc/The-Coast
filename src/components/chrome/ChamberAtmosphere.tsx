"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useQuality } from "@/lib/perf";

/**
 * Persistent ambient background that lives behind every chamber.
 * A slow drift of faint warm motes - dust in a shaft of light.
 * Light by design: no postprocessing, transparent canvas, adaptive DPR +
 * particle count by device tier, and it pauses when the tab is hidden so it
 * never steals frames from scrolling or the cursor.
 */

const COUNT_BY_TIER = { low: 500, mid: 1100, high: 1800 } as const;

const VERT = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform vec2 uMouse;
  varying float vA;
  void main() {
    vec3 p = position;
    float speed = 0.04 + aSeed * 0.12;
    // drift upward and wrap within a 20-unit band
    p.y = mod(p.y + uTime * speed + 10.0, 20.0) - 10.0;
    p.x += sin(uTime * 0.2 + aSeed * 30.0) * 0.35;
    // subtle parallax toward the mouse
    p.xy += uMouse * (0.4 + aSeed * 0.6);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (0.6 + aSeed) * (60.0 / -mv.z);
    vA = 0.3 + 0.7 * aSeed;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColor;
  varying float vA;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d) * 0.13 * vA;
    gl_FragColor = vec4(uColor, a);
  }
`;

function Motes({ color, count }: { color: number; count: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  const { geometry, uniforms } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = -6 + Math.random() * 8;
      seed[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    const u = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor: { value: new THREE.Color(0x9a814f) },
    };
    return { geometry: geo, uniforms: u };
  }, [count]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth - 0.5) * 0.6;
      mouse.current.ty = -(e.clientY / window.innerHeight - 0.5) * 0.6;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    if (matRef.current) matRef.current.uniforms.uColor.value.set(color);
  }, [color]);

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    const m = mouse.current;
    m.x += (m.tx - m.x) * 0.03;
    m.y += (m.ty - m.y) * 0.03;
    matRef.current.uniforms.uMouse.value.set(m.x, m.y);
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function ChamberAtmosphere({ color = 0x9a814f }: { color?: number }) {
  const q = useQuality();
  const [enabled, setEnabled] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEnabled(false);
      return;
    }
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (!enabled) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
      aria-hidden
    >
      <Canvas
        gl={{ alpha: true, antialias: q.tier !== "low", powerPreference: "low-power" }}
        camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 60 }}
        dpr={q.dpr}
        frameloop={paused ? "never" : "always"}
      >
        <Motes color={color} count={COUNT_BY_TIER[q.tier]} />
      </Canvas>
    </div>
  );
}
