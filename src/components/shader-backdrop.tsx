"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScroll, useMotionValueEvent } from "framer-motion";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2  uMouse;
  uniform vec2  uResolution;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5) * 2.2;

    // domain-warped flow field (tech-y, slow drift)
    float t = uTime * 0.05 + uScroll * 1.4;
    vec2 q = vec2(
      fbm(p + vec2(0.0, t)),
      fbm(p + vec2(5.2, t + 1.3))
    );
    vec2 r = vec2(
      fbm(p + 3.5 * q + vec2(1.7, 9.2) + t * 0.4),
      fbm(p + 3.5 * q + vec2(8.3, 2.8) + t * 0.4)
    );
    float n = fbm(p + 3.5 * r);

    // color ramp — near-black navy → deep blue → bright blue → violet → cyan sparkle
    vec3 c0 = vec3(0.012, 0.018, 0.045);
    vec3 c1 = vec3(0.03,  0.07,  0.22);
    vec3 c2 = vec3(0.12,  0.38,  0.95);
    vec3 c3 = vec3(0.55,  0.22,  1.0);
    vec3 c4 = vec3(0.45,  0.85,  1.0);

    vec3 col = mix(c0, c1, smoothstep(0.0, 0.45, n));
    col = mix(col, c2, smoothstep(0.45, 0.72, n) * 0.9);
    col = mix(col, c3, smoothstep(0.66, 0.88, n) * 0.55);
    col += c4 * smoothstep(0.82, 0.97, n) * 0.25;

    // scroll-driven highlight band (sweeps vertically as you scroll)
    float band = smoothstep(0.0, 0.22, abs(uv.y - fract(uScroll * 1.6)));
    col += vec3(0.25, 0.55, 1.0) * (1.0 - band) * 0.05;

    // mouse glow
    vec2 mouseP = vec2((uMouse.x - 0.5) * aspect, uMouse.y - 0.5) * 2.0;
    vec2 curP   = vec2((uv.x  - 0.5) * aspect, uv.y  - 0.5) * 2.0;
    float md = length(curP - mouseP);
    col += vec3(0.4, 0.65, 1.0) * smoothstep(1.0, 0.0, md) * 0.07;

    // faint technical grid overlay
    vec2 gridUV = uv * vec2(aspect, 1.0) * 42.0;
    vec2 grid = abs(fract(gridUV) - 0.5);
    float gline = smoothstep(0.47, 0.5, max(grid.x, grid.y));
    col += vec3(0.18, 0.32, 0.7) * (1.0 - gline) * 0.05;

    // vignette
    float vig = smoothstep(1.35, 0.3, length((uv - 0.5) * vec2(aspect, 1.0)));
    col *= vig;

    // subtle film grain
    float grain = hash(uv * uResolution + uTime) - 0.5;
    col += grain * 0.018;

    gl_FragColor = vec4(col, 1.0);
  }
`;

type ScrollRef = MutableRefObject<number>;
type MouseRef = MutableRefObject<{ x: number; y: number }>;

function ShaderPlane({
  scrollRef,
  mouseRef,
}: {
  scrollRef: ScrollRef;
  mouseRef: MouseRef;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    const m = matRef.current;
    if (!m) return;
    const u = m.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uScroll.value += (scrollRef.current - u.uScroll.value) * 0.08;
    const tmp = u.uMouse.value as THREE.Vector2;
    tmp.x += (mouseRef.current.x - tmp.x) * 0.06;
    tmp.y += (mouseRef.current.y - tmp.y) * 0.06;
    (u.uResolution.value as THREE.Vector2).set(state.size.width, state.size.height);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uResolution: { value: new THREE.Vector2(1, 1) },
        }}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export function ShaderBackdrop() {
  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scrollRef.current = v;
  });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        className="!h-full !w-full"
      >
        <ShaderPlane scrollRef={scrollRef} mouseRef={mouseRef} />
      </Canvas>
      {/* soft CSS overlay: center vignette for readability + subtle noise */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(65% 70% at 50% 45%, transparent 0%, oklch(0.05 0.01 265 / 0.55) 100%)",
        }}
      />
    </div>
  );
}
