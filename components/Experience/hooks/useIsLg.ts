"use client";

import { useEffect, useState } from "react";

const LG_QUERY = "(min-width: 1024px)";

/**
 * Client-only lg breakpoint. `null` until mounted to avoid SSR mismatch.
 */
export function useIsLg(): boolean | null {
  const [isLg, setIsLg] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(LG_QUERY);
    const update = () => setIsLg(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isLg;
}
