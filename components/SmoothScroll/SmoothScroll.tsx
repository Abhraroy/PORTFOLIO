"use client";

// Lenis disabled — using native browser scroll instead.
// To re-enable: uncomment the Lenis imports / ReactLenis wrapper below,
// and remove the pass-through return.
// import { ReactLenis, useLenis } from "lenis/react";
// import { useEffect, type ReactNode } from "react";
// import { syncLenisScrollTrigger } from "@/lib/gsap/scrollTrigger";
import type { ReactNode } from "react";

type SmoothScrollProps = {
  children: ReactNode;
};

// /** Keeps GSAP ScrollTrigger in sync with Lenis scroll position. */
// function ScrollTriggerSync() {
//   const lenis = useLenis();
//
//   useEffect(() => {
//     if (!lenis) return;
//     return syncLenisScrollTrigger(lenis);
//   }, [lenis]);
//
//   return null;
// }

/**
 * Scroll root for the app.
 * Lenis smooth-scroll is commented out; children render with native scroll.
 *
 * Previous Lenis setup (restore by uncommenting):
 * <ReactLenis root options={{ lerp: 0.14, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.5 }}>
 *   <ScrollTriggerSync />
 *   {children}
 * </ReactLenis>
 */
export default function SmoothScroll({ children }: SmoothScrollProps) {
  return <>{children}</>;
}
