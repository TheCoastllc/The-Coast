"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const WATER_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  uniform float uFreq;
  varying float vH;
  varying vec2 vGround;

  float waves(vec2 p) {
    float h = 0.0;
    h += sin(p.x * uFreq + uTime * 1.1) * 0.5;
    h += sin(p.y * uFreq * 0.8 - uTime * 0.9) * 0.5;
    h += sin((p.x + p.y) * uFreq * 0.5 + uTime * 0.7) * 0.4;
    h += sin((p.x * 0.7 - p.y * 0.6) * uFreq * 1.7 + uTime * 1.6) * 0.2;
    return h;
  }

  void main() {
    float h = waves(position.xy) * uAmp;
    // local xy becomes world xz; height is world y
    vec3 worldPos = vec3(position.x, h, position.y);
    vH = h;
    vGround = position.xy;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(worldPos, 1.0);
  }
`;

export const WATER_FRAG = /* glsl */ `
  uniform vec3 uDeep;
  uniform vec3 uCrest;
  uniform vec3 uAccent;
  uniform vec3 uFoam;       // teal sea-foam on the brightest crests
  uniform float uFoamAmt;   // 0..1 strength of the foam tint
  uniform vec3 uFog;
  uniform float uFogDensity;
  uniform float uAmp;
  uniform float uReflect;   // 0..1 strength of the sun reflection streak
  uniform float uCaustics;  // 0..1 dancing caustic light on the surface
  uniform float uTime;
  varying float vH;
  varying vec2 vGround;

  void main() {
    float norm = vH / max(uAmp, 0.0001);
    float crest = smoothstep(-0.4, 1.4, norm);
    vec3 col = mix(uDeep, uCrest, crest);
    col = mix(col, uAccent, smoothstep(0.7, 1.5, norm) * 0.55);

    // teal sea-foam catching the light along the wave crests
    col = mix(col, uFoam, smoothstep(0.5, 1.25, norm) * uFoamAmt * 0.9);

    // orange sun reflection: a shimmering streak down the centerline (world x ~ 0),
    // stronger toward the horizon (far -z), broken up by the waves.
    float center = smoothstep(2.8, 0.0, abs(vGround.x));
    float depth = smoothstep(2.0, 26.0, -vGround.y);
    float shimmer = 0.55 + 0.45 * sin(vGround.y * 1.3 + uTime * 1.6 + vH * 4.0);
    float streak = uReflect * center * depth * shimmer;
    col = mix(col, uAccent, clamp(streak, 0.0, 1.0) * 0.7);

    // dancing caustic light playing across the surface
    vec2 cuv = vGround * 0.5;
    float ca = sin(cuv.x * 2.3 + uTime * 0.9 + sin(cuv.y * 1.7 - uTime * 0.6) * 1.5);
    float cb = sin(cuv.y * 2.1 - uTime * 0.7 + sin(cuv.x * 1.9 + uTime * 0.5) * 1.5);
    float caust = pow(max(ca * cb, 0.0), 1.8);
    col += uFoam * caust * uCaustics * (0.3 + crest * 0.5);

    // distance haze toward fog color (mist on the horizon)
    float dist = length(vGround);
    float fog = 1.0 - exp(-uFogDensity * uFogDensity * dist * dist);
    col = mix(col, uFog, clamp(fog, 0.0, 1.0));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export type WaterProps = {
  amp?: number;
  freq?: number;
  deep?: string;
  crest?: string;
  accent?: string;
  foam?: string;
  foamAmt?: number;
  fog?: string;
  fogDensity?: number;
  size?: number;
  segments?: number;
  reflect?: number;
  caustics?: number;
  position?: [number, number, number];
};

export function WaterShader({
  amp = 0.6,
  freq = 0.5,
  deep = "#04243F",
  crest = "#1E5A9E",
  accent = "#DB5227",
  foam = "#7FD3C7",
  foamAmt = 0,
  fog = "#0A0C12",
  fogDensity = 0.05,
  size = 80,
  segments = 150,
  reflect = 0,
  caustics = 0,
  position = [0, 0, 0],
}: WaterProps) {
  const { geometry, material } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    const mat = new THREE.ShaderMaterial({
      vertexShader: WATER_VERT,
      fragmentShader: WATER_FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmp: { value: amp },
        uFreq: { value: freq },
        uDeep: { value: new THREE.Color(deep) },
        uCrest: { value: new THREE.Color(crest) },
        uAccent: { value: new THREE.Color(accent) },
        uFoam: { value: new THREE.Color(foam) },
        uFoamAmt: { value: foamAmt },
        uFog: { value: new THREE.Color(fog) },
        uFogDensity: { value: fogDensity },
        uReflect: { value: reflect },
        uCaustics: { value: caustics },
      },
    });
    return { geometry: geo, material: mat };
  }, [amp, freq, deep, crest, accent, foam, foamAmt, fog, fogDensity, size, segments, reflect, caustics]);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return <mesh geometry={geometry} material={material} position={position} />;
}
