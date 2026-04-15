"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Points,
  PointMaterial,
  Line,
  Sparkles,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";

function TechCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * 0.08;
      wireRef.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <group>
      {/* solid distorted core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 6]} />
        <MeshDistortMaterial
          color="#8b5cf6"
          roughness={0.25}
          metalness={0.8}
          emissive="#6d28d9"
          emissiveIntensity={0.45}
          distort={0.38}
          speed={1.6}
        />
      </mesh>

      {/* outer wireframe shell */}
      <mesh ref={wireRef} scale={1.28}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial
          color="#22d3ee"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  );
}

function OrbitalRing({
  radius,
  tilt = [0, 0, 0],
  color = "#a78bfa",
  speed = 0.2,
  opacity = 0.6,
  segments = 128,
}: {
  radius: number;
  tilt?: [number, number, number];
  color?: string;
  speed?: number;
  opacity?: number;
  segments?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return pts;
  }, [radius, segments]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * speed;
    }
  });

  return (
    <group ref={groupRef} rotation={tilt}>
      <Line
        points={points}
        color={color}
        lineWidth={1}
        transparent
        opacity={opacity}
      />
      {/* small node riding the ring */}
      <OrbitingNode radius={radius} color={color} speed={speed * 1.8} />
    </group>
  );
}

function OrbitingNode({
  radius,
  color,
  speed,
}: {
  radius: number;
  color: string;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed;
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.045, 16, 16]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

function ParticleField({ count = 600 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // spherical shell distribution
      const r = 4 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
      ref.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#a78bfa"
        size={0.018}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}

function CameraParallax() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.x += (pointer.x * 0.6 - camera.position.x) * 0.04;
    camera.position.y += (-pointer.y * 0.4 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function TechScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="!bg-transparent"
    >
      <PerspectiveCamera makeDefault position={[0, 0, 4.2]} fov={45} />
      <CameraParallax />

      <ambientLight intensity={0.35} />
      <pointLight position={[4, 4, 4]} intensity={2.2} color="#8b5cf6" />
      <pointLight position={[-4, -2, -3]} intensity={1.6} color="#22d3ee" />
      <directionalLight position={[0, 5, 2]} intensity={0.4} />

      <Suspense fallback={null}>
        <Float speed={1.3} rotationIntensity={0.4} floatIntensity={0.6}>
          <TechCore />
        </Float>

        <OrbitalRing radius={1.7} tilt={[Math.PI / 2.2, 0, 0]} color="#a78bfa" speed={0.18} opacity={0.55} />
        <OrbitalRing radius={2.1} tilt={[Math.PI / 2, 0, Math.PI / 6]} color="#22d3ee" speed={-0.12} opacity={0.45} />
        <OrbitalRing radius={2.5} tilt={[Math.PI / 1.8, 0, Math.PI / 3]} color="#818cf8" speed={0.08} opacity={0.3} />

        <Sparkles
          count={80}
          scale={6}
          size={2.2}
          speed={0.3}
          color="#c4b5fd"
          opacity={0.7}
        />

        <ParticleField count={700} />
      </Suspense>
    </Canvas>
  );
}
