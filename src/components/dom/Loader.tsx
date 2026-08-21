"use client";

import React from "react";

export function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface-0">
      {/* Orbital spinner */}
      <div className="relative w-20 h-20 mb-6">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border border-accent-subtle animate-spin-slow" />
        {/* Inner pulse */}
        <div className="absolute inset-2 rounded-full border border-accent/60 animate-spin-reverse" />
        {/* Core glow */}
        <div className="absolute inset-4 rounded-full bg-accent/20 animate-pulse-glow" />
        {/* Center dot */}
        <div className="absolute inset-[38%] rounded-full bg-accent" />
      </div>

      {/* Text */}
      <p className="font-mono text-xs text-muted tracking-[0.3em] uppercase animate-pulse">
        Initializing
      </p>
    </div>
  );
}
