"use client";

import React, { Suspense, useState, useRef, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { CanvasErrorBoundary } from "./ErrorBoundary";
import { NeuralNetwork } from "./NeuralNetwork";
import { FloatingGeometry } from "./FloatingGeometry";
import { ProjectStage } from "./ProjectStage";
import { CameraScrollDriver } from "./CameraScrollDriver";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import { useWebGLResize } from "@/hooks/useWebGLResize";
import { type ResumeProject } from "@/data/resume";
import { ProjectModal } from "@/components/dom/ProjectModal";

const isDev = process.env.NODE_ENV === "development";

// ─── Inner scene graph ────────────────────────────────────────────────────────

function SceneGraph({ canRunPostFX, onSelectProject }: { canRunPostFX: boolean; onSelectProject: (p: ResumeProject) => void }) {
  return (
    <>
      {/* Dev perf overlay — only mounted in development */}
      {isDev && <Perf position="top-left" minimal />}

      {/* Lighting rig */}
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]}  intensity={2.0} color="#6366f1" />
      <pointLight position={[-5, -5, 3]} intensity={1.0} color="#a855f7" />
      <pointLight position={[0, 8, -5]}  intensity={0.5} color="#818cf8" />

      {/* Async scene objects */}
      <Suspense fallback={null}>
        {/* NeuralNetwork: hero - 1000-node InstancedMesh, custom GLSL */}
        <NeuralNetwork />
        {/* ProjectStage: interactive 3D project nodes with Html anchors */}
        <ProjectStage onSelectProject={onSelectProject} />
        {/* FloatingGeometry: ambient background polyhedra for depth */}
        <FloatingGeometry />
        <Preload all />
      </Suspense>

      {/* Camera animation driven by Lenis scroll progress */}
      <CameraScrollDriver />

      {/* Adaptive quality controls */}
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </>
  );
}

// ─── SceneCanvas ──────────────────────────────────────────────────────────────

/**
 * SceneCanvas
 *
 * The full 3D scene harness. Responsibilities:
 *  - Camera: fov 45, near 0.1, far 1000 (spec)
 *  - GL context: antialias, high-performance power preference, alpha
 *  - DPR capped by useDeviceCapability (hardware-adaptive quality)
 *  - WebGL resize: ResizeObserver + orientationchange via useWebGLResize
 *  - Scroll: CameraScrollDriver inside the Canvas reads Lenis progress
 *  - Error boundary: CanvasErrorBoundary catches WebGL context loss
 */
export function SceneCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { dprCap, canRunPostFX, ready } = useDeviceCapability();

  // ── Modal state (lives in DOM, bridged from 3D click events) ──
  const [selectedProject, setSelectedProject] = useState<ResumeProject | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSelectProject = useCallback((project: ResumeProject) => {
    setSelectedProject(project);
    setModalOpen(true);
  }, []);

  // ResizeObserver - logs size changes; R3F handles actual renderer resize
  const handleResize = useCallback(
    (width: number, height: number, dpr: number) => {
      if (isDev) {
        console.debug(
          `[SceneCanvas] Resize: ${Math.round(width)}x${Math.round(height)} @ ${dpr.toFixed(2)}dpr`
        );
      }
    },
    []
  );

  useWebGLResize(containerRef, { onResize: handleResize, debounceMs: 80 });

  return (
    <>
      <div
        ref={containerRef}
        className="absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <CanvasErrorBoundary>
          <Canvas
            camera={{
              fov: 45,
              near: 0.1,
              far: 1000,
              position: [0, 0, 6],
            }}
            // Cap DPR based on detected hardware tier; R3F clamps to device max
            dpr={[1, ready ? dprCap : 1.5]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
              // Disable stencil buffer — not needed, saves memory bandwidth
              stencil: false,
              // Disable depth buffer write for transparent overlaid scenes
              // (keep depth for internal geometry sorting)
              depth: true,
            }}
            style={{ background: "transparent" }}
            // R3F frame-loop: 'always' ensures scroll-driven camera updates
            frameloop="always"
            // Performance target: aim for 60fps, degrade gracefully
            performance={{ min: 0.5 }}
          >
            <SceneGraph canRunPostFX={canRunPostFX} onSelectProject={handleSelectProject} />
          </Canvas>
        </CanvasErrorBoundary>
      </div>

      {/* Case study modal: rendered outside canvas so it sits in DOM z-stack */}
      <ProjectModal
        project={selectedProject}
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedProject(null); }}
      />
    </>
  );

}
