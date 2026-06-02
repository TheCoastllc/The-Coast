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
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform float uMix;
  uniform float uAspectA;
  uniform float uAspectB;
  uniform float uViewAspect;
  varying vec2 vUv;

  vec2 coverUV(vec2 v, float imgA) {
    vec2 ratio = vec2(min(uViewAspect / imgA, 1.0), min(imgA / uViewAspect, 1.0));
    return vec2(v.x * ratio.x + (1.0 - ratio.x) * 0.5, v.y * ratio.y + (1.0 - ratio.y) * 0.5);
  }
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1, 0)), c = hash(i + vec2(0, 1)), d = hash(i + vec2(1, 1));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  void main() {
    float n = noise(vUv * 4.5);
    float edge = 0.28;
    float reveal = smoothstep(uMix - edge, uMix + edge, 1.0 - n);
    float drip = (1.0 - reveal) * 0.07 * (1.0 - abs(uMix - 0.5) * 2.0);
    vec4 a = texture2D(uTexA, coverUV(vUv + vec2(0.0, drip), uAspectA));
    vec4 b = texture2D(uTexB, coverUV(vUv - vec2(0.0, drip), uAspectB));
    gl_FragColor = mix(a, b, clamp(reveal, 0.0, 1.0));
  }
`;

function MeltPlane({ srcs }: { srcs: string[] }) {
  const texs = useLoader(THREE.TextureLoader, srcs);
  const { viewport } = useThree();
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const aspects = useMemo(
    () =>
      texs.map((t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        return (t.image?.width ?? 1) / (t.image?.height ?? 1);
      }),
    [texs]
  );

  const uniforms = useMemo(
    () => ({
      uTexA: { value: texs[0] },
      uTexB: { value: texs[1] ?? texs[0] },
      uMix: { value: 0 },
      uAspectA: { value: aspects[0] },
      uAspectB: { value: aspects[1] ?? aspects[0] },
      uViewAspect: { value: 1 },
    }),
    [texs, aspects]
  );

  useFrame((s) => {
    if (!matRef.current) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const p = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    const N = texs.length;
    const f = p * (N - 1);
    let i = Math.floor(f);
    if (i > N - 2) i = N - 2;
    if (i < 0) i = 0;
    const local = f - i;
    const u = matRef.current.uniforms;
    u.uTexA.value = texs[i];
    u.uTexB.value = texs[i + 1];
    u.uAspectA.value = aspects[i];
    u.uAspectB.value = aspects[i + 1];
    u.uMix.value = local;
    u.uViewAspect.value = s.size.width / s.size.height;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={matRef} uniforms={uniforms} vertexShader={VERT} fragmentShader={FRAG} />
    </mesh>
  );
}

export function ScrollMeltFilm() {
  const srcs = EDITORIAL.map((e) => e.src);
  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0, 2], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true }}>
          <color attach="background" args={["#0A0C12"]} />
          <Suspense fallback={null}>
            <MeltPlane srcs={srcs} />
          </Suspense>
        </Canvas>
      </div>
      {/* scroll runway that drives the melt */}
      <div style={{ height: `${EDITORIAL.length * 100}vh` }} aria-hidden />
    </>
  );
}
