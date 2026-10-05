"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  OrbitControls,
  Text,
} from "@react-three/drei";
import { useMemo, useRef } from "react";

/* =========================================================
   ANIMATED ENERGY CORE
========================================================= */

function EnergyCore() {
  const outerRing = useRef<THREE.Mesh>(null);
  const innerRing = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (outerRing.current) {
      outerRing.current.rotation.z += delta * 0.7;
    }

    if (innerRing.current) {
      innerRing.current.rotation.z -= delta * 1.2;
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.08}
      floatIntensity={0.15}
    >
      <group position={[0, 1.35, 0]}>

        {/* Core glow */}
        <pointLight
          position={[0, 0, 0]}
          intensity={30}
          distance={6}
          color="#00e5ff"
        />

        {/* Main reactor */}
        <mesh>
          <cylinderGeometry args={[0.9, 1.05, 1.25, 64]} />
          <meshStandardMaterial
            color="#071a2d"
            emissive="#00bfff"
            emissiveIntensity={2}
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>

        {/* Inner energy sphere */}
        <mesh>
          <sphereGeometry args={[0.58, 32, 32]} />
          <meshStandardMaterial
            color="#bffff8"
            emissive="#00e5ff"
            emissiveIntensity={5}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Outer rotating ring */}
        <mesh
          ref={outerRing}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[1.35, 0.055, 16, 100]} />
          <meshStandardMaterial
            color="#00e5ff"
            emissive="#00e5ff"
            emissiveIntensity={5}
          />
        </mesh>

        {/* Inner rotating ring */}
        <mesh
          ref={innerRing}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[1.08, 0.035, 16, 100]} />
          <meshStandardMaterial
            color="#00ff9d"
            emissive="#00ff9d"
            emissiveIntensity={5}
          />
        </mesh>

        {/* Core label */}
        <Text
          position={[0, 0.02, 1.12]}
          fontSize={0.19}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          SMARTGRID AI
        </Text>

        {/* Prediction */}
        <Text
          position={[0, -0.3, 1.12]}
          fontSize={0.24}
          color="#00ff9d"
          anchorX="center"
          anchorY="middle"
        >
          4.21 kW
        </Text>

      </group>
    </Float>
  );
}

/* =========================================================
   BUILDING
========================================================= */

function Building({
  position,
  height,
  width,
  color,
  label,
}: {
  position: [number, number, number];
  height: number;
  width: number;
  color: string;
  label: string;
}) {
  const windows = useMemo(() => {
    const result: [number, number, number][] = [];

    const floors = Math.floor(height / 0.7);

    for (let floor = 0; floor < floors; floor++) {
      for (let column = 0; column < 2; column++) {
        result.push([
          column === 0 ? -0.22 : 0.22,
          0.45 + floor * 0.7,
          width / 2 + 0.015,
        ]);
      }
    }

    return result;
  }, [height, width]);

  return (
    <group position={position}>

      {/* Building body */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, width]} />

        <meshStandardMaterial
          color={color}
          metalness={0.65}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={0.12}
        />
      </mesh>

      {/* Roof */}
      <mesh position={[0, height + 0.08, 0]}>
        <boxGeometry args={[width + 0.12, 0.16, width + 0.12]} />

        <meshStandardMaterial
          color="#0b1728"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Windows */}
      {windows.map((windowPosition, index) => (
        <mesh
          key={index}
          position={windowPosition}
        >
          <boxGeometry args={[0.15, 0.22, 0.025]} />

          <meshStandardMaterial
            color="#a7f3d0"
            emissive="#00ff9d"
            emissiveIntensity={2}
          />
        </mesh>
      ))}

      {/* Building light */}
      <pointLight
        position={[0, height * 0.5, 0]}
        intensity={3}
        distance={3}
        color={color}
      />

      {/* Label */}
      <Text
        position={[0, height + 0.65, 0]}
        fontSize={0.18}
        color="#dffcff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

/* =========================================================
   ANIMATED ENERGY BEAM
========================================================= */

function EnergyBeam({
  start,
  end,
}: {
  start: [number, number, number];
  end: [number, number, number];
}) {
  const beam = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (beam.current) {
      const material = beam.current
        .material as THREE.MeshBasicMaterial;

      material.opacity =
        0.45 + Math.sin(state.clock.elapsedTime * 4) * 0.25;
    }
  });

  const startVector = new THREE.Vector3(...start);
  const endVector = new THREE.Vector3(...end);

  const direction = new THREE.Vector3()
    .subVectors(endVector, startVector);

  const length = direction.length();

  const midpoint = new THREE.Vector3()
    .addVectors(startVector, endVector)
    .multiplyScalar(0.5);

  const geometry = new THREE.CylinderGeometry(
    0.025,
    0.025,
    length,
    8
  );

  const material = new THREE.MeshBasicMaterial({
    color: "#00e5ff",
    transparent: true,
    opacity: 0.7,
  });

  const quaternion = new THREE.Quaternion();

  quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.normalize()
  );

  return (
    <mesh
      ref={beam}
      geometry={geometry}
      material={material}
      position={midpoint}
      quaternion={quaternion}
    />
  );
}

