"use client";

import { useSyncExternalStore } from "react";
import {
  BREAKPOINTS,
  resolveBreakpointKey,
} from "../config/breakpoints";
import type { BreakpointConfig, BreakpointKey } from "../types/network";

/** Stable SSR / hydration snapshot — must match server output. */
const SERVER_BREAKPOINT: BreakpointKey = "desktop";

function getSnapshot(): BreakpointKey {
  return resolveBreakpointKey(window.innerWidth);
}

function getServerSnapshot(): BreakpointKey {
  return SERVER_BREAKPOINT;
}

function subscribe(onStoreChange: () => void) {
  let raf = 0;
  const onResize = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(onStoreChange);
  };

  window.addEventListener("resize", onResize, { passive: true });
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
  };
}

/**
 * Subscribes to window resize and returns the active breakpoint key only
 * (no per-pixel width state → no hero re-renders during intra-breakpoint resize).
 *
 * Uses `useSyncExternalStore` so SSR and the first client render agree (desktop),
 * avoiding hydration mismatches when the viewport is mobile-sized.
 */
export function useBreakpoint(): {
  key: BreakpointKey;
  config: BreakpointConfig;
} {
  const key = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { key, config: BREAKPOINTS[key] };
}
