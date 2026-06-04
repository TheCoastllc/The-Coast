"use client";

import { Suspense, useMemo, useRef, MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { WATER_VERT, WATER_FRAG } from "./water";
import { Boat, BoatMode } from "./Boat";
import { DriftClouds } from "./clouds";
import { useHeroProgress } from "./useHeroProgress";
import { useHeroQuality, useActiveByScroll } from "@/lib/perf";
import { usePremiumActive } from "@/components/chrome/usePremium";

/* Acts: open IN THE WAVES with a tiny sun anchored above the headline ->
   the sun GROWS and DESCENDS to the horizon -> the origami boat meets it.
   meet="cross": boat crosses the sun's face.  meet="reflect": boat rides
   the sun's reflection. One sea, one camera, scroll-driven. */

export type MeetMode = "cross" | "reflect";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

type V3 = [number, number, number];
type Key = { p: number; pos: V3; look: V3 };

// camera: dot high above the headline -> lower to the horizon for the meeting -> pull back
const CAM: Key[] = [
  { p: 0.0, pos: [0, 2.6, 6.0], look: [0, 2.4, -26] },
  { p: 0.45, pos: [0, 1.9, 6.0], look: [0, 1.2, -24] },
  { p: 0.72, pos: [0, 1.1, 6.5], look: [0, 0.45, -16] },
  { p: 1.0, pos: [0, 4.2, 11], look: [0, 0.7, -8] },
];

function samplePath(p: number) {
  let a = CAM[0];
  let b = CAM[CAM.length - 1];
  for (let i = 0; i < CAM.length - 1; i++) {
    if (p >= CAM[i].p && p <= CAM[i + 1].p) {
      a = CAM[i];
      b = CAM[i + 1];
      break;
    }
  }
  const t = smoothstep(a.p, b.p, p);
  const pos: V3 = [lerp(a.pos[0], b.pos[0], t), lerp(a.pos[1], b.pos[1], t), lerp(a.pos[2], b.pos[2], t)];
  const look: V3 = [lerp(a.look[0], b.look[0], t), lerp(a.look[1], b.look[1], t), lerp(a.look[2], b.look[2], t)];
  return { pos, look };
}

function StoryScene({
  progress,
  meet,
  segments,
  clouds,
  boatMode,
}: {
  progress: MutableRefObject<number>;
  meet: MeetMode;
  segments: number;
  clouds: number;
  boatMode: BoatMode;
}) {
  const sun = useRef<THREE.Mesh>(null);
  const boat = useRef<THREE.Group>(null);
  const _look = useMemo(() => new THREE.Vector3(), []);

  const seaMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: WATER_VERT,
        fragmentShader: WATER_FRAG,
        uniforms: {
          uTime: { value: 0 },
          uAmp: { value: 1.15 },
          uFreq: { value: 0.62 },
          uDeep: { value: new THREE.Color("#04101f") },
          uCrest: { value: new THREE.Color("#2E6CA8") },
          uAccent: { value: new THREE.Color("#DB5227") },
          uFoam: { value: new THREE.Color("#7FD3C7") },
          uFoamAmt: { value: 1 },
          uFog: { value: new THREE.Color("#0A0C12") },
          uFogDensity: { value: 0.05 },
          uReflect: { value: 0 },
          uCaustics: { value: 0.5 },
        },
      }),
    []
  );
  const seaGeo = useMemo(() => new THREE.PlaneGeometry(95, 95, segments, segments), [segments]);

  useFrame((state) => {
    const p = progress.current;
    const t = state.clock.elapsedTime;

    // sea: lively waves from the start, calming for the boat
    seaMat.uniforms.uTime.value = t;
    seaMat.uniforms.uAmp.value = 1.15 - 0.7 * smoothstep(0.58, 0.84, p);
    // reflection streak only in reflect mode, ramping in with the full sun
    seaMat.uniforms.uReflect.value = meet === "reflect" ? smoothstep(0.5, 0.68, p) * 0.95 : 0;

    // sun: tiny dot anchored high above the headline -> grows + descends to the horizon
    if (sun.current) {
      sun.current.scale.setScalar(lerp(0.08, 1.5, smoothstep(0.04, 0.6, p)));
      sun.current.position.y = lerp(6.5, 0.55, smoothstep(0.18, 0.72, p));
      // always visible (incl. at the very top) - the dot must read above "The Coast"
      (sun.current.material as THREE.MeshBasicMaterial).opacity = 1;
    }

    // boat: meets the sun, slowly
    if (boat.current) {
      const bp = clamp01((p - 0.6) / 0.4);
      const appear = smoothstep(0, 0.12, bp);
      const ease = bp * bp * (3 - 2 * bp); // smootherstep on the boat phase
      boat.current.visible = bp > 0.001;
      boat.current.rotation.z = Math.sin(t * 1.1) * 0.06; // gentle heel

      if (meet === "cross") {
        // sails L->R across the sun's disc; bow +x (direction of travel)
        boat.current.scale.setScalar(appear * 0.95);
        boat.current.position.x = lerp(-6, 6, bp) + Math.sin(t * 0.3) * 0.2;
        boat.current.position.y = -0.1 + Math.sin(t * 1.5) * 0.12;
        boat.current.position.z = -13;
        boat.current.rotation.x = 0;
        boat.current.rotation.y = -Math.PI / 2 + Math.sin(t * 0.5) * 0.06;
      } else {
        // THE VOYAGE: emerges from the sun FACING US, grows + nears (bow -> camera)
        boat.current.scale.setScalar(appear * lerp(0.16, 1.15, ease));
        boat.current.position.x = Math.sin(t * 0.4) * 0.18 * ease;
        boat.current.position.y = lerp(0.6, -0.1, ease) + Math.sin(t * 1.5) * 0.1 * ease;
        boat.current.position.z = lerp(-19, -2.5, ease);
        boat.current.rotation.x = lerp(0.16, -0.04, ease); // nose-up far -> level near (deck shows)
        boat.current.rotation.y = Math.PI + Math.sin(t * 0.5) * 0.05; // bow toward camera
      }
    }

    const { pos, look } = samplePath(p);
    state.camera.position.set(pos[0], pos[1], pos[2]);
    _look.set(look[0], look[1], look[2]);
    state.camera.lookAt(_look);
  });

  return (
    <>
      <fogExp2 attach="fog" args={["#0A0C12", 0.045]} />
      <ambientLight intensity={0.6} color="#7FA8D8" />
      <directionalLight position={[4, 6, 3]} intensity={2.2} color="#FFF3E8" />
      <pointLight position={[-3, 2, 3]} intensity={14} color="#DB5227" />
      {/* warm rim from the sun, behind the boat - haloes the approaching hull */}
      <pointLight position={[0, 1.5, -18]} intensity={8} color="#F4633A" distance={34} />

      <DriftClouds max={clouds} />

      {/* the sun - tiny dot above the headline, grows + descends to the horizon */}
      <mesh ref={sun} position={[0, 6.5, -20]} scale={0.08}>
        <circleGeometry args={[5, 64]} />
        <meshBasicMaterial color="#F4633A" transparent toneMapped={false} fog={false} />
      </mesh>

      {/* the origami boat (switchable upgrade variants) */}
      <group ref={boat} visible={false}>
        <Boat mode={boatMode} />
      </group>

      {/* the continuous sea */}
      <mesh geometry={seaGeo} material={seaMat} position={[0, -0.6, -6]} />
    </>
  );
}

