"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
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
  uniform float uDark;
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

    // ---------- DARK palette ----------
    vec3 d0 = vec3(0.012, 0.018, 0.045);
    vec3 d1 = vec3(0.03,  0.07,  0.22);
    vec3 d2 = vec3(0.12,  0.38,  0.95);
    vec3 d3 = vec3(0.55,  0.22,  1.0);
    vec3 d4 = vec3(0.45,  0.85,  1.0);
    vec3 darkCol = mix(d0, d1, smoothstep(0.0, 0.45, n));
    darkCol = mix(darkCol, d2, smoothstep(0.45, 0.72, n) * 0.9);
    darkCol = mix(darkCol, d3, smoothstep(0.66, 0.88, n) * 0.55);
    darkCol += d4 * smoothstep(0.82, 0.97, n) * 0.25;

    // ---------- LIGHT palette ----------
    // punchy enough that the flow actually reads on a pale canvas
    vec3 l0 = vec3(0.94,  0.96,  1.0);
    vec3 l1 = vec3(0.74,  0.84,  1.0);
    vec3 l2 = vec3(0.40,  0.58,  0.98);
    vec3 l3 = vec3(0.55,  0.42,  0.95);
    vec3 l4 = vec3(0.28,  0.76,  0.98);
    vec3 lightCol = mix(l0, l1, smoothstep(0.0, 0.45, n));
    lightCol = mix(lightCol, l2, smoothstep(0.4, 0.72, n) * 0.85);
    lightCol = mix(lightCol, l3, smoothstep(0.58, 0.85, n) * 0.55);
    lightCol = mix(lightCol, l4, smoothstep(0.8, 0.97, n) * 0.35);

    vec3 col = mix(lightCol, darkCol, uDark);

    // scroll highlight band — add light on dark, subtract on light
    float band = smoothstep(0.0, 0.22, abs(uv.y - fract(uScroll * 1.6)));
    col += mix(vec3(-0.03, -0.04, -0.06), vec3(0.25, 0.55, 1.0) * 0.05, uDark)
           * (1.0 - band);

    // mouse glow (additive dark / subtractive light)
    vec2 mouseP = vec2((uMouse.x - 0.5) * aspect, uMouse.y - 0.5) * 2.0;
    vec2 curP   = vec2((uv.x  - 0.5) * aspect, uv.y  - 0.5) * 2.0;
    float md = length(curP - mouseP);
    col += mix(vec3(-0.04, -0.05, -0.07), vec3(0.4, 0.65, 1.0) * 0.07, uDark)
           * smoothstep(1.0, 0.0, md);

    // technical grid — brighter lines on dark, darker lines on light
    vec2 gridUV = uv * vec2(aspect, 1.0) * 42.0;
    vec2 grid = abs(fract(gridUV) - 0.5);
    float gline = smoothstep(0.47, 0.5, max(grid.x, grid.y));
    col += mix(vec3(-0.025, -0.03, -0.05), vec3(0.18, 0.32, 0.7) * 0.05, uDark)
           * (1.0 - gline);

    // vignette
    float vig = smoothstep(1.35, 0.3, length((uv - 0.5) * vec2(aspect, 1.0)));
    vec3 darkVig  = col * vig;
    // light: only a faint fade to pure white at the far edges so center stays saturated
    vec3 lightVig = mix(col, vec3(0.98, 0.99, 1.0), (1.0 - vig) * 0.25);
    col = mix(lightVig, darkVig, uDark);

    // film grain
    float grain = hash(uv * uResolution + uTime) - 0.5;
    col += grain * mix(0.006, 0.018, uDark);

    gl_FragColor = vec4(col, 1.0);
  }
`;

type ScrollRef = MutableRefObject<number>;
type MouseRef = MutableRefObject<{ x: number; y: number }>;

function ShaderPlane({
  scrollRef,
  mouseRef,
  darkRef,
}: {
  scrollRef: ScrollRef;
  mouseRef: MouseRef;
  darkRef: MutableRefObject<number>;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    const m = matRef.current;
    if (!m) return;
    const u = m.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uScroll.value += (scrollRef.current - u.uScroll.value) * 0.08;
    u.uDark.value += (darkRef.current - u.uDark.value) * 0.08;
    const tmp = u.uMouse.value as THREE.Vector2;
    tmp.x += (mouseRef.current.x - tmp.x) * 0.06;
    tmp.y += (mouseRef.current.y - tmp.y) * 0.06;
    (u.uResolution.value as THREE.Vector2).set(
      state.size.width,
      state.size.height
    );
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
          uDark: { value: 1 },
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
  const darkRef = useRef(1);
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scrollRef.current = v;
  });

  useEffect(() => {
    setMounted(true);
    const html = document.documentElement;
    const syncTheme = () => {
      darkRef.current = html.classList.contains("dark") ? 1 : 0;
    };
    syncTheme();
    const obs = new MutationObserver(syncTheme);
    obs.observe(html, { attributes: true, attributeFilter: ["class"] });

    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      obs.disconnect();
    };
  }, []);

  if (!mounted) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
        }}
        className="!h-full !w-full"
      >
        <ShaderPlane
          scrollRef={scrollRef}
          mouseRef={mouseRef}
          darkRef={darkRef}
        />
      </Canvas>
    </div>
  );
}
