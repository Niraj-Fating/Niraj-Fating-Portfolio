"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useSmoothScroll } from "@/components/dom/SmoothScrollProvider";

// ─── Camera keyframes ─────────────────────────────────────────────────────────
// Each entry: [scrollProgress 0-1, position, lookAt]
// Gives a smooth "fly-through" as the user scrolls down the page.
const KEYFRAMES: Array<{
  t: number;
  position: [number, number, number];
  target: [number, number, number];
}> = [
  { t: 0.00, position: [0,  0,  6], target: [0,  0, 0] }, // Hero
  { t: 0.30, position: [1.5, -1, 5], target: [0, -0.5, 0] }, // About
  { t: 0.65, position: [-1, -2, 4.5], target: [0, -1.5, 0] }, // Projects
  { t: 1.00, position: [0, -3, 5], target: [0, -2.5, 0] }, // Contact
];

// Build a CatmullRom spline from the keyframes for buttery interpolation
const positionSpline = new THREE.CatmullRomCurve3(
  KEYFRAMES.map(({ position }) => new THREE.Vector3(...position)),
  false,
  "catmullrom",
  0.5
);

const targetSpline = new THREE.CatmullRomCurve3(
  KEYFRAMES.map(({ target }) => new THREE.Vector3(...target)),
  false,
  "catmullrom",
  0.5
);

// ─── Component ────────────────────────────────────────────────────────────────

const _camPos = new THREE.Vector3();
const _camTarget = new THREE.Vector3();
const _smoothProgress = { value: 0 };

/**
 * CameraScrollDriver
 *
 * An R3F inner component (rendered inside <Canvas>) that reads Lenis scroll
 * progress from context and lerps the camera along a CatmullRom spline.
 * The lerp factor gives a pleasant "lag" — the camera follows the page
 * but with inertia, complementing the Lenis smooth scroll feel.
 *
 * Must be placed *inside* <Canvas>.
 */
export function CameraScrollDriver() {
  const { camera } = useThree();
  const { progress } = useSmoothScroll();
  const targetProgressRef = useRef(0);

  useFrame((_, delta) => {
    // Smooth the progress with an exponential decay lerp
    // Clamp delta to avoid huge jumps on tab-switch
    const dt = Math.min(delta, 0.1);
    const lerpFactor = 1 - Math.exp(-5 * dt);

    targetProgressRef.current = THREE.MathUtils.lerp(
      targetProgressRef.current,
      progress,
      lerpFactor
    );

    const t = THREE.MathUtils.clamp(targetProgressRef.current, 0, 1);

    // Sample splines
    positionSpline.getPoint(t, _camPos);
    targetSpline.getPoint(t, _camTarget);

    // Apply to camera
    camera.position.copy(_camPos);
    camera.lookAt(_camTarget);
  });

  return null;
}
