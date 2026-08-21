"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { CanvasErrorBoundary } from "./ErrorBoundary";
import { AIParticleField } from "./AIParticleField";
import { FloatingGeometry } from "./FloatingGeometry";

const isDev = process.env.NODE_ENV === "development";

export function Scene() {
  return (
    <div className="absolute inset-0 -z-10">
      <CanvasErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 60 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          style={{ background: "transparent" }}
        >
          {isDev && <Perf position="top-left" minimal />}

          <ambientLight intensity={0.2} />
          <pointLight position={[5, 5, 5]} intensity={1.5} color="#6366f1" />
          <pointLight position={[-5, -5, 3]} intensity={0.8} color="#a855f7" />

          <Suspense fallback={null}>
            <AIParticleField />
            <FloatingGeometry />
            <Preload all />
          </Suspense>

          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
