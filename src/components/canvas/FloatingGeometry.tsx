"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GeomProps {
  position: [number, number, number];
  rotation: [number, number, number];
  speed: number;
  color: string;
  wireframe?: boolean;
}

function FloatingMesh({ position, rotation, speed, color, wireframe = false }: GeomProps) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed;
    meshRef.current.rotation.x = rotation[0] + t;
    meshRef.current.rotation.y = rotation[1] + t * 0.7;
    meshRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[0.6, 0]} />
      <meshStandardMaterial
        color={color}
        wireframe={wireframe}
        transparent
        opacity={wireframe ? 0.3 : 0.08}
        emissive={color}
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

export function FloatingGeometry() {
  const geometries: GeomProps[] = [
    { position: [-3.5, 1.5, -2], rotation: [0.2, 0.3, 0], speed: 0.15, color: "#6366f1" },
    { position: [3.5, -1, -3], rotation: [0.5, 0.1, 0.2], speed: 0.1, color: "#8b5cf6", wireframe: true },
    { position: [0, 2.5, -4], rotation: [0.1, 0.6, 0.1], speed: 0.08, color: "#a855f7" },
    { position: [-2, -2, -3], rotation: [0.3, 0.2, 0.4], speed: 0.12, color: "#7c3aed", wireframe: true },
    { position: [2.5, 1.8, -5], rotation: [0.4, 0.1, 0.3], speed: 0.07, color: "#4f46e5" },
  ];

  return (
    <>
      {geometries.map((g, i) => (
        <FloatingMesh key={i} {...g} />
      ))}
    </>
  );
}
