"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { COMPANY } from "@/lib/content/coast";
import { useQuality, useInView } from "@/lib/perf";
import styles from "./FoldingBoat.module.css";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

const BASE_Y = 0.0; // the boat sits centered in frame
const SPAN = 13.5; // traverse width - wide enough to wrap fully off-screen (no visible jump)
const SAIL_SPEED = 0.55;
const SIZE = 3.1; // billboard plane size (image is square)

/** Soft radial texture used both to feather the billboard edges (the render's
 *  background isn't pure black, so additive alone leaves a plate edge) and,
 *  tinted, as the mist puffs. */
function makeRadialTexture(inner = 0.58) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, "#fff");
  grad.addColorStop(inner, "#fff");
  grad.addColorStop(1, "#000");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

/** Vertical fade for the reflection - strongest at the waterline, gone below. */
function makeFadeTexture() {
  const c = document.createElement("canvas");
  c.width = 4;
  c.height = 256;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, "#fff");
  grad.addColorStop(0.55, "#333");
  grad.addColorStop(1, "#000");
  g.fillStyle = grad;
  g.fillRect(0, 0, 4, 256);
  return new THREE.CanvasTexture(c);
}

/** The finale boat: David's neon yacht render, treated live - teal glow aura,
 *  drifting mist at the waterline, mirrored water reflection. Black-background
 *  render composites additively (black contributes nothing). */
function FinaleBoat() {
  const src = "/story/boat-hd-b.png";
  const root = useRef<THREE.Group>(null);
  const mistRefs = useRef<(THREE.Mesh | null)[]>([]);
  const reflRef = useRef<THREE.Mesh>(null);
  const gl = useThree((s3) => s3.gl);
  const tex = useLoader(THREE.TextureLoader, src);
  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    // max anisotropy keeps the texture crisp when the plane heels obliquely
    tex.anisotropy = gl.capabilities.getMaxAnisotropy();
    tex.needsUpdate = true;
  }, [tex, gl]);

  const featherMap = useMemo(() => makeRadialTexture(0.58), []);
  const mistMap = useMemo(() => makeRadialTexture(0.12), []);
  const fadeMap = useMemo(() => makeFadeTexture(), []);

  // mist puffs: phase / drift-span / size / base opacity
  const puffs = useMemo(
    () => [
      { phase: 0.0, span: 0.9, size: 2.4, y: -0.92, opacity: 0.17 },
      { phase: 2.1, span: 1.3, size: 1.7, y: -0.78, opacity: 0.2 },
      { phase: 4.4, span: 1.1, size: 2.8, y: -1.04, opacity: 0.14 },
      { phase: 3.2, span: 2.2, size: 4.6, y: -1.12, opacity: 0.09 }, // wide fog bed
    ],
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (root.current) {
      // one-way left -> right traverse; wraps from off-screen-right to off-screen-left
      const cross = ((t * SAIL_SPEED + SPAN / 2) % SPAN) - SPAN / 2;
      root.current.position.x = cross;
      root.current.position.y = BASE_Y + Math.sin(t * 1.0) * 0.06; // gentle bob
      root.current.rotation.z = Math.sin(t * 0.7) * 0.04; // gentle heel
    }
    // the reflection shimmers like water
    if (reflRef.current) {
      reflRef.current.scale.x = SIZE * (1 + 0.014 * Math.sin(t * 1.7));
      (reflRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.24 + 0.05 * Math.sin(t * 0.9);
    }
    // mist breathes and drifts around the hull
    mistRefs.current.forEach((m, i) => {
      if (!m) return;
      const p = puffs[i];
      m.position.x = Math.sin(t * 0.18 + p.phase) * p.span;
      m.position.y = p.y + Math.sin(t * 0.32 + p.phase * 1.7) * 0.05;
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = p.opacity * (0.75 + 0.25 * Math.sin(t * 0.45 + p.phase));
    });
  });

  return (
    <group ref={root} position={[0, BASE_Y, 0]}>
      {/* neon aura - teal-tinted duplicate behind; Bloom smears it into a glow */}
      <mesh position={[0, 0, -0.06]} scale={[SIZE * 1.03, SIZE * 1.03, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={tex}
          alphaMap={featherMap}
          color="#69d8c8"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* the boat itself */}
      <mesh scale={[SIZE, SIZE, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={tex}
          alphaMap={featherMap}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* water reflection - mirrored, faded toward the depths */}
      <mesh ref={reflRef} position={[0, -SIZE * 0.62, 0.02]} scale={[SIZE, -SIZE, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={tex}
          alphaMap={fadeMap}
          transparent
          opacity={0.24}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* drifting mist at the waterline */}
      {puffs.map((p, i) => (
        <mesh
          key={i}
          ref={(el) => {
            mistRefs.current[i] = el;
          }}
          position={[0, p.y, 0.08]}
          scale={[p.size, p.size * 0.45, 1]}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={mistMap}
            color="#9fd8d2"
            transparent
            opacity={p.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export function FoldingBoat() {
  const ref = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const aRef = useRef<HTMLSpanElement>(null);
  const bRef = useRef<HTMLSpanElement>(null);
  const q = useQuality();
  const inView = useInView(ref, "20% 0px");

  // crossfade the tagline across the scroll + fade the whole fixed layer in/out
  useEffect(() => {
    let raf = 0;
    const apply = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const raw = clamp01((vh - r.top) / (r.height + vh));

      // fixed layer fades in as the finale enters, out as the footer arrives
      if (layerRef.current) {
        layerRef.current.style.opacity = String(smoothstep(0.02, 0.12, raw) * (1 - smoothstep(0.88, 1, raw)));
      }

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const aOut = reduce ? 1 : smoothstep(0.32, 0.52, raw);
      if (aRef.current) {
        aRef.current.style.opacity = String(1 - aOut);
        aRef.current.style.transform = `translateY(${-26 * aOut}px)`;
        aRef.current.style.filter = `blur(${7 * aOut}px)`;
      }
      const bIn = reduce ? 1 : smoothstep(0.48, 0.7, raw);
      if (bRef.current) {
        bRef.current.style.opacity = String(bIn);
        bRef.current.style.transform = `translateY(${26 * (1 - bIn)}px)`;
        bRef.current.style.filter = `blur(${7 * (1 - bIn)}px)`;
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      {/* scroll-runway spacer (drives the layer fade + tagline crossfade); the boat is in a fixed layer */}
      <section ref={ref} className={styles.section} aria-hidden />
      <div ref={layerRef} className={styles.layer} style={{ display: inView ? "block" : "none" }}>
        <div className={styles.canvasWrap}>
          <Canvas
            frameloop={inView ? "always" : "never"}
            gl={{ antialias: q.tier !== "low", alpha: true }}
            camera={{ position: [0, 0.4, 7], fov: 42, near: 0.1, far: 60 }}
            onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
            dpr={q.dpr}
          >
            <Suspense fallback={null}>
              <FinaleBoat />
            </Suspense>
            {q.postfx && (
              <EffectComposer>
                <Bloom intensity={0.85} luminanceThreshold={0.38} luminanceSmoothing={0.7} mipmapBlur />
              </EffectComposer>
            )}
          </Canvas>
        </div>
        <div className={styles.copy}>
          <p className={styles.label}>The Craft</p>
          <h2 className={`${styles.title} no-marble`} aria-label={COMPANY.promise}>
            <span ref={aRef} className={styles.phraseA}>{COMPANY.promiseA}</span>
            <span ref={bRef} className={styles.phraseB}>{COMPANY.promiseB}</span>
          </h2>
        </div>
      </div>
    </>
  );
}
