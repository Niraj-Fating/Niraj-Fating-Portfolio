"use client";

/**
 * SceneWrapper — Client Component
 *
 * Two responsibilities:
 *
 * 1. `ssr: false` dynamic import of SceneCanvas.
 *    `next/dynamic` with `ssr: false` is only valid inside Client Components.
 *    This wrapper exists solely to host the dynamic import so that
 *    page.tsx (a Server Component) can render it without errors.
 *
 *    Effect on Lighthouse / Core Web Vitals:
 *    - The Three.js/R3F bundle (~500 KB gzipped) is split into its own chunk.
 *    - It is NOT part of the initial HTML parse — the document is fully parsed
 *      and FCP fires before WebGL JS is even fetched.
 *    - This keeps LCP and FCP scores high regardless of GPU initialisation time.
 *
 * 2. useGLTF.preload() calls.
 *    Any GLTF/GLB assets used in the scene must be preloaded here so the
 *    browser starts fetching them as soon as this component mounts, before
 *    the Canvas is ready. This eliminates model-pop-in on first render.
 *
 *    Add asset paths to GLTF_ASSETS as they are added to /public/models/.
 *    Currently none are used (procedural geometry only), but the pattern
 *    is wired for future use.
 */

import dynamic from "next/dynamic";
import { useGLTF } from "@react-three/drei";

// ─── GLTF asset preload registry ──────────────────────────────────────────────
// Add paths relative to /public here when GLTF models are introduced.
// useGLTF.preload() fires the fetch eagerly in the background via drei's
// asset cache so the Canvas <Suspense> resolves immediately.
//
// Example:
//   useGLTF.preload("/models/brain.glb");
//   useGLTF.preload("/models/chip.glb");
//
const GLTF_ASSETS: string[] = [
  // No GLTF assets currently — all geometry is procedural (InstancedMesh, SphereGeometry, etc.)
  // Add model paths here as they are placed in /public/models/
];

// Trigger preloads at module evaluation time (before component mount)
// This is safe to call outside a component — drei caches the result.
GLTF_ASSETS.forEach((path) => useGLTF.preload(path));

// ─── Dynamic import — SSR disabled ────────────────────────────────────────────
// The Canvas and all Three.js code is loaded client-side only.
// `loading: undefined` is intentional — the Suspense fallback in layout.tsx
// (<Loader />) handles the visual loading state. We do NOT want a duplicate
// spinner here.
const SceneCanvasDynamic = dynamic(
  () => import("@/components/canvas/SceneCanvas").then((m) => m.SceneCanvas),
  {
    ssr: false,
    loading: () => null, // Null: let the global Suspense/Loader handle it
  }
);

export function SceneWrapper() {
  return <SceneCanvasDynamic />;
}
