"use client";

import { useLayoutEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  PerspectiveCamera,
  Points,
  PointMaterial,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";

const HELIX_CONFIG = {
  height: 14,
  radius: 0.32,
  turns: 5.5,
  steps: 140,
  nodeCount: 6,
};

const VISIBLE_HEIGHT = 4.2; // approx visible y-range at camera distance

function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

interface HelixProps {
  progressRef: MutableRefObject<number>;
  activeIndexRef: MutableRefObject<number>;
}

function HelixBody({ progressRef, activeIndexRef }: HelixProps) {
  const groupRef = useRef<THREE.Group>(null);
  const strandARef = useRef<THREE.InstancedMesh>(null);
  const strandBRef = useRef<THREE.InstancedMesh>(null);
  const rungsRef = useRef<THREE.InstancedMesh>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);

  const smoothProgress = useRef(0);

  const { strandA, strandB, rungs, nodes } = useMemo(() => {
    const { height, radius, turns, steps, nodeCount } = HELIX_CONFIG;
    const strandA: { pos: THREE.Vector3 }[] = [];
    const strandB: { pos: THREE.Vector3 }[] = [];
    const rungs: {
      pos: THREE.Vector3;
      quat: THREE.Quaternion;
      length: number;
    }[] = [];
    const nodes: {
      pos: THREE.Vector3;
      index: number;
    }[] = [];

    const dummy = new THREE.Object3D();
    void dummy;

    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      const angle = t * turns * Math.PI * 2;
      const y = -height / 2 + t * height;

      const a = new THREE.Vector3(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius
      );
      const b = new THREE.Vector3(
        Math.cos(angle + Math.PI) * radius,
        y,
        Math.sin(angle + Math.PI) * radius
      );
      strandA.push({ pos: a });
      strandB.push({ pos: b });

      // rung: cylinder from a to b, default cylinder is Y-axis aligned of length 1
      const mid = a.clone().add(b).multiplyScalar(0.5);
      const dir = b.clone().sub(a);
      const length = dir.length();
      const up = new THREE.Vector3(0, 1, 0);
      const quat = new THREE.Quaternion().setFromUnitVectors(
        up,
        dir.clone().normalize()
      );
      rungs.push({ pos: mid, quat, length });
    }

    // distribute nodes evenly along the helix (on strand A), representing services
    for (let n = 0; n < nodeCount; n++) {
      const t = (n + 0.5) / nodeCount;
      const angle = t * turns * Math.PI * 2;
      const y = -HELIX_CONFIG.height / 2 + t * HELIX_CONFIG.height;
      const pos = new THREE.Vector3(
        Math.cos(angle) * radius * 1.35,
        y,
        Math.sin(angle) * radius * 1.35
      );
      nodes.push({ pos, index: n });
    }

    return { strandA, strandB, rungs, nodes };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  useLayoutEffect(() => {
    if (
      !strandARef.current ||
      !strandBRef.current ||
      !rungsRef.current ||
      !nodesRef.current
    )
      return;
    strandA.forEach((s, i) => {
      dummy.position.copy(s.pos);
      dummy.scale.setScalar(1);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      strandARef.current!.setMatrixAt(i, dummy.matrix);
    });
    strandB.forEach((s, i) => {
      dummy.position.copy(s.pos);
      dummy.scale.setScalar(1);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      strandBRef.current!.setMatrixAt(i, dummy.matrix);
    });
    rungs.forEach((r, i) => {
      dummy.position.copy(r.pos);
      dummy.quaternion.copy(r.quat);
      dummy.scale.set(1, r.length, 1);
      dummy.updateMatrix();
      rungsRef.current!.setMatrixAt(i, dummy.matrix);
    });
    nodes.forEach((n, i) => {
      dummy.position.copy(n.pos);
      dummy.scale.setScalar(1);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      nodesRef.current!.setMatrixAt(i, dummy.matrix);
    });
    strandARef.current.instanceMatrix.needsUpdate = true;
    strandBRef.current.instanceMatrix.needsUpdate = true;
    rungsRef.current.instanceMatrix.needsUpdate = true;
    nodesRef.current.instanceMatrix.needsUpdate = true;
  }, [strandA, strandB, rungs, nodes, dummy]);

  useFrame((state, delta) => {
    const rawProgress = progressRef.current;
    smoothProgress.current = damp(smoothProgress.current, rawProgress, 5, delta);
    const p = smoothProgress.current;

    if (groupRef.current) {
      // gentle scroll-driven rotation + slow ambient spin
      groupRef.current.rotation.y =
        p * Math.PI * 1.5 + state.clock.elapsedTime * 0.05;
      // subtle breathing tilt
      groupRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.25) * 0.04;
      // vertical scan: strand scrolls from top of helix visible → bottom
      // at p=0 we want top of helix near top of screen (group y = +range)
      // at p=1 we want bottom of helix near bottom of screen (group y = -range)
      const range = HELIX_CONFIG.height / 2 - VISIBLE_HEIGHT / 2;
      groupRef.current.position.y = (0.5 - p) * 2 * range;
    }

    // pulse the active node
    if (nodesRef.current) {
      const activeIdx = activeIndexRef.current;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const isActive = i === activeIdx;
        const target = isActive
          ? 1.6 + Math.sin(state.clock.elapsedTime * 3) * 0.12
          : 1;
        dummy.position.copy(node.pos);
        dummy.scale.setScalar(target);
        dummy.rotation.y = state.clock.elapsedTime * (isActive ? 1.6 : 0.4);
        dummy.updateMatrix();
        nodesRef.current.setMatrixAt(i, dummy.matrix);
      }
      nodesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* strand A — indigo/blue */}
      <instancedMesh
        ref={strandARef}
        args={[undefined, undefined, strandA.length]}
      >
        <sphereGeometry args={[0.048, 14, 14]} />
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#1e3a8a"
          emissiveIntensity={0.35}
          roughness={0.35}
          metalness={0.5}
        />
      </instancedMesh>

      {/* strand B — sky */}
      <instancedMesh
        ref={strandBRef}
        args={[undefined, undefined, strandB.length]}
      >
        <sphereGeometry args={[0.048, 14, 14]} />
        <meshStandardMaterial
          color="#7dd3fc"
          emissive="#0c4a6e"
          emissiveIntensity={0.35}
          roughness={0.35}
          metalness={0.5}
        />
      </instancedMesh>

      {/* rungs / base pairs */}
      <instancedMesh
        ref={rungsRef}
        args={[undefined, undefined, rungs.length]}
      >
        <cylinderGeometry args={[0.006, 0.006, 1, 6, 1]} />
        <meshStandardMaterial
          color="#93c5fd"
          emissive="#3b82f6"
          emissiveIntensity={0.15}
          roughness={0.5}
          metalness={0.2}
          transparent
          opacity={0.45}
        />
      </instancedMesh>

      {/* capability nodes — octahedra (the brand accents) */}
      <instancedMesh
        ref={nodesRef}
        args={[undefined, undefined, nodes.length]}
      >
        <octahedronGeometry args={[0.09, 0]} />
        <meshStandardMaterial
          color="#dbeafe"
          emissive="#60a5fa"
          emissiveIntensity={0.9}
          roughness={0.2}
          metalness={0.85}
        />
      </instancedMesh>
    </group>
  );
}

