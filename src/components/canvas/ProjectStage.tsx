"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { resumeData, type ResumeProject } from "@/data/resume";
import { Sparkles, Eye } from "lucide-react";

interface ProjectNodeProps {
  project: ResumeProject;
  position: [number, number, number];
  onSelect: (project: ResumeProject) => void;
}

function ProjectNode({ project, position, onSelect }: ProjectNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.5;
      meshRef.current.rotation.y = t * 0.8;
      // Gentle floating bobbing
      meshRef.current.position.y = Math.sin(t * 1.5 + position[0]) * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.6;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* 3D Geometry Core */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(project);
        }}
        scale={hovered ? 1.25 : 1.0}
      >
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={project.color}
          emissive={project.color}
          emissiveIntensity={hovered ? 0.9 : 0.4}
          roughness={0.2}
          metalness={0.8}
          wireframe={!hovered}
        />
      </mesh>

      {/* Orbiting Orbital Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[0.55, 0.6, 32]} />
        <meshBasicMaterial
          color={project.accentColor}
          side={THREE.DoubleSide}
          transparent
          opacity={hovered ? 0.8 : 0.35}
        />
      </mesh>

      {/* Point light on the node */}
      <pointLight
        color={project.color}
        intensity={hovered ? 2.5 : 1.0}
        distance={3}
      />

      {/* Anchored 2D HTML Tag via @react-three/drei */}
      <Html
        position={[0, -0.65, 0]}
        center
        distanceFactor={8}
        zIndexRange={[10, 0]}
        className="pointer-events-auto select-none"
      >
        <div
          onClick={() => onSelect(project)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg ${
            hovered
              ? "bg-surface-0/95 border-accent scale-105 shadow-accent/20"
              : "bg-surface-0/70 border-border/70 text-muted hover:text-primary hover:border-accent/40"
          }`}
          style={{
            borderColor: hovered ? project.color : undefined,
          }}
        >
          <div
            className="w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: project.color }}
          />
          <div className="text-left">
            <p className="text-[11px] font-bold text-primary font-mono tracking-tight flex items-center gap-1">
              {project.title}
              <Sparkles className="w-2.5 h-2.5 text-accent opacity-80" />
            </p>
            <p className="text-[9px] font-mono text-muted/70">
              {project.skills.join(" • ")}
            </p>
          </div>
          <button
            aria-label={`Inspect ${project.title}`}
            className="p-1 rounded-md bg-surface-1/80 text-accent group-hover:bg-accent group-hover:text-black transition-colors ml-1"
          >
            <Eye className="w-3 h-3" />
          </button>
        </div>
      </Html>
    </group>
  );
}

interface ProjectStageProps {
  onSelectProject: (project: ResumeProject) => void;
}

export function ProjectStage({ onSelectProject }: ProjectStageProps) {
  // Coordinates mapped in front of the project scroll keyframe
  const nodePositions: [number, number, number][] = [
    [-2.2, -1.8, 1.2], // Spam Detection System
    [ 2.2, -1.8, 1.2], // AI-Powered E-Newspaper
  ];

  return (
    <group name="ProjectStage">
      {resumeData.projects.map((project, idx) => (
        <ProjectNode
          key={project.id}
          project={project}
          position={nodePositions[idx] || [0, -1.8, 1.2]}
          onSelect={onSelectProject}
        />
      ))}
    </group>
  );
}
