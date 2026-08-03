"use client";

import { Suspense, useMemo, useRef, MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { WATER_VERT, WATER_FRAG } from "./water";
import { DriftClouds } from "./clouds";
import { useHeroProgress } from "./useHeroProgress";
import { useHeroQuality, useActiveByScroll } from "@/lib/perf";
import { usePremiumActive } from "@/components/chrome/usePremium";
import { useVariant } from "@/components/visuals/useVariant";

/* The refined sky is the DEFAULT (David: "ship it") - same clean disc and
   soft distinct clouds as the approved stylized look, upgraded with a soft
   limb, internal gradient, tight controlled glow and descent color grading;
   clouds gain internal structure + dawn underlighting (clouds.tsx).
   ?sky=off restores the flat vector disc + plain puffs for comparison. */
const SKY_MODES = ["off", "up"] as const;

const SUN_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const SUN_FRAG = /* glsl */ `
varying vec2 vUv;
uniform float uP;
void main() {
  vec2 c = (vUv - 0.5) * 2.0;
  float r = length(c);
  // small disc inside a large plane: the remaining room is the ATMOSPHERE.
  // A sun reads as real because the sky glows around it - a hard disc on a
  // dark sky is what made the old one look like a cut-out.
  // PERFECTLY ROUND by David's order: no limb wobble, no shimmer - the edge
  // is a pure circle, softened only by a thin symmetric atmosphere band.
  float rd = 0.42;
  float edge = rd;
  float disc = 1.0 - smoothstep(edge - 0.016, edge + 0.020, r);
  // Limb darkening: a small warm core falling quickly to the approved #F4633A
  // ember body. The transition is fast (0.55) so only the inner third is hot -
  // the scene Bloom threshold is 0.55 luminance, and a near-white face here
  // detonates into a washed-out orb that swallows the headline.
  vec3 core = mix(vec3(1.00, 0.68, 0.40), vec3(1.00, 0.60, 0.32), uP);
  vec3 limb = mix(vec3(0.95, 0.41, 0.22), vec3(0.89, 0.33, 0.17), uP);
  vec3 discCol = mix(core, limb, smoothstep(0.0, 0.55, r / rd));
  vec3 glowCol = mix(vec3(0.98, 0.47, 0.25), vec3(0.93, 0.39, 0.20), uP);
  // two-stage scattering: a tight bloom hugging the limb, plus a wider soft
  // wash. The wide term is what stops it reading as a cut-out, but it has to
  // decay inside ~2 radii or it floods the whole frame.
  float d = max(r - edge, 0.0);
  float inner = exp(-d * 7.0) * 0.55;
  float outer = exp(-d * 2.8) * 0.22;
  // horizon haze band, arriving as the sun nears the water
  float haze = exp(-abs(c.y) * 6.0) * exp(-abs(c.x) * 1.1) * smoothstep(0.30, 0.85, uP);
  // plane-edge fade: the scattering terms never reach zero on their own, so
  // without this the quad's straight edges print faint seams in the dark sky
  float fade = 1.0 - smoothstep(0.72, 0.97, r);
  float atmos = (inner + outer) * fade;
  haze *= fade;
  vec3 col = discCol * disc + glowCol * atmos * (1.0 - disc) + glowCol * haze * 0.16 * (1.0 - disc);
  float a = max(max(disc, atmos), haze * 0.14);
  gl_FragColor = vec4(col, a);
}`;

/* Acts: open IN THE WAVES with a risen sun behind the headline -> the sun
   GROWS and DESCENDS to the horizon over one continuous sea. The vessel is
   NOT here: the flagship appears once, in 4K, in the FilmStrip below.
   meet="reflect" lays the sun's reflection streak on the water. */

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
  skyUp,
}: {
  progress: MutableRefObject<number>;
  meet: MeetMode;
  segments: number;
  clouds: number;
  skyUp: boolean;
}) {
  const sun = useRef<THREE.Mesh>(null);
  const _look = useMemo(() => new THREE.Vector3(), []);
  const sunUpMat = useMemo(
    () =>
      skyUp
        ? new THREE.ShaderMaterial({
            vertexShader: SUN_VERT,
            fragmentShader: SUN_FRAG,
            uniforms: { uP: { value: 0 } },
            transparent: true,
            depthWrite: false,
          })
        : null,
    [skyUp]
  );

  const seaMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: WATER_VERT,
        fragmentShader: WATER_FRAG,
        uniforms: {
          uTime: { value: 0 },
          uAmp: { value: 1.25 },
          uFreq: { value: 0.62 },
          uDeep: { value: new THREE.Color("#04101f") },
          uCrest: { value: new THREE.Color("#2E6CA8") },
          uAccent: { value: new THREE.Color("#DB5227") },
          uFoam: { value: new THREE.Color("#7FD3C7") },
          uFoamAmt: { value: 1.15 },
          uFog: { value: new THREE.Color("#0A0C12") },
          uFogDensity: { value: 0.05 },
          uReflect: { value: 0 },
          uCaustics: { value: 0.6 },
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
    seaMat.uniforms.uAmp.value = 1.25 - 0.8 * smoothstep(0.58, 0.84, p);
    // reflection streak only in reflect mode, ramping in with the full sun
    seaMat.uniforms.uReflect.value = meet === "reflect" ? smoothstep(0.5, 0.68, p) * 0.95 : 0;

    // sun: a RISEN disc behind "The Coast" from the very first frame ->
    // grows and descends to the horizon as the story advances (growth capped
    // so the disc never dominates the mid-story frame as a flat shape)
    if (sun.current) {
      sun.current.scale.setScalar(lerp(0.55, 1.25, smoothstep(0.04, 0.6, p)));
      sun.current.position.y = lerp(3.6, 0.55, smoothstep(0.16, 0.72, p));
      const mat = sun.current.material as THREE.Material;
      if (mat instanceof THREE.ShaderMaterial) {
        mat.uniforms.uP.value = p;
      } else {
        // always visible (incl. at the very top) - it must read behind the wordmark
        (mat as THREE.MeshBasicMaterial).opacity = 1;
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
      {/* warm rim from the sun */}
      <pointLight position={[0, 1.5, -18]} intensity={8} color="#F4633A" distance={34} />

      <DriftClouds max={clouds} up={skyUp} progress={progress} />

      {/* The sun - risen behind the wordmark from frame one, then grows and
          descends to the horizon. SUN_FRAG renders a small disc inside a large
          plane so the surrounding room becomes ATMOSPHERE: soft limb, hot core,
          and a wide scattering wash that lights the sky. The disc fills 0.42 of
          the plane, so 24 reads as the same dia-10 sun as before.
          ?sky=off falls back to the old flat vector disc. */}
      {skyUp && sunUpMat ? (
        <mesh ref={sun} position={[0, 3.6, -20]} scale={0.55} material={sunUpMat}>
          <planeGeometry args={[24, 24]} />
        </mesh>
      ) : (
        <mesh ref={sun} position={[0, 3.6, -20]} scale={0.55}>
          <circleGeometry args={[5, 64]} />
          <meshBasicMaterial color="#F4633A" transparent toneMapped={false} fog={false} />
        </mesh>
      )}

      {/* No boat here by design. The flagship appears ONCE, in 4K, in the
          FilmStrip sequence below - one vessel, one orientation, one story.
          The old WebGL billboard boat read as a cardboard cut-out and flipped
          orientation mid-approach; it was removed rather than patched. */}

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
  postfx = true,
  onReady,
}: {
  meet?: MeetMode;
  postfx?: boolean;
  onReady?: () => void;
}) {
  const progress = useHeroProgress(2.4);
  const q = useHeroQuality();
  const active = useActiveByScroll(3); // freeze once content covers the fixed canvas
  const depth = usePremiumActive().has("depth"); // premium: a stronger bloom on the gold sun
  const skyUp = useVariant("sky", SKY_MODES, "up") === "up";
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
          <StoryScene progress={progress} meet={meet} segments={q.seaSegments} clouds={q.clouds} skyUp={skyUp} />
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