function HelixParticles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 450;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 0.8 + Math.random() * 2.4;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * (HELIX_CONFIG.height + 2);
      arr[i * 3] = Math.cos(theta) * r;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = Math.sin(theta) * r;
    }
    return arr;
  }, []);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02;
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        color="#93c5fd"
        size={0.014}
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

export function DNAHelix({
  progressRef,
  activeIndexRef,
  className,
}: {
  progressRef: MutableRefObject<number>;
  activeIndexRef: MutableRefObject<number>;
  className?: string;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className={className}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 5.8]} fov={36} />
      {/* depth fog — fades the helix into the dark at top/bottom for a "no start/no end" feel */}
      <fog attach="fog" args={["#07070B", 4.5, 10]} />
      <ambientLight intensity={0.25} />
      <pointLight position={[3, 2, 4]} intensity={1.2} color="#60a5fa" />
      <pointLight position={[-3, -2, 3]} intensity={0.9} color="#22d3ee" />
      <directionalLight position={[0, 4, 3]} intensity={0.3} />

      <HelixBody progressRef={progressRef} activeIndexRef={activeIndexRef} />
      <HelixParticles />
      <Sparkles
        count={50}
        scale={[3, HELIX_CONFIG.height, 3]}
        size={1.6}
        speed={0.2}
        color="#93c5fd"
        opacity={0.4}
      />
    </Canvas>
  );
}