/* =========================================================
   ENERGY PARTICLES
========================================================= */

function EnergyParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 100 }, () => ({
      position: [
        (Math.random() - 0.5) * 15,
        Math.random() * 4,
        (Math.random() - 0.5) * 12,
      ] as [number, number, number],
      size: 0.015 + Math.random() * 0.025,
    }));
  }, []);

  return (
    <group>
      {particles.map((particle, index) => (
        <mesh
          key={index}
          position={particle.position}
        >
          <sphereGeometry
            args={[particle.size, 8, 8]}
          />

          <meshBasicMaterial
            color="#00e5ff"
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   CENTRAL PLATFORM
========================================================= */

function Platform() {
  return (
    <group>

      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[2.2, 2.2, 0.15, 64]} />

        <meshStandardMaterial
          color="#061525"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0.18, 0]}
      >
        <torusGeometry args={[2, 0.035, 16, 100]} />

        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={4}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   SCENE
========================================================= */

function Scene() {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.35} />

      {/* Main blue light */}
      <pointLight
        position={[0, 6, 4]}
        intensity={100}
        color="#00e5ff"
      />

      {/* Green light */}
      <pointLight
        position={[-5, 3, -4]}
        intensity={60}
        color="#00ff9d"
      />

      <Environment preset="night" />

      {/* Platform */}
      <Platform />

      {/* Energy Core */}
      <EnergyCore />

      {/* Residential */}
      <Building
        position={[-4, 0, 1]}
        height={2.4}
        width={1.35}
        color="#075985"
        label="RESIDENTIAL"
      />

      {/* Commercial */}
      <Building
        position={[4, 0, 1]}
        height={3.5}
        width={1.5}
        color="#164e63"
        label="COMMERCIAL"
      />

      {/* Industrial */}
      <Building
        position={[4, 0, -4]}
        height={4.2}
        width={1.65}
        color="#3730a3"
        label="INDUSTRIAL"
      />

      {/* Smart Home */}
      <Building
        position={[-4, 0, -4]}
        height={2}
        width={1.25}
        color="#047857"
        label="SMART HOME"
      />

      {/* Energy connections */}
      <EnergyBeam
        start={[-3.4, 1.1, 1]}
        end={[-1.2, 1.35, 0]}
      />

      <EnergyBeam
        start={[3.3, 1.6, 1]}
        end={[1.2, 1.35, 0]}
      />

      <EnergyBeam
        start={[-3.4, 1, -4]}
        end={[-1.2, 1.35, 0]}
      />

      <EnergyBeam
        start={[3.2, 2, -4]}
        end={[1.2, 1.35, 0]}
      />

      {/* Particles */}
      <EnergyParticles />

      {/* Ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
      >
        <planeGeometry args={[18, 16]} />

        <meshStandardMaterial
          color="#020817"
          metalness={0.5}
          roughness={0.75}
        />
      </mesh>

      {/* Grid */}
      <gridHelper
        args={[
          18,
          18,
          "#0e7490",
          "#082f49",
        ]}
        position={[0, 0.01, 0]}
      />

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        minDistance={7}
        maxDistance={16}
        maxPolarAngle={Math.PI / 2.15}
        minPolarAngle={Math.PI / 4}
      />
    </>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function SmartGrid3D() {
  return (
    <div className="relative h-[620px] w-full overflow-hidden rounded-[28px] border border-cyan-400/20 bg-[#020817] shadow-[0_0_80px_rgba(0,229,255,0.08)]">

      {/* Top status */}
      <div className="pointer-events-none absolute left-6 top-5 z-10">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />

          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
            Live Energy Network
          </span>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          AI-powered real-time visualization
        </p>
      </div>

      {/* Prediction badge */}
      <div className="pointer-events-none absolute right-6 top-5 z-10 rounded-2xl border border-cyan-400/20 bg-slate-950/70 px-5 py-3 backdrop-blur">
        <p className="text-xs uppercase tracking-wider text-slate-500">
          AI Prediction
        </p>

        <p className="mt-1 text-2xl font-bold text-cyan-300">
          4.21 kW
        </p>

        <p className="text-xs text-emerald-400">
          Random Forest • 99.90% R²
        </p>
      </div>

      {/* Bottom information */}
      <div className="pointer-events-none absolute bottom-5 left-6 right-6 z-10 flex items-end justify-between">

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            SmartGrid AI
          </p>

          <p className="mt-1 text-sm text-slate-300">
            Predict • Monitor • Optimize
          </p>
        </div>

        <div className="rounded-full border border-cyan-400/20 bg-slate-950/70 px-4 py-2 text-xs text-cyan-300 backdrop-blur">
          Drag to explore 3D network
        </div>

      </div>

      <Canvas
        camera={{
          position: [10, 7, 12],
          fov: 42,
        }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}