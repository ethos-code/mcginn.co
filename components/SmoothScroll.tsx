'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

// Module-level handle so the case-study modal can pause/resume smooth
// scrolling without prop drilling or context.
let lenisInstance: Lenis | null = null;

/** Stop the document smooth-scroll loop (use when locking body). */
export function pauseSmoothScroll() {
  lenisInstance?.stop();
}

/** Restart the document smooth-scroll loop. */
export function resumeSmoothScroll() {
  lenisInstance?.start();
}

/**
 * Mounts Lenis once at the root for slow, eased document scrolling.
 * Tuned for "elegant" feel: slightly damped, eases out on settle.
 *
 * Respects `prefers-reduced-motion` — falls back to native scroll.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      // Slower, more deliberate. ~1.4s typical wheel.
      duration: 1.4,
      // Ease-out exponential: fast start, soft settle.
      easing: (t) => 1 - Math.pow(2, -10 * t),
      smoothWheel: true,
      // A touch under 1.0 to feel calmer without dragging.
      wheelMultiplier: 0.9,
      // Native touch scrolling on mobile — Lenis on touch can feel laggy.
      touchMultiplier: 1,
      syncTouch: false,
    });

    lenisInstance = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      if (lenisInstance === lenis) lenisInstance = null;
    };
  }, []);

  return null;
}
