"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function Core() {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.15;
      coreRef.current.rotation.x +=
        (mouse.current.y * 0.3 - coreRef.current.rotation.x) * 0.05;
      coreRef.current.rotation.z +=
        (mouse.current.x * 0.2 - coreRef.current.rotation.z) * 0.05;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * 0.1;
      wireRef.current.rotation.x = Math.sin(t * 0.4) * 0.3;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.25;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.15;
    }
  });

  return (
    <Float speed={1.1} rotationIntensity={0.3} floatIntensity={0.5}>
      {/* inner distorted core — liquid metal feel */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 6]} />
        <MeshDistortMaterial
          color="#6d8dff"
          emissive="#2b3cc9"
          emissiveIntensity={0.55}
          roughness={0.15}
          metalness={0.95}
          distort={0.38}
          speed={1.6}
        />
      </mesh>

      {/* wireframe shell */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.42, 1]} />
        <meshBasicMaterial
          color="#9fc2ff"
          wireframe
          transparent
          opacity={0.22}
        />
      </mesh>

      {/* orbiting ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.75, 0.012, 8, 180]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.55} />
      </mesh>

      {/* ambient sparkles around the core */}
      <Sparkles
        count={40}
        scale={[3.5, 3.5, 3.5]}
        size={2}
        speed={0.3}
        color="#a5c8ff"
        opacity={0.6}
      />
    </Float>
  );
}

export function HeroMark({ className }: { className?: string }) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 4.5], fov: 42 }}
      className={className}
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[3, 2, 3]} intensity={2.2} color="#7aa8ff" />
      <pointLight position={[-3, -1.5, 2]} intensity={1.2} color="#22d3ee" />
      <pointLight position={[0, 3, -2]} intensity={0.9} color="#c084fc" />
      <Core />
    </Canvas>
  );
}
