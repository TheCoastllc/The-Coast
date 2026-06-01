"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { makeBoatProfile } from "./boatGeometry";
import { COMPANY } from "@/lib/content/coast";
import { useQuality, useInView } from "@/lib/perf";
import styles from "./FoldingBoat.module.css";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

const BASE_Y = 0.0; // the boat sits centered in frame
const SPAN = 13.5; // sail traverse width - wide enough to wrap fully off-screen (no visible jump)
const SAIL_SPEED = 0.55;

/** The page-end finale: a pale matte sailboat (profile) sailing left -> right
 *  across the dark, looping by wrapping off-screen. No fold - stone doesn't fold. */
function SailScene() {
  const root = useRef<THREE.Group>(null);
  const hullGeo = useMemo(() => makeBoatProfile(), []);
  const sailGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([0.02, 0.15, 0, 0.02, 1.45, 0, -0.9, 0.25, 0]), 3)
    );
    g.computeVertexNormals();
    return g;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (root.current) {
      // one-way left -> right traverse; wraps from off-screen-right to off-screen-left
      const cross = ((t * SAIL_SPEED + SPAN / 2) % SPAN) - SPAN / 2;
      root.current.position.x = cross;
      root.current.position.y = BASE_Y + Math.sin(t * 1.0) * 0.06; // gentle bob
      root.current.rotation.y = Math.sin(t * 0.3) * 0.05; // ~broadside, faint life
      root.current.rotation.z = Math.sin(t * 0.7) * 0.05; // gentle heel
    }
  });

  return (
    <>
      <ambientLight intensity={0.85} color="#9FB6D2" />
      <directionalLight position={[4, 8, 5]} intensity={3.2} color="#FFF4EA" />
      <directionalLight position={[-5, 3, -2]} intensity={1.1} color="#2E6CA8" />
      <pointLight position={[-3, 2.5, 4]} intensity={5} color="#DB5227" />

      <group ref={root} position={[0, BASE_Y, 0]}>
        {/* pale matte hull - rotated broadside (bow +x) to match the sail rig */}
        <mesh geometry={hullGeo} rotation={[0, -Math.PI / 2, 0]}>
          <meshStandardMaterial
            color="#CBD2D9"
            roughness={0.5}
            metalness={0}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* mast + triangular sail */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.8, 10]} />
          <meshStandardMaterial color="#8a7860" roughness={0.85} />
        </mesh>
        <mesh geometry={sailGeo}>
          <meshStandardMaterial color="#DB5227" side={THREE.DoubleSide} roughness={0.7} toneMapped={false} />
        </mesh>
      </group>
    </>
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
              <SailScene />
            </Suspense>
            {q.postfx && (
              <EffectComposer>
                <Bloom intensity={0.4} luminanceThreshold={0.6} luminanceSmoothing={0.7} mipmapBlur />
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
