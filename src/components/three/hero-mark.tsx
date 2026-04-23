"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/**
 * An interactive plasma orb:
 *  - vertex-shader displacement driven by 3D noise (the "breathing" surface)
 *  - fragment shader mixes deep-blue core, violet heat spots and cyan fresnel rim
 *  - mouse proximity swells the displacement amplitude
 *  - drag to rotate (OrbitControls), auto-rotates when idle
 */

const orbVertex = /* glsl */ `
  uniform float uTime;
  uniform float uDisplace;

  varying vec3  vNormal;
  varying vec3  vWorldPos;
  varying float vNoise;

  // 3D value noise (cheap, tiling-free)
  float hash3(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash3(i + vec3(0,0,0)), hash3(i + vec3(1,0,0)), f.x),
          mix(hash3(i + vec3(0,1,0)), hash3(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash3(i + vec3(0,0,1)), hash3(i + vec3(1,0,1)), f.x),
          mix(hash3(i + vec3(0,1,1)), hash3(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }
  float fbm3(vec3 p) {
    float v = 0.0;
    float a = 0.55;
    for (int i = 0; i < 4; i++) {
      v += a * noise3(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 p = position;
    float t = uTime * 0.35;
    float n = fbm3(normalize(p) * 2.4 + vec3(t, t * 0.7, -t * 0.5));
    float pulse = 0.025 * sin(uTime * 1.1 + p.y * 3.2);
    float displace = (n - 0.5) * 0.35 * uDisplace + pulse;

    vec3 newPos = p + normal * displace;
    vNoise = n;
    vNormal = normalize(normalMatrix * normal);
    vec4 world = modelMatrix * vec4(newPos, 1.0);
    vWorldPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const orbFragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  varying vec3  vNormal;
  varying vec3  vWorldPos;
  varying float vNoise;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fres = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 2.3);

    // palette
    vec3 deep  = vec3(0.025, 0.055, 0.22);
    vec3 mid   = vec3(0.15,  0.42,  1.0);
    vec3 hot   = vec3(0.75,  0.35,  1.0);
    vec3 cyan  = vec3(0.55,  0.95,  1.0);

    vec3 base = mix(deep, mid, smoothstep(0.15, 0.7, vNoise));
    base = mix(base, hot, smoothstep(0.72, 0.95, vNoise) * 0.8);

    vec3 rim = mix(mid, cyan, 0.55) * 1.4;
    vec3 col = base + rim * fres;

    // internal plasma pulse
    col += vec3(0.1, 0.18, 0.45) * (0.5 + 0.5 * sin(uTime * 1.8 + vNoise * 9.0)) * 0.18;

    // gentle tone-map-ish roll
    col = col / (col + vec3(0.85));

    gl_FragColor = vec4(col, 1.0);
  }
`;

const haloVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const haloFragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vec3 v = normalize(cameraPosition - vWorldPos);
    float f = pow(1.0 - max(dot(normalize(vNormal), v), 0.0), 2.5);
    vec3 col = mix(vec3(0.3, 0.5, 1.0), vec3(0.6, 0.35, 1.0), 0.5) * f;
    col *= 0.7 + 0.3 * sin(uTime * 0.6);
    gl_FragColor = vec4(col, f * 0.55);
  }
`;

function Orb() {
  const orbMat = useRef<THREE.ShaderMaterial>(null);
  const haloMat = useRef<THREE.ShaderMaterial>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const targetDisplace = useRef(0.6);

  const orbUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDisplace: { value: 0.6 },
    }),
    []
  );
  const haloUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const r = Math.min(cx, cy);
      const d = Math.min(1, Math.sqrt(dx * dx + dy * dy) / r);
      // closer to center → bigger displacement
      targetDisplace.current = 0.55 + (1 - d) * 0.9;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (orbMat.current) {
      orbMat.current.uniforms.uTime.value = t;
      const u = orbMat.current.uniforms.uDisplace;
      u.value += (targetDisplace.current - u.value) * 0.07;
    }
    if (haloMat.current) {
      haloMat.current.uniforms.uTime.value = t;
    }
    if (coreRef.current) {
      // subtle always-alive drift so it feels reactive even when idle
      coreRef.current.rotation.y += 0.0015;
    }
  });

  return (
    <group>
      {/* plasma core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 5]} />
        <shaderMaterial
          ref={orbMat}
          vertexShader={orbVertex}
          fragmentShader={orbFragment}
          uniforms={orbUniforms}
        />
      </mesh>

      {/* outer fresnel halo */}
      <mesh scale={1.22}>
        <icosahedronGeometry args={[1, 3]} />
        <shaderMaterial
          ref={haloMat}
          vertexShader={haloVertex}
          fragmentShader={haloFragment}
          uniforms={haloUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* orbital ring */}
      <OrbitalRing />

      {/* particle dust around the orb */}
      <Sparkles
        count={60}
        scale={[4, 4, 4]}
        size={2.2}
        speed={0.35}
        color="#9cc2ff"
        opacity={0.7}
      />
    </group>
  );
}

function OrbitalRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z += delta * 0.25;
    ringRef.current.rotation.x =
      Math.PI / 2.2 + Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
  });
  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[1.85, 0.01, 8, 200]} />
      <meshBasicMaterial color="#a5cfff" transparent opacity={0.55} />
    </mesh>
  );
}

export function HeroMark({ className }: { className?: string }) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 4.2], fov: 42 }}
      className={className}
    >
      <ambientLight intensity={0.2} />
      <Orb />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.6}
        rotateSpeed={0.7}
      />
    </Canvas>
  );
}
