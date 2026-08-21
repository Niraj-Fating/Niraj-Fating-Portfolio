import { useEffect, useRef, useCallback } from "react";
import type { RefObject } from "react";

interface UseWebGLResizeOptions {
  /**
   * Called whenever the canvas container's size or device pixel ratio changes.
   * The R3F renderer is automatically resized; this callback lets you react
   * to the new dimensions for any extra logic (e.g. updating uniforms).
   */
  onResize?: (width: number, height: number, dpr: number) => void;
  /** Debounce delay in ms. Defaults to 100ms to avoid thrashing on drag-resize. */
  debounceMs?: number;
}

/**
 * useWebGLResize
 *
 * Attaches a ResizeObserver to a container element and a window listener for
 * `orientationchange` (mobile). When either fires it:
 *   1. Reads the true bounding size (accounts for CSS transforms, zoom, etc.)
 *   2. Reads window.devicePixelRatio (changes on OS display scaling)
 *   3. Calls onResize(width, height, dpr) so the caller can react
 *
 * R3F handles renderer.setSize / setPixelRatio internally via its own resize
 * system; this hook exists to give you accurate, debounced resize events with
 * the correct DPR so you can drive uniforms, camera aspect, etc. from outside
 * the render loop.
 *
 * @param containerRef  Ref to the element wrapping the <Canvas>
 * @param options       Optional callbacks and debounce tuning
 */
export function useWebGLResize(
  containerRef: RefObject<HTMLElement | null>,
  { onResize, debounceMs = 100 }: UseWebGLResizeOptions = {}
): void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onResizeRef = useRef(onResize);

  // Keep callback ref stable so the observer doesn't re-bind on every render
  useEffect(() => {
    onResizeRef.current = onResize;
  }, [onResize]);

  const handleResize = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const el = containerRef.current;
      if (!el) return;

      const { width, height } = el.getBoundingClientRect();
      const dpr = window.devicePixelRatio ?? 1;

      onResizeRef.current?.(width, height, dpr);
    }, debounceMs);
  }, [containerRef, debounceMs]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // ResizeObserver: fires on element resize, CSS size changes, zoom, etc.
    const observer = new ResizeObserver(handleResize);
    observer.observe(el);

    // orientationchange: fires on mobile rotation — ResizeObserver alone
    // can be late or unreliable on some Android WebViews
    window.addEventListener("orientationchange", handleResize, { passive: true });

    // Initial measurement
    handleResize();

    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", handleResize);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [containerRef, handleResize]);
}
