"use client";

import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface CanvasErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * CanvasErrorBoundary
 *
 * Wraps the R3F <Canvas> to catch WebGL context loss crashes.
 * On failure, renders a CSS-only animated gradient fallback so the page
 * remains visually rich even when WebGL is unavailable (mobile GPU limits,
 * Chrome flags, etc.). This keeps FCP & CLS unaffected.
 */
export class CanvasErrorBoundary extends React.Component<
  CanvasErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: CanvasErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log but do not re-throw — we handle it gracefully
    console.warn("[WebGL ErrorBoundary] Context lost or render error:", error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <WebGLFallback />;
    }
    return this.props.children;
  }
}

/**
 * WebGLFallback
 *
 * Pure CSS animated background shown when WebGL fails.
 * Uses only CSS gradients + keyframe animations — zero JS, zero Three.js,
 * no external assets. Renders instantly and occupies the same absolute
 * inset-0 slot as the Canvas so layout is unaffected.
 *
 * Visual design: dark nebula with slow-drifting conic/radial gradients
 * mimicking the colour palette of the neural network shader.
 */
function WebGLFallback() {
  return (
    <div
      className="absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Base dark field */}
      <div className="absolute inset-0 bg-[#020408]" />

      {/* Slow-drifting indigo nebula — CSS-only, no JS */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 80% 60% at 20% 30%, #6366f118 0%, transparent 60%)",
            "radial-gradient(ellipse 70% 80% at 80% 70%, #a855f712 0%, transparent 55%)",
            "radial-gradient(ellipse 60% 50% at 50% 10%, #818cf808 0%, transparent 50%)",
          ].join(", "),
          animation: "nebulaDrift 20s ease-in-out infinite alternate",
        }}
      />

      {/* Grid overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: [
            "linear-gradient(#6366f1 1px, transparent 1px)",
            "linear-gradient(90deg, #6366f1 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "48px 48px",
        }}
      />

      {/* Corner glow accent */}
      <div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #6366f1 0%, transparent 70%)",
          animation: "pulseGlow 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, #a855f7 0%, transparent 70%)",
          animation: "pulseGlow 10s ease-in-out infinite 2s",
        }}
      />

      {/* Inline keyframes */}
      <style>{`
        @keyframes nebulaDrift {
          0%   { transform: scale(1)    translateX(0)    translateY(0); }
          50%  { transform: scale(1.04) translateX(-1%)  translateY(1%); }
          100% { transform: scale(1.02) translateX(1%)   translateY(-1%); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50%       { opacity: 0.25; transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}