/** Fires onReady after the scene has actually painted a few frames, so the
 *  WebGL hero only fades in once it's real (no transparent reef gap). */
function FirstFrame({ onReady }: { onReady?: () => void }) {
  const n = useRef(0);
  useFrame(() => {
    n.current += 1;
    if (n.current === 3) onReady?.();
  });
  return null;
}

export function StoryHero({
  meet = "cross",
  boat = "rig",
  postfx = true,
  onReady,
}: {
  meet?: MeetMode;
  boat?: BoatMode;
  postfx?: boolean;
  onReady?: () => void;
}) {
  const progress = useHeroProgress(2.4);
  const q = useHeroQuality();
  const active = useActiveByScroll(3); // freeze once content covers the fixed canvas
  const depth = usePremiumActive().has("depth"); // premium: a stronger bloom on the gold sun
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: -1 }} aria-hidden>
      <Canvas
        gl={{ antialias: q.tier !== "low", powerPreference: "high-performance" }}
        camera={{ position: [0, 2.6, 6.0], fov: 52, near: 0.1, far: 140 }}
        dpr={q.dpr}
        frameloop={active ? "always" : "never"}
      >
        <color attach="background" args={["#0A0C12"]} />
        <Suspense fallback={null}>
          <StoryScene progress={progress} meet={meet} segments={q.seaSegments} clouds={q.clouds} boatMode={boat} />
        </Suspense>
        <FirstFrame onReady={onReady} />
        {active && postfx && q.postfx && (
          <EffectComposer>
            <Bloom intensity={depth ? 1.45 : 1.0} luminanceThreshold={depth ? 0.45 : 0.55} luminanceSmoothing={0.7} mipmapBlur />
            <Vignette eskil={false} offset={0.3} darkness={0.8} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
