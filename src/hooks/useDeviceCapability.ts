import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type GpuTier = "low" | "mid" | "high";

export interface DeviceCapability {
  /** Detected GPU performance tier */
  tier: GpuTier;
  /** Whether the device supports enough GPU bandwidth for heavy post-processing */
  canRunPostFX: boolean;
  /** Recommended pixel ratio cap (1 for low, 1.5 for mid, 2 for high) */
  dprCap: number;
  /** Whether FPS dropped below the grace threshold during the probe */
  isLowFPS: boolean;
  /** Live FPS sample (updated every second during the probe) */
  fps: number;
  /** True once the probe has finished (≥30 frames collected) */
  ready: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LOW_FPS_THRESHOLD = 30;
const MID_FPS_THRESHOLD = 50;
const PROBE_FRAMES = 60; // Collect 60 frames before deciding

// ─── GPU String Heuristic ─────────────────────────────────────────────────────

function probeGpuTierFromRenderer(renderer: string): GpuTier {
  const r = renderer.toLowerCase();

  // Integrated / software GPUs
  if (
    r.includes("swiftshader") ||
    r.includes("llvmpipe") ||
    r.includes("intel hd") ||
    r.includes("intel uhd") ||
    r.includes("mali-4") ||
    r.includes("adreno 3")
  ) {
    return "low";
  }

  // Mid-range mobile / older discrete
  if (
    r.includes("adreno 5") ||
    r.includes("adreno 6") ||
    r.includes("mali-g") ||
    r.includes("apple a1") ||
    r.includes("apple a12") ||
    r.includes("gtx 9") ||
    r.includes("gtx 10")
  ) {
    return "mid";
  }

  // Assume high for everything else (modern discrete, apple silicon, rtx series)
  return "high";
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useDeviceCapability
 *
 * Probes GPU string + live FPS to decide render quality:
 * - tier: 'low' | 'mid' | 'high'
 * - canRunPostFX: false when tier is low OR live FPS drops below 30
 * - dprCap: pixel ratio cap recommended for the Canvas dpr prop
 *
 * The hook runs a 60-frame RAF probe on mount; `ready` flips true once done.
 */
export function useDeviceCapability(): DeviceCapability {
  const [state, setState] = useState<DeviceCapability>({
    tier: "high",
    canRunPostFX: true,
    dprCap: 2,
    isLowFPS: false,
    fps: 60,
    ready: false,
  });

  const rafRef = useRef<number>(0);

  useEffect(() => {
    // ── GPU tier from WebGL renderer string ──────────────────────────────────
    let gpuTier: GpuTier = "high";

    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ??
        canvas.getContext("webgl") ??
        canvas.getContext("experimental-webgl");

      if (gl && "getExtension" in gl) {
        const ext = (gl as WebGLRenderingContext).getExtension(
          "WEBGL_debug_renderer_info"
        );
        if (ext) {
          const renderer = (gl as WebGLRenderingContext).getParameter(
            ext.UNMASKED_RENDERER_WEBGL
          ) as string;
          gpuTier = probeGpuTierFromRenderer(renderer);
        }
      }
    } catch {
      // Sandboxed / privacy mode — default to mid
      gpuTier = "mid";
    }

    // ── FPS probe over PROBE_FRAMES frames ───────────────────────────────────
    let frameCount = 0;
    let lastTime = performance.now();
    let totalTime = 0;

    const probe = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;
      totalTime += delta;
      frameCount++;

      if (frameCount < PROBE_FRAMES) {
        rafRef.current = requestAnimationFrame(probe);
        return;
      }

      // Compute average FPS over the probe window
      const avgFps = Math.round((frameCount / totalTime) * 1000);
      const isLowFPS = avgFps < LOW_FPS_THRESHOLD;

      // Override GPU tier downward if FPS is critically low
      const effectiveTier: GpuTier =
        isLowFPS ? "low"
        : avgFps < MID_FPS_THRESHOLD ? (gpuTier === "high" ? "mid" : gpuTier)
        : gpuTier;

      const dprCap =
        effectiveTier === "low" ? 1
        : effectiveTier === "mid" ? 1.5
        : 2;

      setState({
        tier: effectiveTier,
        canRunPostFX: effectiveTier !== "low" && !isLowFPS,
        dprCap,
        isLowFPS,
        fps: avgFps,
        ready: true,
      });
    };

    rafRef.current = requestAnimationFrame(probe);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return state;
}
