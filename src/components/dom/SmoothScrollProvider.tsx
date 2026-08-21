"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Context ──────────────────────────────────────────────────────────────────
interface SmoothScrollContextValue {
  lenis: Lenis | null;
  /** Normalized scroll progress 0-1 driven by Lenis (RAF-synced, no jank) */
  progress: number;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  progress: 0,
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────
interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Initialise Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Bridge Lenis into GSAP ScrollTrigger's virtual scroll ticker
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis inside GSAP's RAF so everything is frame-synced
    const gsapTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(gsapTicker);
    gsap.ticker.lagSmoothing(0);

    // Expose normalized progress to consumers (e.g. camera scroll driver)
    lenis.on("scroll", ({ progress: p }: { progress: number }) => {
      setProgress(p);
    });

    return () => {
      gsap.ticker.remove(gsapTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisRef.current, progress }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
