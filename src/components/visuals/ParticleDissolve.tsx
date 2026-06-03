"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EDITORIAL } from "@/lib/content/coast";

const GW = 100;
const GH = 125;

type ImgData = { pos: Float32Array; col: Float32Array; count: number };

function useImageData(src: string): ImgData | null {
  const [data, setData] = useState<ImgData | null>(null);
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = GW;
      c.height = GH;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      const ia = img.width / img.height;
      const ca = GW / GH;
      let dw = GW, dh = GH, dx = 0, dy = 0;
      if (ia > ca) { dh = GH; dw = GH * ia; dx = (GW - dw) / 2; }
      else { dw = GW; dh = GW / ia; dy = (GH - dh) / 2; }
      ctx.drawImage(img, dx, dy, dw, dh);
      const id = ctx.getImageData(0, 0, GW, GH).data;
      const count = GW * GH;
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      let k = 0;
      for (let y = 0; y < GH; y++) {
        for (let x = 0; x < GW; x++) {
          const i = (y * GW + x) * 4;
          pos[k * 3] = (x / GW - 0.5) * 6 * ca;
          pos[k * 3 + 1] = -(y / GH - 0.5) * 6;
          pos[k * 3 + 2] = 0;
          col[k * 3] = id[i] / 255;
          col[k * 3 + 1] = id[i + 1] / 255;
          col[k * 3 + 2] = id[i + 2] / 255;
          k++;
        }
      }
      if (!cancelled) setData({ pos, col, count });
    };
    return () => { cancelled = true; };
  }, [src]);
  return data;
}

const PVERT = /* glsl */ `
  attribute vec3 aColor;
  attribute vec3 aScatter;
  attribute float aSeed;
  uniform float uProgress;
  uniform float uTime;
  uniform vec3 uMouse;
  uniform float uPixelRatio;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    float e = uProgress * uProgress * (3.0 - 2.0 * uProgress);
    vec3 p = mix(aScatter, position, e);
    p.x += sin(uTime * 0.6 + aSeed * 30.0) * 0.02;
    p.y += cos(uTime * 0.5 + aSeed * 28.0) * 0.02;
    float d = distance(p, uMouse);
    if (d < 1.2) p += normalize(p - uMouse) * (1.2 - d) * 0.7;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uPixelRatio * (60.0 / -mv.z) * (0.55 + aSeed * 0.4) * mix(0.4, 1.0, e);
  }
`;
const PFRAG = /* glsl */ `
  varying vec3 vColor;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    if (length(uv) > 0.5) discard;
    gl_FragColor = vec4(vColor, 1.0);
  }
`;

function Cloud({ data }: { data: ImgData }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector3(999, 999, 0));
  const start = useRef<number | null>(null);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data.pos, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(data.col, 3));
    const sc = new Float32Array(data.count * 3);
    const seed = new Float32Array(data.count);
    for (let i = 0; i < data.count; i++) {
      const r = 6 + Math.random() * 7;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      sc[i * 3] = r * Math.sin(ph) * Math.cos(th);
      sc[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      sc[i * 3 + 2] = r * Math.cos(ph);
      seed[i] = Math.random();
    }
    g.setAttribute("aScatter", new THREE.BufferAttribute(sc, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [data]);

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector3(999, 999, 0) },
      uPixelRatio: { value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1 },
    }),
    []
  );

  useFrame((s) => {
    if (start.current === null) start.current = s.clock.elapsedTime;
    const p = Math.min(1, (s.clock.elapsedTime - start.current) / 2.4);
    if (mat.current) {
      mat.current.uniforms.uProgress.value = p;
      mat.current.uniforms.uTime.value = s.clock.elapsedTime;
      mat.current.uniforms.uMouse.value.copy(mouse.current);
    }
  });

  return (
    <>
      <points geometry={geo}>
        <shaderMaterial
          ref={mat}
          uniforms={uniforms}
          vertexShader={PVERT}
          fragmentShader={PFRAG}
          transparent
          depthWrite={false}
        />
      </points>
      <mesh
        onPointerMove={(e) => mouse.current.copy(e.point)}
        onPointerOut={() => mouse.current.set(999, 999, 0)}
      >
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  );
}

export function ParticleDissolve({ index = 0 }: { index?: number }) {
  const data = useImageData(EDITORIAL[index % EDITORIAL.length].src);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9990 }}>
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }}>
        <color attach="background" args={["#0A0C12"]} />
        {data && <Cloud data={data} />}
      </Canvas>
    </div>
  );
}
